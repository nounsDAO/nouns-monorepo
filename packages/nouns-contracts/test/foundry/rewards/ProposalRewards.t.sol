// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { NounsDAOLogicV3BaseTest } from '../NounsDAOLogicV3/NounsDAOLogicV3BaseTest.sol';
import { ERC20Mock } from '../helpers/ERC20Mock.sol';
import { Rewards } from '../../../contracts/Rewards.sol';
import { INounsAuctionHouseV2 } from '../../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { AuctionHouseUpgrader } from '../helpers/AuctionHouseUpgrader.sol';
import { NounsAuctionHouseProxy } from '../../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { console } from 'hardhat/console.sol';

contract ProposalRewardsTest is NounsDAOLogicV3BaseTest {
    Rewards rewards;
    ERC20Mock erc20Mock = new ERC20Mock();
    INounsAuctionHouseV2 auctionHouse;

    address bidder1 = makeAddr('bidder1');
    address client1Wallet = makeAddr('client1Wallet');
    uint32 clientId1;
    uint32[] votingClientIds;
    uint256 firstNounId;

    uint256 constant SECONDS_IN_BLOCK = 12;

    function setUp() public virtual override {
        _setUpDAO();

        vm.deal(bidder1, 100 ether);

        // need at least one settled auction
        firstNounId = bidAndSettleAuction({ bidAmount: 1 ether });
        mineBlocks(1);

        rewards = new Rewards({
            nounsDAO_: address(dao),
            auctionHouse_: minter,
            nextProposalIdToReward_: 1,
            lastProcessedAuctionId_: 1,
            ethToken_: address(erc20Mock),
            nextProposalRewardFirstAuctionId_: auctionHouse.auction().nounId,
            rewardParams: Rewards.RewardParams({
                minimumRewardPeriod: 2 weeks,
                numProposalsEnoughForReward: 30,
                proposalRewardBps: 100,
                votingRewardBps: 50,
                auctionRewardBps: 150,
                proposalEligibilityQuorumBps: 1000
            })
        });

        vm.prank(client1Wallet);
        clientId1 = rewards.registerClient();
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

    function test_rewardsAfterMinimumRewardPeriod() public {
        uint256 startTimestamp = block.timestamp;

        bidAndSettleAuction({ bidAmount: 5 ether });
        bidAndSettleAuction({ bidAmount: 10 ether });

        vm.warp(startTimestamp + 2 weeks);

        uint256 proposalId = propose(bidder1, address(1), 1 ether, '', '', 'my proposal', clientId1);
        mineBlocks(VOTING_DELAY + UPDATABLE_PERIOD_BLOCKS + 1);
        vote(bidder1, proposalId, 1, 'i support');
        mineBlocks(VOTING_PERIOD);

        uint256 lastNounId = settleAuction();

        votingClientIds = [0];
        rewards.updateRewardsForProposalWritingAndVoting({
            lastProposalId: uint32(proposalId),
            lastAuctionedNounId: lastNounId,
            expectedNumEligibleProposals: 1,
            expectedNumEligibleVotes: 3,
            votingClientIds: votingClientIds
        });

        assertEq(rewards.clientBalances(clientId1), 0.15 ether); // 15 eth * 1%
    }

    //////////////////////
    // internal functions
    //////////////////////

    function bidAndSettleAuction(uint256 bidAmount) internal returns (uint256) {
        uint256 nounId = auctionHouse.auction().nounId;

        vm.prank(bidder1);
        auctionHouse.createBid{ value: bidAmount }(nounId);

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
}
