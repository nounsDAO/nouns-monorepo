// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { N00unsToken } from '../../contracts/N00unsToken.sol';
import { N00unsDescriptorV2 } from '../../contracts/N00unsDescriptorV2.sol';
import { N00unsSeeder } from '../../contracts/N00unsSeeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { SVGRenderer } from '../../contracts/SVGRenderer.sol';
import { N00unsArt } from '../../contracts/N00unsArt.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';

contract N00unsTokenTest is Test, DeployUtils {
    N00unsToken n00unsToken;
    address n00undersDAO = address(1);
    address minter = address(2);

    function setUp() public {
        N00unsDescriptorV2 descriptor = _deployAndPopulateV2();
        _populateDescriptorV2(descriptor);

        n00unsToken = new N00unsToken(n00undersDAO, minter, descriptor, new N00unsSeeder(), IProxyRegistry(address(0)));
    }

    function testSymbol() public {
        assertEq(n00unsToken.symbol(), 'N00UN');
    }

    function testName() public {
        assertEq(n00unsToken.name(), 'N00uns');
    }

    function testMintAN00unToSelfAndRewardsN00undersDao() public {
        vm.prank(minter);
        n00unsToken.mint();

        assertEq(n00unsToken.ownerOf(0), n00undersDAO);
        assertEq(n00unsToken.ownerOf(1), minter);
    }

    function testRevertsOnNotMinterMint() public {
        vm.expectRevert('Sender is not the minter');
        n00unsToken.mint();
    }
}
