// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { NounsDescriptorV2 } from '../../contracts/NounsDescriptorV2.sol';
import { SVGRenderer } from '../../contracts/SVGRenderer.sol';
import { ISVGRenderer } from '../../contracts/interfaces/ISVGRenderer.sol';
import { NounsArt } from '../../contracts/NounsArt.sol';
import { INounsArt } from '../../contracts/interfaces/INounsArt.sol';

contract NounsDescriptorV2Test is Test {
    NounsDescriptorV2 descriptor;
    NounsArt art;

    function setUp() public {
        descriptor = new NounsDescriptorV2(INounsArt(address(0)), new SVGRenderer());
        art = new NounsArt(address(descriptor));
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

    function testBackgroundCountUsesArt() public {
        vm.mockCall(address(art), abi.encodeWithSelector(NounsArt.backgroundsCount.selector), abi.encode(42));
        assertEq(descriptor.backgroundCount(), 42);
        vm.clearMockedCalls();
    }

    function testBodyCountUsesArt() public {
        vm.mockCall(
            address(art),
            abi.encodeWithSelector(NounsArt.bodiesTrait.selector),
            abi.encode(INounsArt.Trait({ storedImagesCount: 42, storagePages: new INounsArt.NounArtStoragePage[](0) }))
        );
        assertEq(descriptor.bodyCount(), 42);
        vm.clearMockedCalls();
    }

    function testAccessoryCountUsesArt() public {
        vm.mockCall(
            address(art),
            abi.encodeWithSelector(NounsArt.accessoriesTrait.selector),
            abi.encode(INounsArt.Trait({ storedImagesCount: 42, storagePages: new INounsArt.NounArtStoragePage[](0) }))
        );
        assertEq(descriptor.accessoryCount(), 42);
        vm.clearMockedCalls();
    }

    function testHeadCountUsesArt() public {
        vm.mockCall(
            address(art),
            abi.encodeWithSelector(NounsArt.headsTrait.selector),
            abi.encode(INounsArt.Trait({ storedImagesCount: 42, storagePages: new INounsArt.NounArtStoragePage[](0) }))
        );
        assertEq(descriptor.headCount(), 42);
        vm.clearMockedCalls();
    }

    function testGlassesCountUsesArt() public {
        vm.mockCall(
            address(art),
            abi.encodeWithSelector(NounsArt.glassesTrait.selector),
            abi.encode(INounsArt.Trait({ storedImagesCount: 42, storagePages: new INounsArt.NounArtStoragePage[](0) }))
        );
        assertEq(descriptor.glassesCount(), 42);
        vm.clearMockedCalls();
    }
}
