// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import 'forge-std/StdJson.sol';
import { NounsDescriptorV3 } from '../../contracts/NounsDescriptorV3.sol';
import { SVGRenderer } from '../../contracts/SVGRenderer.sol';
import { ISVGRenderer } from '../../contracts/interfaces/ISVGRenderer.sol';
import { INounsSeeder } from '../../contracts/interfaces/INounsSeeder.sol';
import { NounsArt } from '../../contracts/NounsArt.sol';
import { INounsArt } from '../../contracts/interfaces/INounsArt.sol';
import { Base64 } from 'base64-sol/base64.sol';
import { Inflator } from '../../contracts/Inflator.sol';
import { IInflator } from '../../contracts/interfaces/IInflator.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { strings } from './lib/strings.sol';
import { console } from 'forge-std/console.sol';

contract NounsDescriptorV3Test is Test {
    NounsDescriptorV3 descriptor;
    NounsArt art;
    SVGRenderer renderer;

    function setUp() public {
        renderer = new SVGRenderer();
        descriptor = new NounsDescriptorV3(INounsArt(address(0)), renderer);
        art = new NounsArt(address(descriptor), new Inflator());
        descriptor.setArt(art);
    }

    function testCannotSetArtIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.setArt(INounsArt(address(2)));
    }

    function testCannotSetArtIfPartsAreLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.setArt(INounsArt(address(2)));
    }

    function testSetArtWorks() public {
        descriptor.setArt(INounsArt(address(2)));
        assertEq(address(descriptor.art()), address(2));
    }

    function testCannotSetRendererIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.setRenderer(ISVGRenderer(address(2)));
    }

    function testSetRendererWorksIfPartsAreLocked() public {
        descriptor.lockParts();
        descriptor.setRenderer(ISVGRenderer(address(2)));
        assertEq(address(descriptor.renderer()), address(2));
    }

    function testSetRendererWorks() public {
        descriptor.setRenderer(ISVGRenderer(address(2)));
        assertEq(address(descriptor.renderer()), address(2));
    }

    function testCannotSetArtDescriptorIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.setArtDescriptor(address(2));
    }

    function testSetArtDescriptorUsesArt() public {
        vm.expectCall(address(art), abi.encodeCall(art.setDescriptor, address(42)));
        descriptor.setArtDescriptor(address(42));
    }

    function testCannotSetArtInflatorIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.setArtInflator(IInflator(address(2)));
    }

    function testSetArtInflatorUsesArt() public {
        vm.expectCall(address(art), abi.encodeCall(art.setInflator, IInflator(address(42))));
        descriptor.setArtInflator(IInflator(address(42)));
    }

    function testDataURIEnabledByDefault() public {
        assertEq(descriptor.isDataURIEnabled(), true);
    }

    function testCannotToggleDataURIIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.toggleDataURIEnabled();
    }

    function testToggleDataURIWorks() public {
        descriptor.setBaseURI('https://nouns.wtf/');
        _makeArtGettersNotRevert();
        vm.mockCall(
            address(renderer),
            abi.encodeWithSelector(SVGRenderer.generateSVG.selector),
            abi.encode('mock svg')
        );

        descriptor.toggleDataURIEnabled();
        assertEq(descriptor.tokenURI(42, INounsSeeder.Seed(0, 0, 0, 0, 0)), 'https://nouns.wtf/42');

        descriptor.toggleDataURIEnabled();
        assertEq(
            descriptor.tokenURI(42, INounsSeeder.Seed(0, 0, 0, 0, 0)),
            string(
                abi.encodePacked(
                    'data:application/json;base64,',
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                'Noun 42',
                                '", "description":"',
                                'Noun 42 is a member of the Nouns DAO',
                                '", "image": "',
                                'data:image/svg+xml;base64,',
                                Base64.encode(bytes('mock svg')),
                                '"}'
                            )
                        )
                    )
                )
            )
        );

        vm.clearMockedCalls();
    }

    function testBackgroundCountUsesArt() public {
        vm.mockCall(address(art), abi.encodeWithSelector(NounsArt.backgroundCount.selector), abi.encode(42));
        assertEq(descriptor.backgroundCount(), 42);
        vm.clearMockedCalls();
    }

    function testBodyCountUsesArt() public {
        vm.prank(address(descriptor));
        art.addBodiesFromPointer(address(0), 1, 42);
        assertEq(descriptor.bodyCount(), 42);
    }

    function testAccessoryCountUsesArt() public {
        vm.prank(address(descriptor));
        art.addAccessoriesFromPointer(address(0), 1, 42);
        assertEq(descriptor.accessoryCount(), 42);
    }

    function testHeadCountUsesArt() public {
        vm.prank(address(descriptor));
        art.addHeadsFromPointer(address(0), 1, 42);
        assertEq(descriptor.headCount(), 42);
    }

    function testGlassesCountUsesArt() public {
        vm.prank(address(descriptor));
        art.addGlassesFromPointer(address(0), 1, 42);
        assertEq(descriptor.glassesCount(), 42);
    }

    function testAddManyBackgroundsUsesArt() public {
        string[] memory params = new string[](2);
        params[0] = 'ff00ff';
        params[1] = '00ff00';

        vm.expectCall(address(art), abi.encodeCall(art.addManyBackgrounds, (params)));
        descriptor.addManyBackgrounds(params);
    }

    function testCannotAddManyBackgroundsWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.addManyBackgrounds(new string[](0));
    }

    function testAddBackgroundUsesArt() public {
        vm.expectCall(address(art), abi.encodeCall(art.addBackground, ('fff000')));
        descriptor.addBackground('fff000');
    }

    function testCannotAddBackgroundWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.addBackground('');
    }

    function testSetPaletteUsesArt() public {
        vm.expectCall(address(art), abi.encodeCall(art.setPalette, (0, '123456')));
        descriptor.setPalette(0, '123456');

        vm.expectCall(address(art), abi.encodeCall(art.setPalette, (1, '654321')));
        descriptor.setPalette(1, '654321');
    }

    function testSetPalettePointerUsesArt() public {
        vm.expectCall(address(art), abi.encodeCall(art.setPalettePointer, (0, address(42))));
        descriptor.setPalettePointer(0, address(42));

        vm.expectCall(address(art), abi.encodeCall(art.setPalettePointer, (1, address(1337))));
        descriptor.setPalettePointer(1, address(1337));
    }

    function testCannotSetPaletteWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.setPalette(0, '000000');
    }

    function testCannotSetPalettePointerWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.setPalettePointer(0, address(42));
    }

    function testCannotSetPalettePointerIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.setPalettePointer(0, address(42));
    }

    function testAddBodiesUsesArt() public {
        bytes memory someBytes = 'some bytes';
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;
        vm.expectCall(address(art), abi.encodeCall(art.addBodies, (someBytes, decompressedLen, imageCount)));
        descriptor.addBodies(someBytes, decompressedLen, imageCount);
    }

    function testCannotAddBodiesWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.addBodies('00', 1, 1);
    }

    function testCannotAddBodiesIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.addBodies('00', 1, 1);
    }

    function testAddAccessoriesUsesArt() public {
        bytes memory someBytes = 'some bytes';
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;
        vm.expectCall(address(art), abi.encodeCall(art.addAccessories, (someBytes, decompressedLen, imageCount)));
        descriptor.addAccessories(someBytes, decompressedLen, imageCount);
    }

    function testCannotAddAccessoriesWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.addAccessories('00', 1, 1);
    }

    function testCannotAddAccessoriesIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.addAccessories('00', 1, 1);
    }

    function testAddHeadsUsesArt() public {
        bytes memory someBytes = 'some bytes';
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;
        vm.expectCall(address(art), abi.encodeCall(art.addHeads, (someBytes, decompressedLen, imageCount)));
        descriptor.addHeads(someBytes, decompressedLen, imageCount);
    }

    function testCannotAddHeadsWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.addHeads('00', 1, 1);
    }

    function testCannotAddHeadsIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.addHeads('00', 1, 1);
    }

    function testAddGlassesUsesArt() public {
        bytes memory someBytes = 'some bytes';
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;
        vm.expectCall(address(art), abi.encodeCall(art.addGlasses, (someBytes, decompressedLen, imageCount)));
        descriptor.addGlasses(someBytes, decompressedLen, imageCount);
    }

    function testCannotAddGlassesWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.addGlasses('00', 1, 1);
    }

    function testCannotAddGlassesIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.addGlasses('00', 1, 1);
    }

    function testAddBodiesFromPointerUsesArt() public {
        address somePointer = address(1337);
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;
        vm.expectCall(
            address(art),
            abi.encodeCall(art.addBodiesFromPointer, (somePointer, decompressedLen, imageCount))
        );
        descriptor.addBodiesFromPointer(somePointer, decompressedLen, imageCount);
    }

    function testCannotAddBodiesFromPointerWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.addBodiesFromPointer(address(1337), 1, 1);
    }

    function testCannotAddBodiesFromPointerIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.addBodiesFromPointer(address(1337), 1, 1);
    }

    function testAddAccessoriesFromPointerUsesArt() public {
        address somePointer = address(1337);
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;
        vm.expectCall(
            address(art),
            abi.encodeCall(art.addAccessoriesFromPointer, (somePointer, decompressedLen, imageCount))
        );
        descriptor.addAccessoriesFromPointer(somePointer, decompressedLen, imageCount);
    }

    function testCannotAddAccessoriesFromPointerWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.addAccessoriesFromPointer(address(1337), 1, 1);
    }

    function testCannotAddAccessoriesFromPointerIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.addAccessoriesFromPointer(address(1337), 1, 1);
    }

    function testAddHeadsFromPointerUsesArt() public {
        address somePointer = address(1337);
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;
        vm.expectCall(
            address(art),
            abi.encodeCall(art.addHeadsFromPointer, (somePointer, decompressedLen, imageCount))
        );
        descriptor.addHeadsFromPointer(somePointer, decompressedLen, imageCount);
    }

    function testCannotAddHeadsFromPointerWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.addHeadsFromPointer(address(1337), 1, 1);
    }

    function testCannotAddHeadsFromPointerIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.addHeadsFromPointer(address(1337), 1, 1);
    }

    function testAddGlassesFromPointerUsesArt() public {
        address somePointer = address(1337);
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;
        vm.expectCall(
            address(art),
            abi.encodeCall(art.addGlassesFromPointer, (somePointer, decompressedLen, imageCount))
        );
        descriptor.addGlassesFromPointer(somePointer, decompressedLen, imageCount);
    }

    function testCannotAddGlassesFromPointerWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.addGlassesFromPointer(address(1337), 1, 1);
    }

    function testCannotAddGlassesFromPointerIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.addGlassesFromPointer(address(1337), 1, 1);
    }

    function testUpdateBodiesUsesArt() public {
        bytes memory someBytes = 'some bytes';
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;

        testAddBodiesUsesArt();

        vm.expectCall(address(art), abi.encodeCall(art.updateBodies, (someBytes, decompressedLen, imageCount)));
        descriptor.updateBodies(someBytes, decompressedLen, imageCount);
    }

    function testCannotUpdateBodiesWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.updateBodies('00', 1, 1);
    }

    function testCannotUpdateBodiesIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.updateBodies('00', 1, 1);
    }

    function testUpdateAccessoriesUsesArt() public {
        bytes memory someBytes = 'some bytes';
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;

        testAddAccessoriesUsesArt();

        vm.expectCall(address(art), abi.encodeCall(art.updateAccessories, (someBytes, decompressedLen, imageCount)));
        descriptor.updateAccessories(someBytes, decompressedLen, imageCount);
    }

    function testCannotUpdateAccessoriesWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.updateAccessories('00', 1, 1);
    }

    function testCannotUpdateAccessoriesIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.updateAccessories('00', 1, 1);
    }

    function testUpdateHeadsUsesArt() public {
        bytes memory someBytes = 'some bytes';
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;

        testAddHeadsUsesArt();

        vm.expectCall(address(art), abi.encodeCall(art.updateHeads, (someBytes, decompressedLen, imageCount)));
        descriptor.updateHeads(someBytes, decompressedLen, imageCount);
    }

    function testCannotUpdateHeadsWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.updateHeads('00', 1, 1);
    }

    function testCannotUpdateHeadsIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.updateHeads('00', 1, 1);
    }

    function testUpdateGlassesUsesArt() public {
        bytes memory someBytes = 'some bytes';
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;

        testAddGlassesUsesArt();

        vm.expectCall(address(art), abi.encodeCall(art.updateGlasses, (someBytes, decompressedLen, imageCount)));
        descriptor.updateGlasses(someBytes, decompressedLen, imageCount);
    }

    function testCannotUpdateGlassesWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.updateGlasses('00', 1, 1);
    }

    function testCannotUpdateGlassesIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.updateGlasses('00', 1, 1);
    }

    function testUpdateBodiesFromPointerUsesArt() public {
        address somePointer = address(1337);
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;

        testAddBodiesFromPointerUsesArt();

        vm.expectCall(
            address(art),
            abi.encodeCall(art.updateBodiesFromPointer, (somePointer, decompressedLen, imageCount))
        );
        descriptor.updateBodiesFromPointer(somePointer, decompressedLen, imageCount);
    }

    function testCannotUpdateBodiesFromPointerWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.updateBodiesFromPointer(address(1337), 1, 1);
    }

    function testCannotUpdateBodiesFromPointerIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.updateBodiesFromPointer(address(1337), 1, 1);
    }

    function testUpdateAccessoriesFromPointerUsesArt() public {
        address somePointer = address(1337);
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;

        testAddAccessoriesFromPointerUsesArt();

        vm.expectCall(
            address(art),
            abi.encodeCall(art.updateAccessoriesFromPointer, (somePointer, decompressedLen, imageCount))
        );
        descriptor.updateAccessoriesFromPointer(somePointer, decompressedLen, imageCount);
    }

    function testCannotUpdateAccessoriesFromPointerWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.updateAccessoriesFromPointer(address(1337), 1, 1);
    }

    function testCannotUpdateAccessoriesFromPointerIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.updateAccessoriesFromPointer(address(1337), 1, 1);
    }

    function testUpdateHeadsFromPointerUsesArt() public {
        address somePointer = address(1337);
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;

        testAddHeadsFromPointerUsesArt();

        vm.expectCall(
            address(art),
            abi.encodeCall(art.updateHeadsFromPointer, (somePointer, decompressedLen, imageCount))
        );
        descriptor.updateHeadsFromPointer(somePointer, decompressedLen, imageCount);
    }

    function testCannotUpdateHeadsFromPointerWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.updateHeadsFromPointer(address(1337), 1, 1);
    }

    function testCannotUpdateHeadsFromPointerIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.updateHeadsFromPointer(address(1337), 1, 1);
    }

    function testUpdateGlassesFromPointerUsesArt() public {
        address somePointer = address(1337);
        uint80 decompressedLen = 123;
        uint16 imageCount = 456;

        testAddGlassesFromPointerUsesArt();

        vm.expectCall(
            address(art),
            abi.encodeCall(art.updateGlassesFromPointer, (somePointer, decompressedLen, imageCount))
        );
        descriptor.updateGlassesFromPointer(somePointer, decompressedLen, imageCount);
    }

    function testCannotUpdateGlassesFromPointerWhenPartsLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.updateGlassesFromPointer(address(1337), 1, 1);
    }

    function testCannotUpdateGlassesFromPointerIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.updateGlassesFromPointer(address(1337), 1, 1);
    }

    function testBackgroundsUsesArt() public {
        vm.mockCall(
            address(art),
            abi.encodeWithSelector(INounsArt.backgrounds.selector, 17),
            abi.encode('return value')
        );
        assertEq(descriptor.backgrounds(17), 'return value');
        vm.clearMockedCalls();
    }

    function testHeadsUsesArt() public {
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.heads.selector, 17), abi.encode('return value'));
        assertEq(descriptor.heads(17), 'return value');
        vm.clearMockedCalls();
    }

    function testBodiesUsesArt() public {
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.bodies.selector, 17), abi.encode('return value'));
        assertEq(descriptor.bodies(17), 'return value');
        vm.clearMockedCalls();
    }

    function testAccessoriesUsesArt() public {
        vm.mockCall(
            address(art),
            abi.encodeWithSelector(INounsArt.accessories.selector, 17),
            abi.encode('return value')
        );
        assertEq(descriptor.accessories(17), 'return value');
        vm.clearMockedCalls();
    }

    function testGlassesUsesArt() public {
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.glasses.selector, 17), abi.encode('return value'));
        assertEq(descriptor.glasses(17), 'return value');
        vm.clearMockedCalls();
    }

    function testPalettesUsesArt() public {
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.palettes.selector, 17), abi.encode('return value'));
        assertEq(descriptor.palettes(17), 'return value');
        vm.clearMockedCalls();
    }

    function testGetPartsForSeedWorks() public {
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.bodies.selector), abi.encode('the body'));
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.accessories.selector), abi.encode('the accessory'));
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.heads.selector), abi.encode('the head'));
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.glasses.selector), abi.encode('the glasses'));
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.palettes.selector), abi.encode('the palette'));

        ISVGRenderer.Part[] memory parts = descriptor.getPartsForSeed(INounsSeeder.Seed(0, 0, 0, 0, 0));

        assertEq(parts[0].image, 'the body');
        assertEq(parts[0].palette, 'the palette');

        assertEq(parts[1].image, 'the accessory');
        assertEq(parts[1].palette, 'the palette');

        assertEq(parts[2].image, 'the head');
        assertEq(parts[2].palette, 'the palette');

        assertEq(parts[3].image, 'the glasses');
        assertEq(parts[3].palette, 'the palette');
    }

    function _makeArtGettersNotRevert() internal {
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.backgroundCount.selector), abi.encode(123));
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.backgrounds.selector), abi.encode('return value'));
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.bodies.selector), abi.encode('return value'));
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.accessories.selector), abi.encode('return value'));
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.heads.selector), abi.encode('return value'));
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.glasses.selector), abi.encode('return value'));
        vm.mockCall(address(art), abi.encodeWithSelector(INounsArt.palettes.selector), abi.encode('return value'));
    }
}

contract NounsDescriptorV3WithRealArtTest is DeployUtils {
    using strings for *;
    using stdJson for string;
    using Base64 for string;

    NounsDescriptorV3 descriptor;

    uint256 glassesIndex = 1;

    function setUp() public {
        descriptor = _deployAndPopulateV3();
    }

    function testGeneratesValidTokenURI() public {
        string memory uri = descriptor.tokenURI(
            0,
            INounsSeeder.Seed({ background: 0, body: 0, accessory: 0, head: 0, glasses: 0 })
        );

        string memory json = string(removeDataTypePrefix(uri).decode());
        string memory imageDecoded = string(removeDataTypePrefix(json.readString('.image')).decode());
        strings.slice memory imageSlice = imageDecoded.toSlice();

        assertEq(json.readString('.name'), 'Noun 0');
        assertEq(json.readString('.description'), 'Noun 0 is a member of the Nouns DAO');
        assertEq(bytes(imageDecoded).length, 6849);
        assertTrue(
            imageSlice.startsWith(
                '<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">'
                    .toSlice()
            )
        );
        assertTrue(
            imageSlice.endsWith(
                '<rect width="60" height="10" x="100" y="160" fill="#ff638d" /><rect width="60" height="10" x="170" y="160" fill="#ff638d" /></svg>'
                    .toSlice()
            )
        );
    }

    function testUpdateGlasssWorks() public {
        // Expected 'hiprose' glasses data after update
        bytes
            memory expectedGlasses = hex'000b1710070300062101000621030001210202022401210100012102020224052102020224032102020224052102020224032102020224022102000121020202240121010001210202022401210300062101000621';

        // Store the initial glasses data at index 1
        bytes memory initialGlasses = descriptor.glasses(glassesIndex);

        // Prepare the new glasses trait data
        bytes
            memory newEncodedCompressedTrait = hex'cd55416e1a4110dcee61bcded8899002f209c9488b2c7ec0253772e4e80b51a4f890e40b1cf3007ec025fc8423af40794aca356a9230a36d6f7209d2d6767575570debb5a8aacecf7db75cdd75cbfaa35b0f9f1cddd91f38fb03673f3afbd1d9bf72f6af0edd7aedecd74efeb5b37fedec37ce7ee3ecbffad6addf74cbd58db37febecdf3afbafef1dfd7bb7fec6d9af1eab9bbb611daaaba9e00a954c55b515b0544562c86a9d6a362b53f37142ffa3fcf796df62af0d5568e5339c787fdb22a3952fe01f703fd7483fcfa7fbcbf32e3fab8b7c695503b3546b5c11d780e7f8d5bfe4e11fcef1d1f297d85f227fc9270996aa480c445d6aa6977ab234bf1ef935e671979a0e60a98ac440d45a33bdd493b35f8ffc03e60fc83fd0012c559118887ad04c2ff5e4607e7efebb8bbfffa0157d7ed79eefd7b8d0577bdfeabf78ef9ecc7f88f92dbedf90270493ed7335d85a47c981d94ca9275bf3f4cfd0f5393fff23bc8e38df91ee60a98ac440d4a3667aa92747f3eb91bfc0fc02f90b3a80a52a120351179ae9a59e2cccaf47fe09f327e49fe80096aa480c443d69a6977a7232bf1ef90de61be43774004b552406a2369ae9a59e34e6d7237f8cf931f2c774004b552406a28e35d34b3d199b9f9ffff4fbefcfee8fdf9f1dff3f76d65172603653eac9ce3cfd33bce8f9cce035c3f96674074b552406a2ce34d34b3d99995f8ffc35e6d7c85feb573880a52a120351d79ae9a59eaccdaf47fe04f313e44ff80dc052158981a813cdf4524f26e6d7237f8ff93df2f774004b552406a2ee35d34b3dd99b9f9f7f7e3f1f303f42fe031dc064c4f773641d25076633a59e8cccd33fc38b9ecf1c5e739c6f4e77b054456220ea5c33bdd493b9f9f5c8df607e83fc0d1dc052158981a81bcdf4524f36e6d7237f85f915f25774004b552406a2ae34d34b3d59991f027e02';
        uint80 decompressedLength = 3808;
        uint16 itemCount = 21;

        // Update glasses at index 1
        descriptor.updateGlasses(newEncodedCompressedTrait, decompressedLength, itemCount);

        // Check if glasses count remains the same after update
        uint256 glassesCount = descriptor.glassesCount();
        assertEq(glassesCount, 21, 'Glasses count should remain unchanged after update');

        // Verify that glasses at index 1 have been updated correctly: to expectedGlasses 'hiprose'
        assertEq(descriptor.glasses(glassesIndex), expectedGlasses, 'Glasses at index 1 should match expected data');

        // Verify that glasses at index 1 have been updated correctly: to not be equal to initialGlasses
        assertFalse(
            keccak256(abi.encodePacked(descriptor.glasses(glassesIndex))) ==
                keccak256(abi.encodePacked(initialGlasses)),
            'Updated glasses should differ from initial glasses'
        );
    }
}
