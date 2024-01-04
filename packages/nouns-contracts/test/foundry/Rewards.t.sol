// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { NounsDAOLogicV3BaseTest } from './NounsDAOLogicV3/NounsDAOLogicV3BaseTest.sol';
import { Rewards } from '../../contracts/Rewards.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { AuctionHouseUpgrader } from './helpers/AuctionHouseUpgrader.sol';
import { NounsAuctionHouseProxy } from '../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { console } from 'forge-std/console.sol';

abstract contract RewardsBaseTest is NounsDAOLogicV3BaseTest {
    Rewards rewards;
    INounsAuctionHouseV2 auctionHouse;

    address clientWallet = makeAddr('clientWallet');
    address clientWallet2 = makeAddr('clientWallet2');
    address voter = makeAddr('voter');
    address voter2 = makeAddr('voter2');
    address voter3 = makeAddr('voter3');
    address bidder1 = makeAddr('bidder1');
    address bidder2 = makeAddr('bidder2');

    uint32 constant CLIENT_ID = 42;
    uint32 constant CLIENT_ID2 = 43;

    uint256 constant SECONDS_IN_BLOCK = 12;

    uint32[] clientIds;

    function setUp() public virtual override {
        dao = _deployDAOV3WithParams(24 hours);
        nounsToken = NounsToken(address(dao.nouns()));
        minter = nounsToken.minter();

        auctionHouse = INounsAuctionHouseV2(minter);
        vm.prank(address(dao.timelock()));
        auctionHouse.unpause();

        rewards = new Rewards(address(dao), minter, uint32(dao.proposalCount()) + 1);
        vm.deal(address(rewards), 100 ether);
        vm.deal(address(dao.timelock()), 100 ether);
        vm.deal(bidder1, 1000 ether);
        vm.deal(bidder2, 10 ether);

        for (uint256 i; i < 10; i++) {
            _mintTo(voter);
            _mintTo(voter2);
        }

        for (uint256 i; i < 5; i++) {
            _mintTo(voter3);
        }

        AuctionHouseUpgrader.upgradeAuctionHouse(
            address(dao.timelock()),
            auctionHouseProxyAdmin,
            NounsAuctionHouseProxy(payable(address(auctionHouse)))
        );

        rewards.registerClient(CLIENT_ID, clientWallet);
        rewards.registerClient(CLIENT_ID2, clientWallet2);
    }

    function _mintTo(address to) internal returns (uint256 tokenID) {
        vm.startPrank(minter);
        tokenID = nounsToken.mint();
        nounsToken.transferFrom(minter, to, tokenID);
        vm.stopPrank();
        vm.roll(block.number + 1);
    }
}

contract RewardsTest is RewardsBaseTest {
    function test_rewardsProposalCreation() public {
        uint256 proposalId = propose(voter, address(1), 1 ether, '', '', 'my proposal', CLIENT_ID);
        vm.roll(block.number + dao.proposalUpdatablePeriodInBlocks() + dao.votingDelay() + 1);

        vm.prank(voter);
        dao.castRefundableVote(proposalId, 1);

        vm.roll(block.number + dao.votingPeriod() + 1);
        dao.queue(proposalId);
        vm.warp(dao.proposalsV3(proposalId).eta);
        dao.execute(proposalId);

        rewards.rewardForProposalCreation(proposalId);

        assertEq(clientWallet.balance, rewards.REWARD_FOR_PROPOSAL_CREATION());
    }

    function test_rewardsAuctionBidding() public {
        uint256 nounId = auctionHouse.auction().nounId;
        vm.prank(bidder1);
        auctionHouse.createBid{ value: 0.01 ether }(nounId);

        vm.prank(bidder2);
        auctionHouse.createBid{ value: 0.02 ether }(nounId, CLIENT_ID);

        vm.warp(auctionHouse.auction().endTime + 1);
        auctionHouse.settleCurrentAndCreateNewAuction();

        rewards.rewardForAuctionBidding(1);

        assertEq(clientWallet.balance, rewards.REWARD_FOR_AUCTION_BIDDING());
    }

    function test_rewardsProposalVoting() public {
        uint256 proposalId = propose(voter, address(1), 1 ether, '', '', 'my proposal', CLIENT_ID);
        vm.roll(block.number + dao.proposalUpdatablePeriodInBlocks() + dao.votingDelay() + 1);

        vm.prank(voter);
        dao.castRefundableVoteWithReason(proposalId, 1, 'i support', CLIENT_ID);

        vm.prank(voter2);
        dao.castRefundableVoteWithReason(proposalId, 1, 'i support');

        vm.roll(block.number + dao.votingPeriod() + 1);
        dao.queue(proposalId);
        vm.warp(dao.proposalsV3(proposalId).eta);
        dao.execute(proposalId);

        rewards.rewardForVoting(proposalId, CLIENT_ID);

        assertEq(clientWallet.balance, rewards.REWARD_FOR_PROPOSAL_VOTING() / 2);
    }

    function test_rewardForVotingWithBonus() public {
        uint256 proposalId = propose(voter, address(1), 1 ether, '', '', 'my proposal', CLIENT_ID);
        vm.roll(block.number + dao.proposalUpdatablePeriodInBlocks() + dao.votingDelay() + 1);

        vm.prank(voter);
        dao.castRefundableVoteWithReason(proposalId, 1, 'i support', CLIENT_ID);

        vm.prank(voter2);
        dao.castRefundableVoteWithReason(proposalId, 1, 'i support');

        vm.prank(voter3);
        dao.castRefundableVoteWithReason(proposalId, 1, 'i dont support', CLIENT_ID2);

        vm.roll(block.number + dao.votingPeriod() + 1);
        dao.queue(proposalId);
        vm.warp(dao.proposalsV3(proposalId).eta);
        dao.execute(proposalId);

        clientIds = [CLIENT_ID, 0, CLIENT_ID2];
        rewards.rewardForVotingWithBonus(proposalId, clientIds);
    }
}

contract AuctionRevenueBasedRewards is RewardsBaseTest {
    uint256 proposalId;
    uint256 settledNounIdBeforeProposal;
    uint256 nounOnAuctionWhenLastProposalWasCreated;

    function setUp() public override {
        super.setUp();

        vm.startPrank(address(dao.timelock()));
        dao._setProposalUpdatablePeriodInBlocks(18000); // 2.5 days
        dao._setVotingDelay(3600); // 0.5 days
        dao._setVotingPeriod(28800); // 4 days
        vm.stopPrank();

        // settle 3 auctions at 1 ether
        bidAndSettleMultipleAuctions({ numAuctions: 2, bidAmount: 1 ether });
        settledNounIdBeforeProposal = bidAndSettleAuction(1 ether);

        rewards.setNextProposalRewardTimestamp(block.timestamp);

        for (uint256 i; i < 10; i++) {
            // create proposal 1 by client A
            proposalId = propose(voter, address(1), 1 ether, '', '', 'my proposal', CLIENT_ID);

            // go forward 3 days until voting starts
            bidAndSettleMultipleAuctions({ numAuctions: 3, bidAmount: 2 ether });

            // vote on proposal with client A, B & zero
            vote(voter, proposalId, 1, 'i support', CLIENT_ID);
            vote(voter2, proposalId, 1, 'i support');
            vote(voter3, proposalId, 0, 'i dont support', CLIENT_ID2);

            // go forward 4 days until voting ends
            bidAndSettleMultipleAuctions({ numAuctions: 4, bidAmount: 3 ether });

            dao.queue(proposalId);
        }

        // create proposal 2 by client B
        proposalId = propose(voter, address(1), 1 ether, '', '', 'my proposal', CLIENT_ID2);
        nounOnAuctionWhenLastProposalWasCreated = auctionHouse.auction().nounId;

        // go forward 3 days until voting starts
        bidAndSettleMultipleAuctions({ numAuctions: 3, bidAmount: 2 ether });

        // vote on proposal with client A
        vote(voter, proposalId, 1, 'i support', CLIENT_ID);
        vote(voter2, proposalId, 1, 'i support');

        // go forward 4 days until voting ends
        bidAndSettleMultipleAuctions({ numAuctions: 4, bidAmount: 3 ether });

        dao.queue(proposalId);

        bidAndSettleAuction(3 ether);
    }

    function vote(
        address voter_,
        uint256 proposalId_,
        uint8 support,
        string memory reason,
        uint32 clientId
    ) internal {
        vm.prank(voter_);
        dao.castRefundableVoteWithReason(proposalId_, support, reason, clientId);
    }

    function vote(
        address voter_,
        uint256 proposalId_,
        uint8 support,
        string memory reason
    ) internal {
        vm.prank(voter_);
        dao.castRefundableVoteWithReason(proposalId_, support, reason);
    }

    function bidAndSettleMultipleAuctions(uint256 numAuctions, uint256 bidAmount) internal {
        for (uint256 i; i < numAuctions; i++) {
            bidAndSettleAuction(bidAmount);
        }
    }

    function rollWarpForward(uint256 numBlocks) internal {
        vm.roll(block.number + numBlocks);
        vm.warp(block.timestamp + numBlocks * SECONDS_IN_BLOCK);
    }

    function test_auctionRevenueBounty_happyFlow() public {
        clientIds = [0, CLIENT_ID, CLIENT_ID2];

        rewards.bountyRewardForProposals({
            lastProposalId: uint32(proposalId),
            expectedNumEligibleProposals: 11,
            expectedNumEligibileVotes: 270,
            firstNounId: settledNounIdBeforeProposal,
            lastNounId: nounOnAuctionWhenLastProposalWasCreated + 1, // TODO: why do we not include the lastNounId ?
            votingClientIds: clientIds
        });
    }

    function bidAndSettleAuction(uint256 bidAmount) internal returns (uint256) {
        uint256 nounId = auctionHouse.auction().nounId;

        vm.prank(bidder1);
        auctionHouse.createBid{ value: bidAmount }(nounId);

        uint256 blocksToEnd = (auctionHouse.auction().endTime - block.timestamp) / SECONDS_IN_BLOCK + 1;
        rollWarpForward(blocksToEnd);
        auctionHouse.settleCurrentAndCreateNewAuction();

        return nounId;
    }
}
