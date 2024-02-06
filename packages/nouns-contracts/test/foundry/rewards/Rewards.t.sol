// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { NounsDAOLogicV3BaseTest } from '../NounsDAOLogicV3/NounsDAOLogicV3BaseTest.sol';
import { Rewards } from '../../../contracts/Rewards.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { INounsAuctionHouseV2 } from '../../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { AuctionHouseUpgrader } from '../helpers/AuctionHouseUpgrader.sol';
import { NounsAuctionHouseProxy } from '../../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { ERC20Mock } from '../helpers/ERC20Mock.sol';
import { RewardsDeployer } from '../helpers/RewardsDeployer.sol';

abstract contract RewardsBaseTest is NounsDAOLogicV3BaseTest {
    Rewards rewards;
    INounsAuctionHouseV2 auctionHouse;

    address admin = makeAddr('admin');
    address client1Wallet = makeAddr('client1Wallet');
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

        rewards = RewardsDeployer.deployRewards(
            dao,
            admin,
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
                proposalEligibilityQuorumBps: 1000,
                minimumAuctionsBetweenUpdates: 0
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

        rewards.registerClient('some client', 'some client description');
        vm.prank(client1Wallet);
        CLIENT_ID = rewards.registerClient('client1', 'client1 description');
        rewards.registerClient('some client', 'some client description');
        CLIENT_ID2 = rewards.registerClient('client2', 'client2 description');

        erc20Mock.mint(address(rewards), 100 ether);
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

        vm.prank(client1Wallet);
        rewards.withdrawClientBalance(CLIENT_ID, 0.05 ether, client1Wallet);
        assertEq(erc20Mock.balanceOf(client1Wallet), 0.05 ether);
    }

    function test_emitsClientRewardedEvent() public {
        vm.expectEmit();
        emit Rewards.ClientRewarded(CLIENT_ID, 0.05 ether);
        vm.expectEmit();
        emit Rewards.ClientRewarded(CLIENT_ID2, 0.02 ether);
        rewards.updateRewardsForAuctions(nounId);
    }

    function test_requiresMinimumNumberOfAuctionsToPass() public {
        rewards.updateRewardsForAuctions(nounId);

        Rewards.RewardParams memory params = rewards.getParams();
        params.minimumAuctionsBetweenUpdates = 5;
        vm.prank(address(dao.timelock()));
        rewards.setParams(params);

        bidAndSettleAuction(1 ether, CLIENT_ID);
        bidAndSettleAuction(1 ether, CLIENT_ID);
        bidAndSettleAuction(1 ether, CLIENT_ID);
        nounId = bidAndSettleAuction(1 ether, CLIENT_ID);

        vm.expectRevert('lastNounId must be higher');
        rewards.updateRewardsForAuctions(nounId);

        bidAndSettleAuction(1 ether, CLIENT_ID);
        nounId = bidAndSettleAuction(1 ether, CLIENT_ID);
        rewards.updateRewardsForAuctions(nounId);
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

    function test_refundsGas() public {
        for (uint256 i; i < 100; ++i) {
            nounId = bidAndSettleAuction(1 ether, CLIENT_ID);
        }

        uint256 startGas = gasleft();

        vm.fee(100 gwei);
        vm.txGasPrice(100 gwei);
        vm.prank(makeAddr('caller'), makeAddr('caller tx.origin'));
        rewards.updateRewardsForAuctions(nounId);

        uint256 gasUsed = startGas - gasleft();
        uint256 approxEthRefunded = (gasUsed + 36000) * 100 gwei;

        assertApproxEqAbs(erc20Mock.balanceOf(makeAddr('caller tx.origin')), approxEthRefunded, 0.01 ether);
    }

    function test_doesntRefundGasIfOnlyZeroClientIds() public {
        // reset state
        rewards.updateRewardsForAuctions(nounId);

        for (uint256 i; i < 100; ++i) {
            nounId = bidAndSettleAuction(1 ether, 0);
        }

        vm.fee(100 gwei);
        vm.txGasPrice(100 gwei);
        vm.prank(makeAddr('caller'), makeAddr('caller tx.origin'));
        rewards.updateRewardsForAuctions(nounId);

        assertEq(erc20Mock.balanceOf(makeAddr('caller tx.origin')), 0);
    }

    function test_refundsGas_givenFailedTokenTransfer_reverts() public {
        for (uint256 i; i < 100; ++i) {
            nounId = bidAndSettleAuction(1 ether, CLIENT_ID);
        }

        erc20Mock.setFailNextTransfer(true);

        vm.expectRevert('SafeERC20: ERC20 operation did not succeed');
        rewards.updateRewardsForAuctions(nounId);
    }

    function test_withdrawClientBalance_givenFailedTokenTransfer_reverts() public {
        rewards.updateRewardsForAuctions(nounId);

        erc20Mock.setFailNextTransfer(true);

        vm.prank(client1Wallet);
        vm.expectRevert('SafeERC20: ERC20 operation did not succeed');
        rewards.withdrawClientBalance(CLIENT_ID, 0.05 ether, client1Wallet);
    }
}

contract RewardsUpgradeTest is RewardsBaseTest {
    function test_upgrade_worksForOwner() public {
        Rewards newLogic = new Rewards(address(dao), minter);

        vm.prank(rewards.owner());
        rewards.upgradeTo(address(newLogic));

        assertEq(get1967Implementation(address(rewards)), address(newLogic));
    }

    function test_upgrade_revertsForNonOwner() public {
        Rewards newLogic = new Rewards(address(dao), minter);

        vm.prank(makeAddr('nonOwner'));
        vm.expectRevert('Ownable: caller is not the owner');
        rewards.upgradeTo(address(newLogic));
    }
}

contract PausingTest is RewardsBaseTest {
    function test_pause_revertsForNonAdminNonOwner() public {
        vm.prank(makeAddr('non admin non owner'));
        vm.expectRevert('Caller must be owner or admin');
        rewards.pause();
    }

    function test_pause_worksForAdmin() public {
        vm.prank(admin);
        rewards.pause();

        assertTrue(rewards.paused());
    }

    function test_pause_worksForOwner() public {
        vm.prank(rewards.owner());
        rewards.pause();

        assertTrue(rewards.paused());
    }
}

contract PausedTest is RewardsBaseTest {
    function setUp() public override {
        super.setUp();

        vm.prank(admin);
        rewards.pause();
    }

    function test_registerClient_reverts() public {
        vm.expectRevert('Pausable: paused');
        rewards.registerClient('some client', 'some description');
    }

    function test_updateRewardsForAuctions_reverts() public {
        vm.expectRevert('Pausable: paused');
        rewards.updateRewardsForAuctions(1);
    }

    function test_updateRewardsForProposalWritingAndVoting_reverts() public {
        vm.expectRevert('Pausable: paused');
        rewards.updateRewardsForProposalWritingAndVoting(1, new uint32[](0));
    }

    function test_withdrawClientBalance_reverts() public {
        vm.expectRevert('Pausable: paused');
        rewards.withdrawClientBalance(1, 1, makeAddr('to'));
    }
}

contract OwnerFunctionsTest is RewardsBaseTest {
    function test_setParams_revertsForNonOwner() public {
        Rewards.RewardParams memory params = rewards.getParams();

        vm.prank(makeAddr('non owner'));
        vm.expectRevert('Ownable: caller is not the owner');
        rewards.setParams(params);
    }

    function test_setAdmin_revertsForNonOwner() public {
        vm.prank(makeAddr('non owner'));
        vm.expectRevert('Ownable: caller is not the owner');
        rewards.setAdmin(makeAddr('new admin'));
    }

    function test_setAdmin_worksForOwner() public {
        address newAdmin = makeAddr('new admin');

        vm.prank(rewards.owner());
        rewards.setAdmin(newAdmin);

        assertEq(rewards.admin(), newAdmin);
    }

    function test_setETHToken_revertsForNonOwner() public {
        vm.prank(makeAddr('non owner'));
        vm.expectRevert('Ownable: caller is not the owner');
        rewards.setETHToken(makeAddr('new token'));
    }

    function test_setETHToken_worksForOwner() public {
        address newToken = makeAddr('new token');

        vm.prank(rewards.owner());
        rewards.setETHToken(newToken);

        assertEq(address(rewards.ethToken()), newToken);
    }

    function test_withdrawToken_revertsForNonOwner() public {
        address recipient = makeAddr('recipient');
        address token = address(rewards.ethToken());

        vm.expectRevert('Ownable: caller is not the owner');
        vm.prank(makeAddr('non owner'));
        rewards.withdrawToken(token, recipient, 1);
    }

    function test_withdrawToken_worksForOwner() public {
        address recipient = makeAddr('recipient');
        address token = address(rewards.ethToken());

        vm.prank(rewards.owner());
        rewards.withdrawToken(token, recipient, 1);

        assertEq(rewards.ethToken().balanceOf(recipient), 1);
    }
}
