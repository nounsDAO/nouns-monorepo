// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { NounsDAOLogicV3BaseTest } from '../NounsDAOLogicV3/NounsDAOLogicV3BaseTest.sol';
import { Rewards } from '../../../contracts/Rewards.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { INounsAuctionHouseV2 } from '../../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { AuctionHouseUpgrader } from '../helpers/AuctionHouseUpgrader.sol';
import { NounsAuctionHouseProxy } from '../../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { ERC20Mock } from '../helpers/ERC20Mock.sol';
import { RewardsProxy } from '../../../contracts/client-incentives/RewardsProxy.sol';

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

    ERC20Mock erc20Mock = new ERC20Mock();

    uint32 CLIENT_ID;
    uint32 CLIENT_ID2;

    uint256 constant SECONDS_IN_BLOCK = 12;

    uint32[] clientIds;

    function setUp() public virtual override {
        dao = _deployDAOV3WithParams(24 hours);
        nounsToken = NounsToken(address(dao.nouns()));
        minter = nounsToken.minter();

        auctionHouse = INounsAuctionHouseV2(minter);
        vm.prank(address(dao.timelock()));
        auctionHouse.unpause();

        rewards = _deployRewards(
            dao,
            minter,
            address(erc20Mock),
            uint32(dao.proposalCount()) + 1,
            1,
            auctionHouse.auction().nounId,
            Rewards.RewardParams({
                minimumRewardPeriod: 2 weeks,
                numProposalsEnoughForReward: 30,
                proposalRewardBps: 100,
                votingRewardBps: 50,
                auctionRewardBps: 100,
                proposalEligibilityQuorumBps: 1000
            })
        );

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

        rewards.registerClient('client', 'description');
        CLIENT_ID = rewards.registerClient('client1', 'description1');
        rewards.registerClient('client3', 'description3');
        CLIENT_ID2 = rewards.registerClient('client2', 'description2');
    }

    function _mintTo(address to) internal returns (uint256 tokenID) {
        vm.startPrank(minter);
        tokenID = nounsToken.mint();
        nounsToken.transferFrom(minter, to, tokenID);
        vm.stopPrank();
        vm.roll(block.number + 1);
    }

    function bidAndSettleAuction(uint256 bidAmount) internal returns (uint256) {
        return bidAndSettleAuction(bidAmount, 0);
    }

    function bidAndSettleAuction(uint256 bidAmount, uint32 clientId) internal returns (uint256) {
        uint256 nounId = auctionHouse.auction().nounId;

        vm.prank(bidder1);
        auctionHouse.createBid{ value: bidAmount }(nounId, clientId);

        uint256 blocksToEnd = (auctionHouse.auction().endTime - block.timestamp) / SECONDS_IN_BLOCK + 1;
        mineBlocks(blocksToEnd);
        auctionHouse.settleCurrentAndCreateNewAuction();

        return nounId;
    }

    function mineBlocks(uint256 numBlocks) internal {
        vm.roll(block.number + numBlocks);
        vm.warp(block.timestamp + numBlocks * SECONDS_IN_BLOCK);
    }
}

contract AuctionRewards is RewardsBaseTest {
    uint256 nounId;

    function setUp() public virtual override {
        super.setUp();

        bidAndSettleAuction(1 ether, CLIENT_ID);
        bidAndSettleAuction(2 ether, CLIENT_ID2);
        bidAndSettleAuction(3 ether, 0);
        nounId = bidAndSettleAuction(4 ether, CLIENT_ID);
    }

    function test_rewardsForAuctions() public {
        rewards.updateRewardsForAuctions(nounId);

        assertEq(rewards.clientBalance(CLIENT_ID), 0.05 ether);
        assertEq(rewards.clientBalance(CLIENT_ID2), 0.02 ether);
    }

    function test_revertsIfAlreadyProcessedNounId() public {
        rewards.updateRewardsForAuctions(nounId);

        vm.expectRevert('lastNounId must be higher');
        rewards.updateRewardsForAuctions(nounId);
    }

    function test_followupCallWorksCorrectly() public {
        rewards.updateRewardsForAuctions(nounId);

        assertEq(rewards.clientBalance(CLIENT_ID), 0.05 ether);
        assertEq(rewards.clientBalance(CLIENT_ID2), 0.02 ether);

        bidAndSettleAuction(10 ether, CLIENT_ID);
        nounId = bidAndSettleAuction(20 ether, CLIENT_ID2);

        rewards.updateRewardsForAuctions(nounId);

        assertEq(rewards.clientBalance(CLIENT_ID), 0.15 ether);
        assertEq(rewards.clientBalance(CLIENT_ID2), 0.22 ether);
    }

    function test_canProcessLastNounOnAuctionIfAuctionPausedAndSettled() public {
        uint256 blocksToEnd = (auctionHouse.auction().endTime - block.timestamp) / SECONDS_IN_BLOCK + 1;
        mineBlocks(blocksToEnd);
        vm.prank(address(dao.timelock()));
        auctionHouse.pause();
        auctionHouse.settleAuction();

        rewards.updateRewardsForAuctions(nounId + 1);
    }

    function test_nounIdMustBeSettled() public {
        vm.expectRevert('lastNounId must be settled');
        rewards.updateRewardsForAuctions(nounId + 1);
    }
}
