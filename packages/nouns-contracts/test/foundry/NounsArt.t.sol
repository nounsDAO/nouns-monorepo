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
}
