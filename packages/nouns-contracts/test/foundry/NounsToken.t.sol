// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { NounsDescriptorV2 } from '../../contracts/NounsDescriptorV2.sol';
import { NounsSeeder } from '../../contracts/NounsSeeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { SVGRenderer } from '../../contracts/SVGRenderer.sol';
import { NounsArt } from '../../contracts/NounsArt.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';

contract NounsTokenTest is Test, DeployUtils {
    NounsToken nounsToken;
    address nounsDAOTreasury = address(1);
    address minter = address(2);
    address pnoundersDAO = address(3);

    function setUp() public {
        NounsDescriptorV2 descriptor = _deployAndPopulateV2();
        _populateDescriptorV2(descriptor);

        nounsToken = new NounsToken(pnoundersDAO, nounsDAOTreasury, minter, descriptor, new NounsSeeder(), IProxyRegistry(address(0)));
    }

    function testSymbol() public {
        assertEq(nounsToken.symbol(), unicode'℗NOUN');
    }

    function testName() public {
        assertEq(nounsToken.name(), 'Public Nouns');
    }

    function testMintANounToSelfAndRewardsNoundersDao() public {
        vm.prank(minter);
        nounsToken.mint();

        assertEq(nounsToken.ownerOf(0), pnoundersDAO);
        assertEq(nounsToken.ownerOf(1), minter);
    }

    function testRotateRewards() public {
        vm.startPrank(minter);
        address owner = nounsToken.owner();
        nounsToken.mint();

        assertEq(nounsToken.ownerOf(0), pnoundersDAO);
        assertEq(nounsToken.ownerOf(1), minter);
        
        for (uint256 index = 0; index < 8; index++) {
            nounsToken.mint();
        }

        nounsToken.mint();

        assertEq(nounsToken.ownerOf(10), owner);
        assertEq(nounsToken.ownerOf(11), minter);

        for (uint256 index = 0; index < 8; index++) {
            nounsToken.mint();
        }

        nounsToken.mint();

        assertEq(nounsToken.ownerOf(20), nounsDAOTreasury);
        assertEq(nounsToken.ownerOf(21), minter);

        for (uint256 index = 0; index < 8; index++) {
            nounsToken.mint();
        }

        nounsToken.mint();

        assertEq(nounsToken.ownerOf(30), pnoundersDAO);
        assertEq(nounsToken.ownerOf(31), minter);
    }
    
    function testStopRewardsAtMaxIndex() public {
        vm.startPrank(minter);
        uint256 maxIndex = nounsToken.maxRewardNoun();
        assertEq(maxIndex, 730);

        for (uint256 index = 0; index < (maxIndex + 10); index++) {
            nounsToken.mint();
        }

        assertFalse(nounsToken.ownerOf(730) == minter);
        assertEq(nounsToken.ownerOf(731), minter);
        assertEq(nounsToken.ownerOf(740), minter);
        assertEq(nounsToken.ownerOf(741), minter);

    }
    
    function testOwnerCanSetMaxReward() public {
        address owner = nounsToken.owner();
        vm.startPrank(owner);

        uint256 maxIndex = nounsToken.maxRewardNoun();
        assertEq(maxIndex, 730);
        
        nounsToken.setMaxRewardNoun(800);

        maxIndex = nounsToken.maxRewardNoun();
        assertEq(maxIndex, 800);
    }

    function testRevertsOnNotMinterMint() public {
        vm.expectRevert('Sender is not the minter');
        nounsToken.mint();
    }
}
