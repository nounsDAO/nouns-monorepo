// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { VrbsToken } from '../../contracts/VrbsToken.sol';
import { DescriptorV2 } from '../../contracts/DescriptorV2.sol';
import { Seeder } from '../../contracts/Seeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { SVGRenderer } from '../../contracts/SVGRenderer.sol';
import { Art } from '../../contracts/Art.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';

contract VrbsTokenTest is Test, DeployUtils {
    VrbsToken vrbsToken;
    address vrbsDAO = address(1);
    address minter = address(2);

    function setUp() public {
        DescriptorV2 descriptor = _deployAndPopulateV2();
        _populateDescriptorV2(descriptor);

        vrbsToken = new VrbsToken(vrbsDAO, minter, descriptor, new Seeder(), IProxyRegistry(address(0)));
    }

    function testSymbol() public {
        assertEq(vrbsToken.symbol(), 'N00UN');
    }

    function testName() public {
        assertEq(vrbsToken.name(), 'Vrbs');
    }

    function testMintAVrbToSelfAndRewardsVrbsDao() public {
        vm.prank(minter);
        vrbsToken.mint();

        assertEq(vrbsToken.ownerOf(0), vrbsDAO);
        assertEq(vrbsToken.ownerOf(1), minter);
    }

    function testRevertsOnNotMinterMint() public {
        vm.expectRevert('Sender is not the minter');
        vrbsToken.mint();
    }
}
