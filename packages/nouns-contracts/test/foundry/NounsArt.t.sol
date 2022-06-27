// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { NounsArt } from '../../contracts/NounsArt.sol';
import { INounsArt } from '../../contracts/interfaces/INounsArt.sol';
import { Utils } from './helpers/Utils.sol';
import { SSTORE2 } from '../../contracts/libs/SSTORE2.sol';

contract NounsArtTest is Test, Utils {
    NounsArt art;
    address descriptor = address(1);

    function setUp() public {
        art = new NounsArt(descriptor);
    }

    ///
    /// setDescriptor and confirmDescriptor
    ///

    function testSetDescriptorRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.setDescriptor(address(2));
    }

    function testSetDescriptorDoesntSetYet() public {
        address newDescriptor = address(2);

        vm.prank(descriptor);
        art.setDescriptor(newDescriptor);

        assertEq(art.descriptor(), descriptor);
    }

    function testConfirmDescriptorRevertsIfSenderNotPendingDescriptor() public {
        address newDescriptor = address(2);

        vm.prank(descriptor);
        art.setDescriptor(newDescriptor);

        vm.expectRevert(INounsArt.SenderIsNotPendingDescriptor.selector);
        art.confirmDescriptor();
    }

    function testConfirmDescriptorSetsDescriptor() public {
        address newDescriptor = address(2);

        vm.prank(descriptor);
        art.setDescriptor(newDescriptor);

        vm.prank(newDescriptor);
        art.confirmDescriptor();

        assertEq(art.descriptor(), newDescriptor);
    }

    ///
    /// addBackground, addManyBackgrounds, backgroundsCount, backgrounds
    ///

    function testAddBackgroundRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.addBackground('ffffff');
    }

    function testAddBackgroundWorks() public {
        vm.prank(descriptor);
        art.addBackground('ffffff');

        assertEq(art.backgroundsCount(), 1);
        assertEq(art.backgrounds(0), 'ffffff');
    }

    function testAddManyBackgroundsRevertsIfSenderNotDescriptor() public {
        string[] memory bgs = new string[](2);
        bgs[0] = 'ffffff';
        bgs[1] = '000000';

        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.addManyBackgrounds(bgs);
    }

    function testAddManyBackgroundsWorks() public {
        string[] memory bgs = new string[](2);
        bgs[0] = 'ffffff';
        bgs[1] = '000000';

        vm.prank(descriptor);
        art.addManyBackgrounds(bgs);

        assertEq(art.backgroundsCount(), 2);
        assertEq(art.backgrounds(0), 'ffffff');
        assertEq(art.backgrounds(1), '000000');
    }

    ///
    /// setPalette, palettes, palettesPointers
    ///

    function testSetPaletteRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.setPalette(0, fromHex('ffffff'));
    }

    function testSetPaletteWorks() public {
        bytes memory palette0 = fromHex('ffffffc5b9a1');
        bytes memory palette1 = fromHex('cfc2ab63a0f9');
        vm.startPrank(descriptor);
        art.setPalette(0, palette0);
        art.setPalette(1, palette1);
        vm.stopPrank();

        assertEq(art.palettes(0), palette0);
        assertEq(art.palettes(1), palette1);

        assertEq(SSTORE2.read(art.palettesPointers(0)), palette0);
        assertEq(SSTORE2.read(art.palettesPointers(1)), palette1);
    }

    function testSetPaletteUpdatesAnExistingPalette() public {
        bytes memory paletteV1 = fromHex('ffffffc5b9a1');
        bytes memory paletteV2 = fromHex('cfc2ab63a0f9');

        vm.prank(descriptor);
        art.setPalette(0, paletteV1);
        assertEq(art.palettes(0), paletteV1);
        assertEq(SSTORE2.read(art.palettesPointers(0)), paletteV1);

        vm.prank(descriptor);
        art.setPalette(0, paletteV2);
        assertEq(art.palettes(0), paletteV2);
        assertEq(SSTORE2.read(art.palettesPointers(0)), paletteV2);
    }

    ///
    /// addBodies, addBodiesFromPointer, bodiesPageCount, bodiesPage, bodies
    ///

    function testAddBodiesRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.addBodies(fromHex('123456'), uint80(12), uint16(1));
    }

    function testAddBodiesWorksWithMultiplePages() public {
        vm.startPrank(descriptor);
        art.addBodies(fromHex(FIRST_TWO_IMAGES_COMPRESSED), FIRST_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        art.addBodies(fromHex(NEXT_TWO_IMAGES_COMPRESSED), NEXT_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        vm.stopPrank();

        _assertBodiesStoredOK();
    }

    function testAddBodiesFromPointerWorksWithMultiplePages() public {
        vm.startPrank(descriptor);
        art.addBodiesFromPointer(
            SSTORE2.write(fromHex(FIRST_TWO_IMAGES_COMPRESSED)),
            FIRST_TWO_IMAGES_DEFLATED_LENGTH,
            uint16(2)
        );
        art.addBodiesFromPointer(
            SSTORE2.write(fromHex(NEXT_TWO_IMAGES_COMPRESSED)),
            NEXT_TWO_IMAGES_DEFLATED_LENGTH,
            uint16(2)
        );
        vm.stopPrank();

        _assertBodiesStoredOK();
    }

    function _assertBodiesStoredOK() internal {
        assertEq(art.bodiesPageCount(), 2);

        INounsArt.NounArtStoragePage memory page = art.bodiesPage(0);
        assertEq(page.imageCount, 2);
        assertEq(page.decompressedLength, FIRST_TWO_IMAGES_DEFLATED_LENGTH);
        assertEq(SSTORE2.read(page.pointer), fromHex(FIRST_TWO_IMAGES_COMPRESSED));

        page = art.bodiesPage(1);
        assertEq(page.imageCount, 2);
        assertEq(page.decompressedLength, NEXT_TWO_IMAGES_DEFLATED_LENGTH);
        assertEq(SSTORE2.read(page.pointer), fromHex(NEXT_TWO_IMAGES_COMPRESSED));

        // These hard-coded values are copied from image-data.json -> images -> BODIES -> the first items
        assertEq(
            art.bodies(0),
            fromHex(
                '0015171f090e020e020e020e02020201000b02020201000b02020201000b02020201000b02020201000b02020201000b02020201000b02'
            )
        );
        assertEq(
            art.bodies(1),
            fromHex(
                '0015171f090e030e030e030e03020301000b03020301000b03020301000b03020301000b03020301000b03020301000b03020301000b03'
            )
        );

        // These hard-coded values are copied from image-data.json -> images -> HEADS -> the first items
        assertEq(
            art.bodies(2),
            fromHex(
                '0005191406030004800c0002000980080001000e80040002000f80020001001080020002000f80020002000f800200020001800e810200020001800e810200020001800e810200020001800e81020003800e8102000180018101800f8101000180018103800d82018005800d81018002001180'
            )
        );
        assertEq(
            art.bodies(3),
            fromHex(
                '00031c140306000e3a050006000e3a05000400023a0e00023a03000400023a0e00023a03000400023a0e00023a030002000207023a0e07023a02070100020001070126023a040706260407023a01260107010001000126010702260607042606070226010701000100012608070626080701000100013a16070100013a0100013a15070100013a0100013a15070100013a0107013a1607013a0107013a1607010018070100070703760e0701001807020016070100'
            )
        );
    }

    // the value below was copied from running the hardhat task `descriptor-art-to-console` with
    // the parameter `count` set to 2, and taking the bodies values.
    string constant FIRST_TWO_IMAGES_COMPRESSED =
        '6360c00b14f04b33301190772020bf8080bc3983a8b83c271f130432313132701345123016dd7c6608646206ea258a841b0000';
    uint80 constant FIRST_TWO_IMAGES_DEFLATED_LENGTH = 320;

    // the value below was copied from running the hardhat task `descriptor-art-to-console` with
    // the parameter `count` set to 2 and `start` set to 2, and taking the heads values.
    string constant NEXT_TWO_IMAGES_COMPRESSED =
        '858f410a02310c4593b4d38ee0548551145cb8ea21baf24e82eb8c77f23e1ec5df0e232a3a0dfcfcd7fc4253a2d93acdc72495fc5cc91f95fc42cda17786ac2ef1d6425b620a6ac12b15f01a7de4a9b386e1bf9bd25979605d0d5cc86877636db4c34c68a395953eea4ee6d81b4721353476ec9602647e1236f160483ce7ad3c4749d6bb6831e388337e955da2f31692d7acc5ad76e4b4cb9eb2b6dfe44b3a39ed21efcd351416cab3b77a02';
    uint80 constant NEXT_TWO_IMAGES_DEFLATED_LENGTH = 512;
}
