// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { NounsDAOLogicV3BaseTest } from '../NounsDAOLogicV3/NounsDAOLogicV3BaseTest.sol';
import { ERC20Mock } from '../helpers/ERC20Mock.sol';
import { Rewards } from '../../../contracts/Rewards.sol';
import { INounsAuctionHouseV2 } from '../../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { AuctionHouseUpgrader } from '../helpers/AuctionHouseUpgrader.sol';
import { NounsAuctionHouseProxy } from '../../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';

abstract contract BaseProposalRewardsTest is NounsDAOLogicV3BaseTest {
    Rewards rewards;
    ERC20Mock erc20Mock = new ERC20Mock();
    INounsAuctionHouseV2 auctionHouse;

    address bidder1 = makeAddr('bidder1');
    address bidder2 = makeAddr('bidder2');
    address client1Wallet = makeAddr('client1Wallet');
    uint32 clientId1;
    uint32 clientId2;
    uint32[] votingClientIds;
    Rewards.RewardParams params;

    uint256 constant SECONDS_IN_BLOCK = 12;

    function setUp() public virtual override {
        _setUpDAO();

        vm.deal(bidder1, 100 ether);
        vm.deal(bidder2, 100 ether);

        // need at least one settled auction
        bidAndSettleAuction(1 ether);
        bidAndSettleAuction(bidder2, 1 ether);
        mineBlocks(1);

        // increase total supply to > 10
        while (nounsToken.totalSupply() < 10) {
            bidAndSettleAuction({ bidAmount: 1 ether });
        }

        vm.prank(makeAddr('noundersDAO'));
        nounsToken.transferFrom(makeAddr('noundersDAO'), bidder2, 0);

        params = Rewards.RewardParams({
            minimumRewardPeriod: 2 weeks,
            numProposalsEnoughForReward: 30,
            proposalRewardBps: 100,
            votingRewardBps: 50,
            auctionRewardBps: 150,
            proposalEligibilityQuorumBps: 1000
        });

        rewards = new Rewards({
            owner: address(dao.timelock()),
            nounsDAO_: address(dao),
            auctionHouse_: minter,
            nextProposalIdToReward_: 1,
            nextAuctionIdToReward_: 2,
            ethToken_: address(erc20Mock),
            nextProposalRewardFirstAuctionId_: auctionHouse.auction().nounId,
            rewardParams: params,
            descriptor: address(0)
        });

        vm.prank(client1Wallet);
        clientId1 = rewards.registerClient();
        clientId2 = rewards.registerClient();

        erc20Mock.mint(address(rewards), 100 ether);
    }

    function _setUpDAO() internal {
        dao = _deployDAOV3WithParams({ auctionDuration: 24 hours });
        nounsToken = NounsToken(address(dao.nouns()));
        minter = nounsToken.minter();

        auctionHouse = INounsAuctionHouseV2(minter);
        vm.prank(address(dao.timelock()));
        auctionHouse.unpause();

        AuctionHouseUpgrader.upgradeAuctionHouse(
            address(dao.timelock()),
            auctionHouseProxyAdmin,
            NounsAuctionHouseProxy(payable(address(auctionHouse)))
        );
    }

    function proposeVoteAndEndVotingPeriod(uint32 clientId) internal returns (uint32) {
        uint32 proposalId = proposeAndVote(clientId);
        mineBlocks(VOTING_PERIOD);
        return proposalId;
    }

    function proposeAndVote(uint32 clientId) internal returns (uint32) {
        uint256 proposalId = propose(bidder1, address(1), 1 ether, '', '', 'my proposal', clientId);
        mineBlocks(VOTING_DELAY + UPDATABLE_PERIOD_BLOCKS + 1);
        vote(bidder1, proposalId, 1, 'i support');
        return uint32(proposalId);
    }

    function bidAndSettleAuction(address bidder, uint256 bidAmount) internal returns (uint256) {
        uint256 nounId = auctionHouse.auction().nounId;

        vm.prank(bidder);
        auctionHouse.createBid{ value: bidAmount }(nounId);

        return fastforwardAndSettleAuction();
    }

    function bidAndSettleAuction(uint256 bidAmount) internal returns (uint256) {
        return bidAndSettleAuction(bidder1, bidAmount);
    }

    function fastforwardAndSettleAuction() internal returns (uint256) {
        uint256 nounId = auctionHouse.auction().nounId;

        uint256 blocksToEnd = (auctionHouse.auction().endTime - block.timestamp) / SECONDS_IN_BLOCK + 1;
        mineBlocks(blocksToEnd);
        auctionHouse.settleCurrentAndCreateNewAuction();

        return nounId;
    }

    function settleAuction() internal returns (uint256 settledNounId) {
        settledNounId = auctionHouse.auction().nounId;
        auctionHouse.settleCurrentAndCreateNewAuction();
    }

    function mineBlocks(uint256 numBlocks) internal {
        vm.roll(block.number + numBlocks);
        vm.warp(block.timestamp + numBlocks * SECONDS_IN_BLOCK);
    }

    function vote(address voter_, uint256 proposalId_, uint8 support, string memory reason) internal {
        vm.prank(voter_);
        dao.castRefundableVoteWithReason(proposalId_, support, reason);
    }

    function vote(address voter_, uint256 proposalId_, uint8 support, string memory reason, uint32 clientId) internal {
        vm.prank(voter_);
        dao.castRefundableVoteWithReason(proposalId_, support, reason, clientId);
    }
}

contract ProposalRewardsTest is BaseProposalRewardsTest {
    function test_revertsIfNoAuctionRevenue() public {
        fastforwardAndSettleAuction();
        fastforwardAndSettleAuction();

        vm.warp(block.timestamp + 2 weeks + 1);
        uint32 proposalId = proposeVoteAndEndVotingPeriod(clientId1);

        settleAuction();
        votingClientIds = [0];
        vm.expectRevert('auctionRevenue must be > 0');
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });
    }

    function test_revertsIfProposalsNotDoneWithVoting() public {
        bidAndSettleAuction({ bidAmount: 5 ether });

        vm.warp(block.timestamp + 2 weeks + 1);
        uint32 proposalId = proposeAndVote(clientId1);

        settleAuction();
        votingClientIds = [0];
        vm.expectRevert('all proposals must be done with voting');
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });
    }

    function test_rewardsAfterMinimumRewardPeriod() public {
        uint256 startTimestamp = block.timestamp;

        bidAndSettleAuction({ bidAmount: 5 ether });
        bidAndSettleAuction({ bidAmount: 10 ether });

        vm.warp(startTimestamp + 2 weeks + 1);
        uint32 proposalId = proposeVoteAndEndVotingPeriod(clientId1);

        settleAuction();
        votingClientIds = [0];
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });

        assertEq(rewards.clientBalance(clientId1), 0.15 ether); // 15 eth * 1%
    }

    function test_doesntRewardIneligibleProposals() public {
        uint256 startTimestamp = block.timestamp;

        bidAndSettleAuction({ bidAmount: 5 ether });
        bidAndSettleAuction({ bidAmount: 10 ether });

        vm.warp(startTimestamp + 2 weeks + 1);
        propose(bidder2, address(1), 1 ether, '', '', 'my proposal', clientId1);
        uint32 proposalId = proposeVoteAndEndVotingPeriod(clientId2);

        settleAuction();
        votingClientIds = [0];
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });

        assertEq(rewards.clientBalance(clientId1), 0 ether);
        assertEq(rewards.clientBalance(clientId2), 0.15 ether); // 15 eth * 1%
    }

    function test_splitsRewardsBetweenEligibleProposals() public {
        uint256 startTimestamp = block.timestamp;

        bidAndSettleAuction({ bidAmount: 5 ether });
        bidAndSettleAuction({ bidAmount: 10 ether });

        vm.warp(startTimestamp + 2 weeks + 1);
        proposeVoteAndEndVotingPeriod(clientId1);
        uint32 proposalId = proposeVoteAndEndVotingPeriod(clientId2);

        settleAuction();
        votingClientIds = [0];
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });

        assertEq(rewards.clientBalance(clientId1), 0.075 ether); // 15 eth * 1% / 2
        assertEq(rewards.clientBalance(clientId2), 0.075 ether); // 15 eth * 1% / 2
    }

    function test_doesntRewardIfMinimumPeriodHasntPassed() public {
        uint256 startTimestamp = block.timestamp;

        bidAndSettleAuction({ bidAmount: 5 ether });
        bidAndSettleAuction({ bidAmount: 10 ether });

        vm.warp(startTimestamp + 2 weeks - 10);

        uint32 proposalId = proposeVoteAndEndVotingPeriod(clientId1);

        settleAuction();

        votingClientIds = [0];
        vm.expectRevert('not enough time passed');
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });
    }

    function test_rewardsIfMinimumNumberOfProposalsWereCreated_evenIfMinimumPeriodHasntPassed() public {
        // set numProposalsEnoughForReward to 1
        vm.prank(address(dao.timelock()));
        rewards.setParams(
            Rewards.RewardParams({
                minimumRewardPeriod: 2 weeks,
                numProposalsEnoughForReward: 1,
                proposalRewardBps: 100,
                votingRewardBps: 50,
                auctionRewardBps: 150,
                proposalEligibilityQuorumBps: 1000
            })
        );

        uint256 startTimestamp = block.timestamp;

        bidAndSettleAuction({ bidAmount: 5 ether });
        bidAndSettleAuction({ bidAmount: 10 ether });

        vm.warp(startTimestamp + 2 weeks - 10);

        uint32 proposalId = proposeVoteAndEndVotingPeriod(clientId1);

        settleAuction();

        votingClientIds = [0];
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });
        assertEq(rewards.clientBalance(clientId1), 0.15 ether); // 15 eth * 1%
    }
}

contract ProposalRewardsEligibilityTest is BaseProposalRewardsTest {
    uint256 lastNounId;
    uint32 proposalId;

    function setUp() public virtual override {
        super.setUp();

        uint256 startTimestamp = block.timestamp;
        bidAndSettleAuction({ bidAmount: 5 ether });
        vm.warp(startTimestamp + 2 weeks + 1);
        proposalId = proposeVoteAndEndVotingPeriod(clientId1);

        lastNounId = settleAuction();

        // verify assumptions
        assertEq(nounsToken.totalSupply(), 12);
        assertEq(nounsToken.getCurrentVotes(bidder1), 8);

        votingClientIds = [0];
    }

    function test_ineligibleIfBelowQuorum() public {
        // set quorum to > 66%
        params.proposalEligibilityQuorumBps = 7500;
        vm.prank(address(dao.timelock()));
        rewards.setParams(params);

        vm.expectRevert('at least one eligible proposal');
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });
    }

    function test_eligibleIfAboveQuorum() public {
        params.proposalEligibilityQuorumBps = 7000;
        vm.prank(address(dao.timelock()));
        rewards.setParams(params);

        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });
    }
}

contract AfterOneSuccessfulRewardsDistributionTest is BaseProposalRewardsTest {
    uint256 lastProposalCreationTimestamp;

    function setUp() public virtual override {
        super.setUp();

        uint256 startTimestamp = block.timestamp;

        bidAndSettleAuction({ bidAmount: 10 ether });

        vm.warp(startTimestamp + 2 weeks + 1);
        lastProposalCreationTimestamp = block.timestamp;
        uint32 proposalId = proposeVoteAndEndVotingPeriod(clientId1);

        settleAuction();
        votingClientIds = [0];
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });

        assertEq(rewards.clientBalance(clientId1), 0.1 ether); // 10 eth * 1%
    }

    function test_revertsIfMinimumPeriodHasntPassedAgain() public {
        bidAndSettleAuction({ bidAmount: 5 ether });

        vm.warp(lastProposalCreationTimestamp + 2 weeks - 10);
        uint32 proposalId = proposeVoteAndEndVotingPeriod(clientId1);

        settleAuction();
        vm.expectRevert('not enough time passed');
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });
    }

    function test_rewardsIfMinimumPeriodPassedAgain() public {
        bidAndSettleAuction({ bidAmount: 5 ether });

        vm.warp(lastProposalCreationTimestamp + 2 weeks + 10);
        uint32 proposalId = proposeVoteAndEndVotingPeriod(clientId1);

        settleAuction();
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });

        assertEq(rewards.clientBalance(clientId1), 0.15 ether);
    }

    function test_clientCanWithdrawBalance() public {
        vm.prank(client1Wallet);
        rewards.withdrawClientBalance(clientId1, 0.05 ether, client1Wallet);

        assertEq(erc20Mock.balanceOf(client1Wallet), 0.05 ether);
    }

    function test_withdrawingEntireBalanceLeaves1Wei() public {
        uint256 balance = rewards.clientBalance(clientId1);

        vm.prank(client1Wallet);
        rewards.withdrawClientBalance(clientId1, balance, client1Wallet);

        assertEq(rewards.clientBalance(clientId1), 0);
        assertEq(rewards._clientBalances(clientId1), 1);
    }

    function test_withdrawingMoreThanBalanceReverts() public {
        uint256 balance = rewards.clientBalance(clientId1);
        vm.prank(client1Wallet);
        vm.expectRevert('amount too large');
        rewards.withdrawClientBalance(clientId1, balance + 1, client1Wallet);
    }

    function test_withdrawingUpdatesBalance() public {
        uint256 balance = rewards.clientBalance(clientId1);

        vm.prank(client1Wallet);
        rewards.withdrawClientBalance(clientId1, balance, client1Wallet);

        vm.prank(client1Wallet);
        vm.expectRevert('amount too large');
        rewards.withdrawClientBalance(clientId1, 1, client1Wallet);
    }

    function test_withdraw_revertsIfNotClientIdOwner() public {
        vm.expectRevert('must be client NFT owner');
        rewards.withdrawClientBalance(clientId1, 1, client1Wallet);
    }
}

contract VotesRewardsTest is BaseProposalRewardsTest {
    uint32 proposalId;

    function setUp() public virtual override {
        super.setUp();

        uint256 startTimestamp = block.timestamp;
        bidAndSettleAuction({ bidAmount: 15 ether });
        vm.warp(startTimestamp + 2 weeks + 1);

        proposalId = uint32(propose(bidder1, address(1), 1 ether, '', '', 'my proposal', 0));
        mineBlocks(VOTING_DELAY + UPDATABLE_PERIOD_BLOCKS + 1);
    }

    function test_singleClientVotingGetsAllTheRewards() public {
        vote(bidder1, proposalId, 1, 'i support', clientId1);
        mineBlocks(VOTING_PERIOD);

        settleAuction();
        votingClientIds = [clientId1];
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });

        assertEq(rewards.clientBalance(clientId1), 0.075 ether); // 15 eth * 0.5%
    }

    function test_rewardSplitBetweenTwoClients() public {
        // cast 8 votes
        assertEq(nounsToken.getCurrentVotes(bidder1), 8);
        vote(bidder1, proposalId, 1, 'i support', clientId1);

        // cast 1 votes
        assertEq(nounsToken.getCurrentVotes(bidder2), 2);
        vote(bidder2, proposalId, 1, 'i support', clientId2);

        mineBlocks(VOTING_PERIOD);

        settleAuction();
        votingClientIds = [clientId1, clientId2];
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });

        assertEq(rewards.clientBalance(clientId1), 0.06 ether); // 15 eth * 0.5% * (8/10)
        assertEq(rewards.clientBalance(clientId2), 0.015 ether); // 15 eth * 0.5% * (2/10)
    }

    function test_revertsIfNotAllVotesAreAccounted() public {
        vote(bidder1, proposalId, 1, 'i support', clientId1);
        vote(bidder2, proposalId, 1, 'i support', clientId2);
        // vote with no clientId means clientId == 0
        vote(makeAddr('noundersDAO'), proposalId, 0, 'against');

        mineBlocks(VOTING_PERIOD);

        votingClientIds = [clientId1, clientId2];
        vm.expectRevert('not all votes accounted');
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });

        votingClientIds = [0, clientId2];
        vm.expectRevert('not all votes accounted');
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });

        votingClientIds = [0, clientId1, clientId2];
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: proposalId,
            votingClientIds: votingClientIds
        });
    }
}
