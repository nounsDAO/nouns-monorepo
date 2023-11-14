// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { NounsDAOLogicV3BaseTest } from './NounsDAOLogicV3/NounsDAOLogicV3BaseTest.sol';
import { Rewards } from '../../contracts/Rewards.sol';
import { INounsAuctionHouseRewards } from '../../contracts/interfaces/INounsAuctionHouseRewards.sol';

contract RewardsTest is NounsDAOLogicV3BaseTest {
    Rewards rewards;
    INounsAuctionHouseRewards auctionHouse;

    address clientWallet = makeAddr('clientWallet');
    address clientWallet2 = makeAddr('clientWallet2');
    address voter = makeAddr('voter');
    address voter2 = makeAddr('voter2');
    address voter3 = makeAddr('voter3');
    address bidder1 = makeAddr('bidder1');
    address bidder2 = makeAddr('bidder2');

    uint16 constant CLIENT_ID = 42;
    uint16 constant CLIENT_ID2 = 43;

    uint16[] clientIds;

    function setUp() public override {
        super.setUp();

        auctionHouse = INounsAuctionHouseRewards(minter);
        vm.prank(address(dao.timelock()));
        auctionHouse.unpause();

        rewards = new Rewards(address(dao), minter);
        vm.deal(address(rewards), 100 ether);
        vm.deal(address(dao.timelock()), 100 ether);
        vm.deal(bidder1, 10 ether);
        vm.deal(bidder2, 10 ether);

        for (uint256 i; i < 10; i++) {
            mintTo(voter);
            mintTo(voter2);
        }

        for (uint i; i < 5; i++) {
            mintTo(voter3);
        }

        rewards.registerClient(CLIENT_ID, clientWallet);
        rewards.registerClient(CLIENT_ID2, clientWallet2);
    }

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
