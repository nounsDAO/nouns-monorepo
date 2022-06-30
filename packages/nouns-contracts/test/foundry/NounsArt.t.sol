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

    function testCannotSetEmptyPalette() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.EmptyPalette.selector);
        art.setPalette(0, new bytes(0));
    }

    function testCannotSetPaletteWithLengthNotAMultipleOf3() public {
        vm.startPrank(descriptor);

        vm.expectRevert(INounsArt.BadPaletteLength.selector);
        art.setPalette(0, new bytes(1));

        vm.expectRevert(INounsArt.BadPaletteLength.selector);
        art.setPalette(0, new bytes(2));

        // expected to work
        art.setPalette(0, new bytes(3));

        vm.expectRevert(INounsArt.BadPaletteLength.selector);
        art.setPalette(0, new bytes(4));

        vm.expectRevert(INounsArt.BadPaletteLength.selector);
        art.setPalette(0, new bytes(5));

        // expected to work
        art.setPalette(0, new bytes(6));

        vm.expectRevert(INounsArt.BadPaletteLength.selector);
        art.setPalette(0, new bytes(7));

        vm.stopPrank();
    }

    function testCannotSetPaletteWithMoreThan256Colors() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadPaletteLength.selector);
        art.setPalette(0, new bytes(769));
    }

    ///
    /// addBodies, addBodiesFromPointer, bodies, bodiesTrait
    ///

    function testAddBodiesRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.addBodies(fromHex('123456'), uint80(12), uint16(1));
    }

    function testCannotAddBodiesWithNoBytes() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.EmptyBytes.selector);
        art.addBodies(new bytes(0), 0, 0);
    }

    function testCannotAddBodiesWithZeroDecompressedLength() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addBodies(fromHex(FIRST_TWO_IMAGES_COMPRESSED), 0, 0);
    }

    function testCannotAddBodiesWithZeroImageCount() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addBodies(fromHex(FIRST_TWO_IMAGES_COMPRESSED), FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddBodiesWorksWithMultiplePages() public {
        assertEq(art.bodiesTrait().storedImagesCount, 0);

        vm.startPrank(descriptor);
        art.addBodies(fromHex(FIRST_TWO_IMAGES_COMPRESSED), FIRST_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        art.addBodies(fromHex(NEXT_TWO_IMAGES_COMPRESSED), NEXT_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        vm.stopPrank();

        _assertBodiesStoredOK();
    }

    function testCannotAddBodiesFromPointerWithZeroDecompressedLength() public {
        address pointer = SSTORE2.write(fromHex(FIRST_TWO_IMAGES_COMPRESSED));
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addBodiesFromPointer(pointer, 0, 0);
    }

    function testCannotAddBodiesFromPointerWithZeroImageCount() public {
        address pointer = SSTORE2.write(fromHex(FIRST_TWO_IMAGES_COMPRESSED));
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addBodiesFromPointer(pointer, FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddBodiesFromPointerWorksWithMultiplePages() public {
        assertEq(art.bodiesTrait().storedImagesCount, 0);

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

    ///
    /// addAccessories, addAccessoriesFromPointer, accessories, accessoriesTrait
    ///

    function testAddAccessoriesRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.addAccessories(fromHex('123456'), uint80(12), uint16(1));
    }

    function testCannotAddAccessoriesWithNoBytes() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.EmptyBytes.selector);
        art.addAccessories(new bytes(0), 0, 0);
    }

    function testCannotAddAccessoriesWithZeroDecompressedLength() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addAccessories(fromHex(FIRST_TWO_IMAGES_COMPRESSED), 0, 0);
    }

    function testCannotAddAccessoriesWithZeroImageCount() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addAccessories(fromHex(FIRST_TWO_IMAGES_COMPRESSED), FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddAccessoriesWorksWithMultiplePages() public {
        assertEq(art.accessoriesTrait().storedImagesCount, 0);

        vm.startPrank(descriptor);
        art.addAccessories(fromHex(FIRST_TWO_IMAGES_COMPRESSED), FIRST_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        art.addAccessories(fromHex(NEXT_TWO_IMAGES_COMPRESSED), NEXT_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        vm.stopPrank();

        _assertAccessoriesStoredOK();
    }

    function testCannotAddAccessoriesFromPointerWithZeroDecompressedLength() public {
        address pointer = SSTORE2.write(fromHex(FIRST_TWO_IMAGES_COMPRESSED));
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addAccessoriesFromPointer(pointer, 0, 0);
    }

    function testCannotAddAccessoriesFromPointerWithZeroImageCount() public {
        address pointer = SSTORE2.write(fromHex(FIRST_TWO_IMAGES_COMPRESSED));
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addAccessoriesFromPointer(pointer, FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddAccessoriesFromPointerWorksWithMultiplePages() public {
        assertEq(art.accessoriesTrait().storedImagesCount, 0);

        vm.startPrank(descriptor);
        art.addAccessoriesFromPointer(
            SSTORE2.write(fromHex(FIRST_TWO_IMAGES_COMPRESSED)),
            FIRST_TWO_IMAGES_DEFLATED_LENGTH,
            uint16(2)
        );
        art.addAccessoriesFromPointer(
            SSTORE2.write(fromHex(NEXT_TWO_IMAGES_COMPRESSED)),
            NEXT_TWO_IMAGES_DEFLATED_LENGTH,
            uint16(2)
        );
        vm.stopPrank();

        _assertAccessoriesStoredOK();
    }

    ///
    /// addHeads, addHeadsFromPointer, heads, headsTrait
    ///

    function testAddHeadsRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.addHeads(fromHex('123456'), uint80(12), uint16(1));
    }

    function testCannotAddHeadsWithNoBytes() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.EmptyBytes.selector);
        art.addHeads(new bytes(0), 0, 0);
    }

    function testCannotAddHeadsWithZeroDecompressedLength() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addHeads(fromHex(FIRST_TWO_IMAGES_COMPRESSED), 0, 0);
    }

    function testCannotAddHeadsWithZeroImageCount() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addHeads(fromHex(FIRST_TWO_IMAGES_COMPRESSED), FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddHeadsWorksWithMultiplePages() public {
        assertEq(art.headsTrait().storedImagesCount, 0);

        vm.startPrank(descriptor);
        art.addHeads(fromHex(FIRST_TWO_IMAGES_COMPRESSED), FIRST_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        art.addHeads(fromHex(NEXT_TWO_IMAGES_COMPRESSED), NEXT_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        vm.stopPrank();

        _assertHeadsStoredOK();
    }

    function testCannotAddHeadsFromPointerWithZeroDecompressedLength() public {
        address pointer = SSTORE2.write(fromHex(FIRST_TWO_IMAGES_COMPRESSED));
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addHeadsFromPointer(pointer, 0, 0);
    }

    function testCannotAddHeadsFromPointerWithZeroImageCount() public {
        address pointer = SSTORE2.write(fromHex(FIRST_TWO_IMAGES_COMPRESSED));
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addHeadsFromPointer(pointer, FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddHeadsFromPointerWorksWithMultiplePages() public {
        assertEq(art.headsTrait().storedImagesCount, 0);

        vm.startPrank(descriptor);
        art.addHeadsFromPointer(
            SSTORE2.write(fromHex(FIRST_TWO_IMAGES_COMPRESSED)),
            FIRST_TWO_IMAGES_DEFLATED_LENGTH,
            uint16(2)
        );
        art.addHeadsFromPointer(
            SSTORE2.write(fromHex(NEXT_TWO_IMAGES_COMPRESSED)),
            NEXT_TWO_IMAGES_DEFLATED_LENGTH,
            uint16(2)
        );
        vm.stopPrank();

        _assertHeadsStoredOK();
    }

    ///
    /// addGlasses, addGlassesFromPointer, glasses, glassesTrait
    ///

    function testAddGlassesRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.addGlasses(fromHex('123456'), uint80(12), uint16(1));
    }

    function testCannotAddGlassesWithNoBytes() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.EmptyBytes.selector);
        art.addGlasses(new bytes(0), 0, 0);
    }

    function testCannotAddGlassesWithZeroDecompressedLength() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addGlasses(fromHex(FIRST_TWO_IMAGES_COMPRESSED), 0, 0);
    }

    function testCannotAddGlassesWithZeroImageCount() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addGlasses(fromHex(FIRST_TWO_IMAGES_COMPRESSED), FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddGlassesWorksWithMultiplePages() public {
        assertEq(art.glassesTrait().storedImagesCount, 0);

        vm.startPrank(descriptor);
        art.addGlasses(fromHex(FIRST_TWO_IMAGES_COMPRESSED), FIRST_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        art.addGlasses(fromHex(NEXT_TWO_IMAGES_COMPRESSED), NEXT_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        vm.stopPrank();

        _assertGlassesStoredOK();
    }

    function testCannotAddGlassesFromPointerWithZeroDecompressedLength() public {
        address pointer = SSTORE2.write(fromHex(FIRST_TWO_IMAGES_COMPRESSED));
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addGlassesFromPointer(pointer, 0, 0);
    }

    function testCannotAddGlassesFromPointerWithZeroImageCount() public {
        address pointer = SSTORE2.write(fromHex(FIRST_TWO_IMAGES_COMPRESSED));
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addGlassesFromPointer(pointer, FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddGlassesFromPointerWorksWithMultiplePages() public {
        assertEq(art.headsTrait().storedImagesCount, 0);

        vm.startPrank(descriptor);
        art.addGlassesFromPointer(
            SSTORE2.write(fromHex(FIRST_TWO_IMAGES_COMPRESSED)),
            FIRST_TWO_IMAGES_DEFLATED_LENGTH,
            uint16(2)
        );
        art.addGlassesFromPointer(
            SSTORE2.write(fromHex(NEXT_TWO_IMAGES_COMPRESSED)),
            NEXT_TWO_IMAGES_DEFLATED_LENGTH,
            uint16(2)
        );
        vm.stopPrank();

        _assertGlassesStoredOK();
    }

    ///
    /// INTERNAL
    ///

    function _assertBodiesStoredOK() internal {
        assertEq(art.bodiesTrait().storedImagesCount, 4);

        // These hard-coded values are copied from image-data.json -> images -> BODIES -> the first items
        assertEq(art.bodies(0), fromHex(IMAGE_0));
        assertEq(art.bodies(1), fromHex(IMAGE_1));

        // These hard-coded values are copied from image-data.json -> images -> HEADS -> the first items
        assertEq(art.bodies(2), fromHex(IMAGE_2));
        assertEq(art.bodies(3), fromHex(IMAGE_3));
    }

    function _assertAccessoriesStoredOK() internal {
        assertEq(art.accessoriesTrait().storedImagesCount, 4);

        // These hard-coded values are copied from image-data.json -> images -> BODIES -> the first items
        assertEq(art.accessories(0), fromHex(IMAGE_0));
        assertEq(art.accessories(1), fromHex(IMAGE_1));

        // These hard-coded values are copied from image-data.json -> images -> HEADS -> the first items
        assertEq(art.accessories(2), fromHex(IMAGE_2));
        assertEq(art.accessories(3), fromHex(IMAGE_3));
    }

    function _assertHeadsStoredOK() internal {
        assertEq(art.headsTrait().storedImagesCount, 4);

        // These hard-coded values are copied from image-data.json -> images -> BODIES -> the first items
        assertEq(art.heads(0), fromHex(IMAGE_0));
        assertEq(art.heads(1), fromHex(IMAGE_1));

        // These hard-coded values are copied from image-data.json -> images -> HEADS -> the first items
        assertEq(art.heads(2), fromHex(IMAGE_2));
        assertEq(art.heads(3), fromHex(IMAGE_3));
    }

    function _assertGlassesStoredOK() internal {
        assertEq(art.glassesTrait().storedImagesCount, 4);

        // These hard-coded values are copied from image-data.json -> images -> BODIES -> the first items
        assertEq(art.glasses(0), fromHex(IMAGE_0));
        assertEq(art.glasses(1), fromHex(IMAGE_1));

        // These hard-coded values are copied from image-data.json -> images -> HEADS -> the first items
        assertEq(art.glasses(2), fromHex(IMAGE_2));
        assertEq(art.glasses(3), fromHex(IMAGE_3));
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

    string constant IMAGE_0 =
        '0015171f090e020e020e020e02020201000b02020201000b02020201000b02020201000b02020201000b02020201000b02020201000b02';
    string constant IMAGE_1 =
        '0015171f090e030e030e030e03020301000b03020301000b03020301000b03020301000b03020301000b03020301000b03020301000b03';
    string constant IMAGE_2 =
        '0005191406030004800c0002000980080001000e80040002000f80020001001080020002000f80020002000f800200020001800e810200020001800e810200020001800e810200020001800e81020003800e8102000180018101800f8101000180018103800d82018005800d81018002001180';
    string constant IMAGE_3 =
        '00031c140306000e3a050006000e3a05000400023a0e00023a03000400023a0e00023a03000400023a0e00023a030002000207023a0e07023a02070100020001070126023a040706260407023a01260107010001000126010702260607042606070226010701000100012608070626080701000100013a16070100013a0100013a15070100013a0100013a15070100013a0107013a1607013a0107013a1607010018070100070703760e0701001807020016070100';
}
