// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import 'forge-std/StdJson.sol';
import { N00unsDescriptorV2 } from '../../contracts/N00unsDescriptorV2.sol';
import { SVGRenderer } from '../../contracts/SVGRenderer.sol';
import { ISVGRenderer } from '../../contracts/interfaces/ISVGRenderer.sol';
import { IN00unsSeeder } from '../../contracts/interfaces/IN00unsSeeder.sol';
import { N00unsArt } from '../../contracts/N00unsArt.sol';
import { IN00unsArt } from '../../contracts/interfaces/IN00unsArt.sol';
import { Base64 } from 'base64-sol/base64.sol';
import { Inflator } from '../../contracts/Inflator.sol';
import { IInflator } from '../../contracts/interfaces/IInflator.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { strings } from './lib/strings.sol';

contract N00unsDescriptorV2Test is Test {
    N00unsDescriptorV2 descriptor;
    N00unsArt art;
    SVGRenderer renderer;

    function setUp() public {
        renderer = new SVGRenderer();
        descriptor = new N00unsDescriptorV2(IN00unsArt(address(0)), renderer);
        art = new N00unsArt(address(descriptor), new Inflator());
        descriptor.setArt(art);
    }

    function testCannotSetArtIfNotOwner() public {
        vm.prank(address(1));
        vm.expectRevert(bytes('Ownable: caller is not the owner'));
        descriptor.setArt(IN00unsArt(address(2)));
    }

    function testCannotSetArtIfPartsAreLocked() public {
        descriptor.lockParts();
        vm.expectRevert(bytes('Parts are locked'));
        descriptor.setArt(IN00unsArt(address(2)));
    }

    function testSetArtWorks() public {
        descriptor.setArt(IN00unsArt(address(2)));
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
        descriptor.setBaseURI('https://n00uns.wtf/');
        _makeArtGettersNotRevert();
        vm.mockCall(
            address(renderer),
            abi.encodeWithSelector(SVGRenderer.generateSVG.selector),
            abi.encode('mock svg')
        );

        descriptor.toggleDataURIEnabled();
        assertEq(descriptor.tokenURI(42, IN00unsSeeder.Seed(0, 0, 0, 0, 0)), 'https://n00uns.wtf/42');

        descriptor.toggleDataURIEnabled();
        assertEq(
            descriptor.tokenURI(42, IN00unsSeeder.Seed(0, 0, 0, 0, 0)),
            string(
                abi.encodePacked(
                    'data:application/json;base64,',
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                'N00un 42',
                                '", "description":"',
                                'N00un 42 is a member of the N00uns DAO',
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
        vm.mockCall(address(art), abi.encodeWithSelector(N00unsArt.backgroundsCount.selector), abi.encode(42));
        assertEq(descriptor.backgroundCount(), 42);
        vm.clearMockedCalls();
    }

    function testBodyCountUsesArt() public {
        vm.mockCall(
            address(art),
            abi.encodeWithSelector(N00unsArt.getBodiesTrait.selector),
            abi.encode(
                IN00unsArt.Trait({ storedImagesCount: 42, storagePages: new IN00unsArt.N00unArtStoragePage[](0) })
            )
        );
        assertEq(descriptor.bodyCount(), 42);
        vm.clearMockedCalls();
    }

    function testAccessoryCountUsesArt() public {
        vm.mockCall(
            address(art),
            abi.encodeWithSelector(N00unsArt.getAccessoriesTrait.selector),
            abi.encode(
                IN00unsArt.Trait({ storedImagesCount: 42, storagePages: new IN00unsArt.N00unArtStoragePage[](0) })
            )
        );
        assertEq(descriptor.accessoryCount(), 42);
        vm.clearMockedCalls();
    }

    function testHeadCountUsesArt() public {
        vm.mockCall(
            address(art),
            abi.encodeWithSelector(N00unsArt.getHeadsTrait.selector),
            abi.encode(
                IN00unsArt.Trait({ storedImagesCount: 42, storagePages: new IN00unsArt.N00unArtStoragePage[](0) })
            )
        );
        assertEq(descriptor.headCount(), 42);
        vm.clearMockedCalls();
    }

    function testGlassesCountUsesArt() public {
        vm.mockCall(
            address(art),
            abi.encodeWithSelector(N00unsArt.getGlassesTrait.selector),
            abi.encode(
                IN00unsArt.Trait({ storedImagesCount: 42, storagePages: new IN00unsArt.N00unArtStoragePage[](0) })
            )
        );
        assertEq(descriptor.glassesCount(), 42);
        vm.clearMockedCalls();
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

    function testBackgroundsUsesArt() public {
        vm.mockCall(
            address(art),
            abi.encodeWithSelector(IN00unsArt.backgrounds.selector, 17),
            abi.encode('return value')
        );
        assertEq(descriptor.backgrounds(17), 'return value');
        vm.clearMockedCalls();
    }

    function testHeadsUsesArt() public {
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.heads.selector, 17), abi.encode('return value'));
        assertEq(descriptor.heads(17), 'return value');
        vm.clearMockedCalls();
    }

    function testBodiesUsesArt() public {
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.bodies.selector, 17), abi.encode('return value'));
        assertEq(descriptor.bodies(17), 'return value');
        vm.clearMockedCalls();
    }

    function testAccessoriesUsesArt() public {
        vm.mockCall(
            address(art),
            abi.encodeWithSelector(IN00unsArt.accessories.selector, 17),
            abi.encode('return value')
        );
        assertEq(descriptor.accessories(17), 'return value');
        vm.clearMockedCalls();
    }

    function testGlassesUsesArt() public {
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.glasses.selector, 17), abi.encode('return value'));
        assertEq(descriptor.glasses(17), 'return value');
        vm.clearMockedCalls();
    }

    function testPalettesUsesArt() public {
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.palettes.selector, 17), abi.encode('return value'));
        assertEq(descriptor.palettes(17), 'return value');
        vm.clearMockedCalls();
    }

    function testGetPartsForSeedWorks() public {
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.bodies.selector), abi.encode('the body'));
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.accessories.selector), abi.encode('the accessory'));
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.heads.selector), abi.encode('the head'));
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.glasses.selector), abi.encode('the glasses'));
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.palettes.selector), abi.encode('the palette'));

        ISVGRenderer.Part[] memory parts = descriptor.getPartsForSeed(IN00unsSeeder.Seed(0, 0, 0, 0, 0));

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
        vm.mockCall(address(art), abi.encodeWithSelector(N00unsArt.backgroundsCount.selector), abi.encode(123));
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.backgrounds.selector), abi.encode('return value'));
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.bodies.selector), abi.encode('return value'));
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.accessories.selector), abi.encode('return value'));
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.heads.selector), abi.encode('return value'));
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.glasses.selector), abi.encode('return value'));
        vm.mockCall(address(art), abi.encodeWithSelector(IN00unsArt.palettes.selector), abi.encode('return value'));
    }
}

contract N00unsDescriptorV2WithRealArtTest is DeployUtils {
    using strings for *;
    using stdJson for string;
    using Base64 for string;

    N00unsDescriptorV2 descriptor;

    function setUp() public {
        descriptor = _deployAndPopulateV2();
    }

    function testGeneratesValidTokenURI() public {
        string memory uri = descriptor.tokenURI(
            0,
            IN00unsSeeder.Seed({ background: 0, body: 0, accessory: 0, head: 0, glasses: 0 })
        );

        string memory json = string(removeDataTypePrefix(uri).decode());
        string memory imageDecoded = string(removeDataTypePrefix(json.readString('.image')).decode());
        strings.slice memory imageSlice = imageDecoded.toSlice();

        assertEq(json.readString('.name'), 'N00un 0');
        assertEq(json.readString('.description'), 'N00un 0 is a member of the N00uns DAO');
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
}
