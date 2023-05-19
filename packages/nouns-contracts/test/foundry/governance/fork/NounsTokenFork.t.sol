// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { DeployUtilsFork } from '../../helpers/DeployUtilsFork.sol';
import { NounsTokenFork } from '../../../../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { NounsDAOForkEscrowMock } from '../../helpers/NounsDAOForkEscrowMock.sol';
import { NounsSeeder } from '../../../../contracts/NounsSeeder.sol';
import { NounsDescriptorV2 } from '../../../../contracts/NounsDescriptorV2.sol';
import { NounsToken } from '../../../../contracts/NounsToken.sol';
import { IProxyRegistry } from '../../../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsTokenLike } from '../../../../contracts/governance/NounsDAOInterfaces.sol';

abstract contract NounsTokenForkBase is DeployUtilsFork {
    NounsTokenFork token;
    NounsToken originalToken;
    uint32 forkId;
    NounsSeeder seeder;
    NounsDescriptorV2 descriptor;
    NounsDAOForkEscrowMock escrow;

    address treasury = makeAddr('treasury');
    address minter = makeAddr('minter');
    address originalDAO = makeAddr('original dao');

    address nouner = makeAddr('nouner');
    uint256[] tokenIds;

    function setUp() public virtual {
        descriptor = _deployAndPopulateV2();
        seeder = new NounsSeeder();

        originalToken = new NounsToken(makeAddr('noundersDAO'), minter, descriptor, seeder, IProxyRegistry(address(1)));
        vm.startPrank(minter);
        for (uint256 i = 0; i < 4; ++i) {
            uint256 tokenId = originalToken.mint();
            originalToken.transferFrom(address(minter), nouner, tokenId);
        }
        vm.stopPrank();

        forkId = 1;
        escrow = new NounsDAOForkEscrowMock(forkId, originalDAO, NounsTokenLike(address(originalToken)));

        tokenIds.push(1);
        tokenIds.push(4);
        tokenIds.push(2);

        token = new NounsTokenFork();
        token.initialize(treasury, minter, escrow, forkId, 0, 3, block.timestamp + FORK_PERIOD);
        vm.startPrank(token.owner());
        token.setSeeder(seeder);
        token.setDescriptor(descriptor);
        vm.stopPrank();
    }
}

contract NounsTokenFork_Mint_Test is NounsTokenForkBase {
    function test_mint_noFounderRewards() public {
        vm.startPrank(token.minter());
        while (token.totalSupply() < 20) token.mint();

        // founder rewards would send tokens straight to the founders
        // while other tokens stay with the minter until someone buys them on auction.
        assertEq(token.balanceOf(token.minter()), token.totalSupply());
    }
}

contract NounsTokenFork_ClaimDuringForkPeriod_Test is NounsTokenForkBase {
    address recipient = makeAddr('recipient');

    function test_givenMsgSenderNotOriginalDAO_reverts() public {
        vm.expectRevert(abi.encodeWithSelector(NounsTokenFork.OnlyOriginalDAO.selector));
        vm.prank(makeAddr('not DAO'));
        token.claimDuringForkPeriod(recipient, new uint256[](0));
    }

    function test_givenForkingPeriodExpired_reverts() public {
        vm.warp(token.forkingPeriodEndTimestamp() + 1);

        vm.prank(originalDAO);
        vm.expectRevert(abi.encodeWithSelector(NounsTokenFork.OnlyDuringForkingPeriod.selector));
        token.claimDuringForkPeriod(recipient, new uint256[](0));
    }

    function test_mintsTokensSameIDsSameSeeds() public {
        vm.prank(originalDAO);
        token.claimDuringForkPeriod(recipient, tokenIds);

        assertEq(token.balanceOf(recipient), 3);
        assertEq(token.ownerOf(1), recipient);
        assertEq(token.ownerOf(4), recipient);
        assertEq(token.ownerOf(2), recipient);
        assertEq(token.tokenURI(1), originalToken.tokenURI(1));
        assertEq(token.tokenURI(4), originalToken.tokenURI(4));
        assertEq(token.tokenURI(2), originalToken.tokenURI(2));
    }
}

contract NounsTokenFork_ClaimFromEscrow_Test is NounsTokenForkBase {
    function setUp() public override {
        super.setUp();
        escrow.setOwnerOfTokens(nouner, tokenIds);
    }

    function test_givenMsgSenderThanIsntTheOriginalTokenOwner_reverts() public {
        vm.prank(makeAddr('not owner'));
        vm.expectRevert(abi.encodeWithSelector(NounsTokenFork.OnlyTokenOwnerCanClaim.selector));
        token.claimFromEscrow(tokenIds);
    }

    function test_givenValidSender_mintsTokensSameIDsSameSeeds() public {
        vm.prank(nouner);
        token.claimFromEscrow(tokenIds);

        assertEq(token.ownerOf(1), nouner);
        assertEq(token.ownerOf(4), nouner);
        assertEq(token.ownerOf(2), nouner);
        assertEq(token.tokenURI(1), originalToken.tokenURI(1));
        assertEq(token.tokenURI(4), originalToken.tokenURI(4));
        assertEq(token.tokenURI(2), originalToken.tokenURI(2));

        assertEq(token.remainingTokensToClaim(), 0);
    }

    function test_givenValidSenderTriesTwice_reverts() public {
        vm.startPrank(nouner);
        token.claimFromEscrow(tokenIds);

        vm.expectRevert('ERC721: token already minted');
        token.claimFromEscrow(tokenIds);
    }
}
