// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { NounsArt } from '../../contracts/NounsArt.sol';
import { INounsArt } from '../../contracts/interfaces/INounsArt.sol';
import { SSTORE2 } from '../../contracts/libs/SSTORE2.sol';
import { DescriptorHelpers } from './helpers/DescriptorHelpers.sol';
import { Inflator } from '../../contracts/Inflator.sol';
import { IInflator } from '../../contracts/interfaces/IInflator.sol';

contract NounsArtTest is Test, DescriptorHelpers {
    event BackgroundsAdded(uint256 count);

    event PaletteSet(uint8 paletteIndex);

    event BodiesAdded(uint16 count);

    event AccessoriesAdded(uint16 count);

    event HeadsAdded(uint16 count);

    event GlassesAdded(uint16 count);

    event DescriptorUpdated(address oldDescriptor, address newDescriptor);

    event InflatorUpdated(address oldInflator, address newInflator);

    NounsArt art;
    address descriptor = address(1);
    IInflator inflator;

    function setUp() public {
        inflator = new Inflator();
        art = new NounsArt(descriptor, inflator);
    }

    ///
    /// setDescriptor
    ///

    function testSetDescriptorRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.setDescriptor(address(2));
    }

    function testSetDescriptorWorks() public {
        address newDescriptor = address(2);

        vm.expectEmit(true, true, true, true);
        emit DescriptorUpdated(descriptor, newDescriptor);

        vm.prank(descriptor);
        art.setDescriptor(newDescriptor);

        assertEq(art.descriptor(), newDescriptor);
    }

    ///
    /// setInflator
    ///

    function testSetInflatorRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.setInflator(IInflator(address(2)));
    }

    function testSetInflatorWorks() public {
        IInflator newInflator = IInflator(address(2));

        vm.expectEmit(true, true, true, true);
        emit InflatorUpdated(address(inflator), address(newInflator));

        vm.prank(descriptor);
        art.setInflator(newInflator);

        assertEq(address(art.inflator()), address(newInflator));
    }

    ///
    /// addBackground, addManyBackgrounds, backgroundsCount, backgrounds
    ///

    function testBackgroundsRevertsGivenNoArt() public {
        vm.expectRevert();
        art.backgrounds(0);
    }

    function testAddBackgroundRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.addBackground('ffffff');
    }

    function testAddBackgroundWorks() public {
        vm.prank(descriptor);
        vm.expectEmit(true, true, true, true);
        emit BackgroundsAdded(1);

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

        vm.expectEmit(true, true, true, true);
        emit BackgroundsAdded(2);

        vm.prank(descriptor);
        art.addManyBackgrounds(bgs);

        assertEq(art.backgroundsCount(), 2);
        assertEq(art.backgrounds(0), 'ffffff');
        assertEq(art.backgrounds(1), '000000');
    }

    ///
    /// setPalette, palettes, palettesPointers, setPalettePointer
    ///

    function testPalettesRevertsGivenNoArt() public {
        vm.expectRevert(INounsArt.PaletteNotFound.selector);
        art.palettes(0);
    }

    function testSetPaletteRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.setPalette(0, hex'ffffff');
    }

    function testSetPalettePointerRevertsIfSenderNotDescriptor() public {
        address pointer = SSTORE2.write(hex'ffffff000000');
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.setPalettePointer(0, pointer);
    }

    function testSetPaletteWorks() public {
        vm.expectEmit(true, true, true, true);
        emit PaletteSet(0);
        vm.expectEmit(true, true, true, true);
        emit PaletteSet(1);

        bytes memory palette0 = hex'ffffffc5b9a1';
        bytes memory palette1 = hex'cfc2ab63a0f9';
        vm.startPrank(descriptor);
        art.setPalette(0, palette0);
        art.setPalette(1, palette1);
        vm.stopPrank();

        assertEq(art.palettes(0), palette0);
        assertEq(art.palettes(1), palette1);

        assertEq(SSTORE2.read(art.palettesPointers(0)), palette0);
        assertEq(SSTORE2.read(art.palettesPointers(1)), palette1);
    }

    function testSetPalettePointerWorks() public {
        vm.expectEmit(true, true, true, true);
        emit PaletteSet(0);
        vm.expectEmit(true, true, true, true);
        emit PaletteSet(1);

        address pointer0 = SSTORE2.write(hex'ffffffc5b9a1');
        address pointer1 = SSTORE2.write(hex'cfc2ab63a0f9');
        vm.startPrank(descriptor);
        art.setPalettePointer(0, pointer0);
        art.setPalettePointer(1, pointer1);
        vm.stopPrank();

        assertEq(art.palettes(0), hex'ffffffc5b9a1');
        assertEq(art.palettes(1), hex'cfc2ab63a0f9');

        assertEq(art.palettesPointers(0), pointer0);
        assertEq(art.palettesPointers(1), pointer1);
    }

    function testSetPaletteUpdatesAnExistingPalette() public {
        bytes memory paletteV1 = hex'ffffffc5b9a1';
        bytes memory paletteV2 = hex'cfc2ab63a0f9';

        vm.expectEmit(true, true, true, true);
        emit PaletteSet(0);
        vm.prank(descriptor);
        art.setPalette(0, paletteV1);
        assertEq(art.palettes(0), paletteV1);
        assertEq(SSTORE2.read(art.palettesPointers(0)), paletteV1);

        vm.expectEmit(true, true, true, true);
        emit PaletteSet(0);
        vm.prank(descriptor);
        art.setPalette(0, paletteV2);
        assertEq(art.palettes(0), paletteV2);
        assertEq(SSTORE2.read(art.palettesPointers(0)), paletteV2);
    }

    function testSetPalettePointerUpdatesAnExistingPalette() public {
        address paletteV1Pointer = SSTORE2.write(hex'ffffffc5b9a1');
        address paletteV2Pointer = SSTORE2.write(hex'cfc2ab63a0f9');

        vm.expectEmit(true, true, true, true);
        emit PaletteSet(0);
        vm.prank(descriptor);
        art.setPalettePointer(0, paletteV1Pointer);
        assertEq(art.palettes(0), hex'ffffffc5b9a1');
        assertEq(art.palettesPointers(0), paletteV1Pointer);

        vm.expectEmit(true, true, true, true);
        emit PaletteSet(0);
        vm.prank(descriptor);
        art.setPalettePointer(0, paletteV2Pointer);
        assertEq(art.palettes(0), hex'cfc2ab63a0f9');
        assertEq(art.palettesPointers(0), paletteV2Pointer);
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
    /// addBodies, addBodiesFromPointer, bodies, getBodiesTrait
    ///

    function testBodiesRevertsGivenNoArt() public {
        vm.expectRevert(INounsArt.ImageNotFound.selector);
        art.bodies(0);
    }

    function testAddBodiesRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.addBodies(hex'123456', uint80(12), uint16(1));
    }

    function testCannotAddBodiesWithNoBytes() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.EmptyBytes.selector);
        art.addBodies(new bytes(0), 0, 0);
    }

    function testCannotAddBodiesWithZeroDecompressedLength() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addBodies(FIRST_TWO_IMAGES_COMPRESSED, 0, 0);
    }

    function testCannotAddBodiesWithZeroImageCount() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addBodies(FIRST_TWO_IMAGES_COMPRESSED, FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddBodiesWorksWithMultiplePages() public {
        assertEq(art.getBodiesTrait().storedImagesCount, 0);
        vm.expectEmit(true, true, true, true);
        emit BodiesAdded(2);
        vm.expectEmit(true, true, true, true);
        emit BodiesAdded(2);

        vm.startPrank(descriptor);
        art.addBodies(FIRST_TWO_IMAGES_COMPRESSED, FIRST_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        art.addBodies(NEXT_TWO_IMAGES_COMPRESSED, NEXT_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        vm.stopPrank();

        _assertBodiesStoredOK();
    }

    function testCannotAddBodiesFromPointerWithZeroDecompressedLength() public {
        address pointer = SSTORE2.write(FIRST_TWO_IMAGES_COMPRESSED);
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addBodiesFromPointer(pointer, 0, 0);
    }

    function testCannotAddBodiesFromPointerWithZeroImageCount() public {
        address pointer = SSTORE2.write(FIRST_TWO_IMAGES_COMPRESSED);
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addBodiesFromPointer(pointer, FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddBodiesFromPointerWorksWithMultiplePages() public {
        assertEq(art.getBodiesTrait().storedImagesCount, 0);
        vm.expectEmit(true, true, true, true);
        emit BodiesAdded(2);
        vm.expectEmit(true, true, true, true);
        emit BodiesAdded(2);

        vm.startPrank(descriptor);
        art.addBodiesFromPointer(
            SSTORE2.write(FIRST_TWO_IMAGES_COMPRESSED),
            FIRST_TWO_IMAGES_DEFLATED_LENGTH,
            uint16(2)
        );
        art.addBodiesFromPointer(SSTORE2.write(NEXT_TWO_IMAGES_COMPRESSED), NEXT_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        vm.stopPrank();

        _assertBodiesStoredOK();
    }

    ///
    /// addAccessories, addAccessoriesFromPointer, accessories, getAccessoriesTrait
    ///

    function testAccessoriesRevertsGivenNoArt() public {
        vm.expectRevert(INounsArt.ImageNotFound.selector);
        art.accessories(0);
    }

    function testAddAccessoriesRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.addAccessories(hex'123456', uint80(12), uint16(1));
    }

    function testCannotAddAccessoriesWithNoBytes() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.EmptyBytes.selector);
        art.addAccessories(new bytes(0), 0, 0);
    }

    function testCannotAddAccessoriesWithZeroDecompressedLength() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addAccessories(FIRST_TWO_IMAGES_COMPRESSED, 0, 0);
    }

    function testCannotAddAccessoriesWithZeroImageCount() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addAccessories(FIRST_TWO_IMAGES_COMPRESSED, FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddAccessoriesWorksWithMultiplePages() public {
        assertEq(art.getAccessoriesTrait().storedImagesCount, 0);
        vm.expectEmit(true, true, true, true);
        emit AccessoriesAdded(2);
        vm.expectEmit(true, true, true, true);
        emit AccessoriesAdded(2);

        vm.startPrank(descriptor);
        art.addAccessories(FIRST_TWO_IMAGES_COMPRESSED, FIRST_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        art.addAccessories(NEXT_TWO_IMAGES_COMPRESSED, NEXT_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        vm.stopPrank();

        _assertAccessoriesStoredOK();
    }

    function testCannotAddAccessoriesFromPointerWithZeroDecompressedLength() public {
        address pointer = SSTORE2.write(FIRST_TWO_IMAGES_COMPRESSED);
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addAccessoriesFromPointer(pointer, 0, 0);
    }

    function testCannotAddAccessoriesFromPointerWithZeroImageCount() public {
        address pointer = SSTORE2.write(FIRST_TWO_IMAGES_COMPRESSED);
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addAccessoriesFromPointer(pointer, FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddAccessoriesFromPointerWorksWithMultiplePages() public {
        assertEq(art.getAccessoriesTrait().storedImagesCount, 0);
        vm.expectEmit(true, true, true, true);
        emit AccessoriesAdded(2);
        vm.expectEmit(true, true, true, true);
        emit AccessoriesAdded(2);

        vm.startPrank(descriptor);
        art.addAccessoriesFromPointer(
            SSTORE2.write(FIRST_TWO_IMAGES_COMPRESSED),
            FIRST_TWO_IMAGES_DEFLATED_LENGTH,
            uint16(2)
        );
        art.addAccessoriesFromPointer(
            SSTORE2.write(NEXT_TWO_IMAGES_COMPRESSED),
            NEXT_TWO_IMAGES_DEFLATED_LENGTH,
            uint16(2)
        );
        vm.stopPrank();

        _assertAccessoriesStoredOK();
    }

    ///
    /// addHeads, addHeadsFromPointer, heads, getHeadsTrait
    ///

    function testHeadsRevertsGivenNoArt() public {
        vm.expectRevert(INounsArt.ImageNotFound.selector);
        art.heads(0);
    }

    function testAddHeadsRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.addHeads(hex'123456', uint80(12), uint16(1));
    }

    function testCannotAddHeadsWithNoBytes() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.EmptyBytes.selector);
        art.addHeads(new bytes(0), 0, 0);
    }

    function testCannotAddHeadsWithZeroDecompressedLength() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addHeads(FIRST_TWO_IMAGES_COMPRESSED, 0, 0);
    }

    function testCannotAddHeadsWithZeroImageCount() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addHeads(FIRST_TWO_IMAGES_COMPRESSED, FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddHeadsWorksWithMultiplePages() public {
        assertEq(art.getHeadsTrait().storedImagesCount, 0);
        vm.expectEmit(true, true, true, true);
        emit HeadsAdded(2);
        vm.expectEmit(true, true, true, true);
        emit HeadsAdded(2);

        vm.startPrank(descriptor);
        art.addHeads(FIRST_TWO_IMAGES_COMPRESSED, FIRST_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        art.addHeads(NEXT_TWO_IMAGES_COMPRESSED, NEXT_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        vm.stopPrank();

        _assertHeadsStoredOK();
    }

    function testCannotAddHeadsFromPointerWithZeroDecompressedLength() public {
        address pointer = SSTORE2.write(FIRST_TWO_IMAGES_COMPRESSED);
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addHeadsFromPointer(pointer, 0, 0);
    }

    function testCannotAddHeadsFromPointerWithZeroImageCount() public {
        address pointer = SSTORE2.write(FIRST_TWO_IMAGES_COMPRESSED);
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addHeadsFromPointer(pointer, FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddHeadsFromPointerWorksWithMultiplePages() public {
        assertEq(art.getHeadsTrait().storedImagesCount, 0);
        vm.expectEmit(true, true, true, true);
        emit HeadsAdded(2);
        vm.expectEmit(true, true, true, true);
        emit HeadsAdded(2);

        vm.startPrank(descriptor);
        art.addHeadsFromPointer(
            SSTORE2.write(FIRST_TWO_IMAGES_COMPRESSED),
            FIRST_TWO_IMAGES_DEFLATED_LENGTH,
            uint16(2)
        );
        art.addHeadsFromPointer(SSTORE2.write(NEXT_TWO_IMAGES_COMPRESSED), NEXT_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        vm.stopPrank();

        _assertHeadsStoredOK();
    }

    ///
    /// addGlasses, addGlassesFromPointer, glasses, getGlassesTrait
    ///

    function testGlassesRevertsGivenNoArt() public {
        vm.expectRevert(INounsArt.ImageNotFound.selector);
        art.glasses(0);
    }

    function testAddGlassesRevertsIfSenderNotDescriptor() public {
        vm.expectRevert(INounsArt.SenderIsNotDescriptor.selector);
        art.addGlasses(hex'123456', uint80(12), uint16(1));
    }

    function testCannotAddGlassesWithNoBytes() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.EmptyBytes.selector);
        art.addGlasses(new bytes(0), 0, 0);
    }

    function testCannotAddGlassesWithZeroDecompressedLength() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addGlasses(FIRST_TWO_IMAGES_COMPRESSED, 0, 0);
    }

    function testCannotAddGlassesWithZeroImageCount() public {
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addGlasses(FIRST_TWO_IMAGES_COMPRESSED, FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddGlassesWorksWithMultiplePages() public {
        assertEq(art.getGlassesTrait().storedImagesCount, 0);
        vm.expectEmit(true, true, true, true);
        emit GlassesAdded(2);
        vm.expectEmit(true, true, true, true);
        emit GlassesAdded(2);

        vm.startPrank(descriptor);
        art.addGlasses(FIRST_TWO_IMAGES_COMPRESSED, FIRST_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        art.addGlasses(NEXT_TWO_IMAGES_COMPRESSED, NEXT_TWO_IMAGES_DEFLATED_LENGTH, uint16(2));
        vm.stopPrank();

        _assertGlassesStoredOK();
    }

    function testCannotAddGlassesFromPointerWithZeroDecompressedLength() public {
        address pointer = SSTORE2.write(FIRST_TWO_IMAGES_COMPRESSED);
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadDecompressedLength.selector);
        art.addGlassesFromPointer(pointer, 0, 0);
    }

    function testCannotAddGlassesFromPointerWithZeroImageCount() public {
        address pointer = SSTORE2.write(FIRST_TWO_IMAGES_COMPRESSED);
        vm.prank(descriptor);
        vm.expectRevert(INounsArt.BadImageCount.selector);
        art.addGlassesFromPointer(pointer, FIRST_TWO_IMAGES_DEFLATED_LENGTH, 0);
    }

    function testAddGlassesFromPointerWorksWithMultiplePages() public {
        assertEq(art.getHeadsTrait().storedImagesCount, 0);
        vm.expectEmit(true, true, true, true);
        emit GlassesAdded(2);

        vm.startPrank(descriptor);
        art.addGlassesFromPointer(
            SSTORE2.write(FIRST_TWO_IMAGES_COMPRESSED),
            FIRST_TWO_IMAGES_DEFLATED_LENGTH,
            uint16(2)
        );
        art.addGlassesFromPointer(
            SSTORE2.write(NEXT_TWO_IMAGES_COMPRESSED),
            NEXT_TWO_IMAGES_DEFLATED_LENGTH,
            uint16(2)
        );
        vm.stopPrank();

        _assertGlassesStoredOK();
    }

    function testAddGlassesWorksWithSeveralPages() public {
        uint256 pageCount = 5;
        (bytes memory glasses, uint80 glassesLength, uint16 glassesCount) = getGlassesPage();
        vm.startPrank(descriptor);
        for (uint256 i = 0; i < pageCount; i++) {
            art.addGlasses(glasses, glassesLength, glassesCount);
        }
        vm.stopPrank();

        assertEq(art.getGlassesTrait().storagePages.length, 5);

        for (uint256 i = 0; i < glassesCount; i++) {
            bytes memory glassesPage0 = art.glasses(i);
            for (uint256 j = 1; j < pageCount; j++) {
                bytes memory sameGlassesDifferentPage = art.glasses(i + glassesCount * j);
                assertEq(sameGlassesDifferentPage, glassesPage0);
            }
        }
    }

    ///
    /// INTERNAL
    ///

    function _assertBodiesStoredOK() internal {
        assertEq(art.getBodiesTrait().storedImagesCount, 4);

        // These hard-coded values are copied from image-data.json -> images -> BODIES -> the first items
        assertEq(art.bodies(0), IMAGE_0);
        assertEq(art.bodies(1), IMAGE_1);

        // These hard-coded values are copied from image-data.json -> images -> HEADS -> the first items
        assertEq(art.bodies(2), IMAGE_2);
        assertEq(art.bodies(3), IMAGE_3);
    }

    function _assertAccessoriesStoredOK() internal {
        assertEq(art.getAccessoriesTrait().storedImagesCount, 4);

        // These hard-coded values are copied from image-data.json -> images -> BODIES -> the first items
        assertEq(art.accessories(0), IMAGE_0);
        assertEq(art.accessories(1), IMAGE_1);

        // These hard-coded values are copied from image-data.json -> images -> HEADS -> the first items
        assertEq(art.accessories(2), IMAGE_2);
        assertEq(art.accessories(3), IMAGE_3);
    }

    function _assertHeadsStoredOK() internal {
        assertEq(art.getHeadsTrait().storedImagesCount, 4);

        // These hard-coded values are copied from image-data.json -> images -> BODIES -> the first items
        assertEq(art.heads(0), IMAGE_0);
        assertEq(art.heads(1), IMAGE_1);

        // These hard-coded values are copied from image-data.json -> images -> HEADS -> the first items
        assertEq(art.heads(2), IMAGE_2);
        assertEq(art.heads(3), IMAGE_3);
    }

    function _assertGlassesStoredOK() internal {
        assertEq(art.getGlassesTrait().storedImagesCount, 4);

        // These hard-coded values are copied from image-data.json -> images -> BODIES -> the first items
        assertEq(art.glasses(0), IMAGE_0);
        assertEq(art.glasses(1), IMAGE_1);

        // These hard-coded values are copied from image-data.json -> images -> HEADS -> the first items
        assertEq(art.glasses(2), IMAGE_2);
        assertEq(art.glasses(3), IMAGE_3);
    }

    // the value below was copied from running the hardhat task `descriptor-art-to-console` with
    // the parameter `count` set to 2, and taking the bodies values.
    bytes constant FIRST_TWO_IMAGES_COMPRESSED =
        hex'6360c00b14f04b33301190772020bf8080bc3983a8b83c271f130432313132701345123016dd7c6608646206ea258a841b0000';
    uint80 constant FIRST_TWO_IMAGES_DEFLATED_LENGTH = 320;

    // the value below was copied from running the hardhat task `descriptor-art-to-console` with
    // the parameter `count` set to 2 and `start` set to 2, and taking the heads values.
    bytes constant NEXT_TWO_IMAGES_COMPRESSED =
        hex'858f410a02310c4593b4d38ee0548551145cb8ea21baf24e82eb8c77f23e1ec5df0e232a3a0dfcfcd7fc4253a2d93acdc72495fc5cc91f95fc42cda17786ac2ef1d6425b620a6ac12b15f01a7de4a9b386e1bf9bd25979605d0d5cc86877636db4c34c68a395953eea4ee6d81b4721353476ec9602647e1236f160483ce7ad3c4749d6bb6831e388337e955da2f31692d7acc5ad76e4b4cb9eb2b6dfe44b3a39ed21efcd351416cab3b77a02';
    uint80 constant NEXT_TWO_IMAGES_DEFLATED_LENGTH = 512;

    bytes constant IMAGE_0 =
        hex'0015171f090e020e020e020e02020201000b02020201000b02020201000b02020201000b02020201000b02020201000b02020201000b02';
    bytes constant IMAGE_1 =
        hex'0015171f090e030e030e030e03020301000b03020301000b03020301000b03020301000b03020301000b03020301000b03020301000b03';
    bytes constant IMAGE_2 =
        hex'0005191406030004800c0002000980080001000e80040002000f80020001001080020002000f80020002000f800200020001800e810200020001800e810200020001800e810200020001800e81020003800e8102000180018101800f8101000180018103800d82018005800d81018002001180';
    bytes constant IMAGE_3 =
        hex'00031c140306000e3a050006000e3a05000400023a0e00023a03000400023a0e00023a03000400023a0e00023a030002000207023a0e07023a02070100020001070126023a040706260407023a01260107010001000126010702260607042606070226010701000100012608070626080701000100013a16070100013a0100013a15070100013a0100013a15070100013a0107013a1607013a0107013a1607010018070100070703760e0701001807020016070100';
}
