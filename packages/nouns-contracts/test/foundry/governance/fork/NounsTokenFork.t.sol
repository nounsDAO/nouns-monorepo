// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { DeployUtilsFork } from '../../helpers/DeployUtilsFork.sol';
import { NounsTokenFork } from '../../../../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { NounsDAOForkEscrowMock } from '../../helpers/NounsDAOForkEscrowMock.sol';
import { NounsTokenLikeMock } from '../../helpers/NounsTokenLikeMock.sol';
import { INounsSeeder } from '../../../../contracts/interfaces/INounsSeeder.sol';
import { NounsSeeder } from '../../../../contracts/NounsSeeder.sol';
import { NounsDescriptorV2 } from '../../../../contracts/NounsDescriptorV2.sol';

abstract contract NounsTokenForkBase is DeployUtilsFork {
    NounsTokenFork token;
    NounsTokenLikeMock originalToken;
    uint32 forkId;
    NounsSeeder seeder;
    NounsDescriptorV2 descriptor;
    NounsDAOForkEscrowMock escrow;

    address treasury = makeAddr('treasury');
    address minter = makeAddr('minter');
    address originalDAO = makeAddr('original dao');

    uint256[] tokenIds;

    function setUp() public virtual {
        originalToken = new NounsTokenLikeMock();
        forkId = 1;
        escrow = new NounsDAOForkEscrowMock(forkId, originalDAO, originalToken);

        tokenIds.push(1);
        tokenIds.push(4);
        tokenIds.push(2);
        originalToken.setSeed(1, INounsSeeder.Seed(0, 1, 2, 3, 4));
        originalToken.setSeed(4, INounsSeeder.Seed(5, 6, 7, 8, 9));
        originalToken.setSeed(2, INounsSeeder.Seed(10, 11, 12, 13, 14));

        token = new NounsTokenFork();
        token.initialize(treasury, minter, escrow, forkId, 0, 3, block.timestamp + FORK_PERIOD);

        seeder = new NounsSeeder();
        vm.prank(token.owner());
        token.setSeeder(seeder);

        descriptor = _deployAndPopulateV2();
        vm.prank(token.owner());
        token.setDescriptor(descriptor);
    }

    function assertSeedEquals(INounsSeeder.Seed memory actual, INounsSeeder.Seed memory expected) internal {
        assertEqUint(expected.background, actual.background);
        assertEqUint(expected.body, actual.body);
        assertEqUint(expected.accessory, actual.accessory);
        assertEqUint(expected.head, actual.head);
        assertEqUint(expected.glasses, actual.glasses);
    }

    function getSeed(uint256 nounId) internal view returns (INounsSeeder.Seed memory) {
        (uint48 background, uint48 body, uint48 accessory, uint48 head, uint48 glasses) = token.seeds(nounId);
        return INounsSeeder.Seed(background, body, accessory, head, glasses);
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
        assertSeedEquals(getSeed(1), INounsSeeder.Seed(0, 1, 2, 3, 4));
        assertSeedEquals(getSeed(4), INounsSeeder.Seed(5, 6, 7, 8, 9));
        assertSeedEquals(getSeed(2), INounsSeeder.Seed(10, 11, 12, 13, 14));
    }
}

contract NounsTokenFork_ClaimFromEscrow_Test is NounsTokenForkBase {
    address nouner = makeAddr('nouner');

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
        assertSeedEquals(getSeed(1), INounsSeeder.Seed(0, 1, 2, 3, 4));
        assertSeedEquals(getSeed(4), INounsSeeder.Seed(5, 6, 7, 8, 9));
        assertSeedEquals(getSeed(2), INounsSeeder.Seed(10, 11, 12, 13, 14));

        assertEq(token.remainingTokensToClaim(), 0);
    }

    function test_givenValidSenderTriesTwice_reverts() public {
        vm.startPrank(nouner);
        token.claimFromEscrow(tokenIds);

        vm.expectRevert('ERC721: token already minted');
        token.claimFromEscrow(tokenIds);
    }
}
