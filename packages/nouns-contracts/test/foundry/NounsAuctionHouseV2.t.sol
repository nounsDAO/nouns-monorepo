// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { NounsAuctionHouseProxy } from '../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';
import { NounsAuctionHouse } from '../../contracts/NounsAuctionHouse.sol';
import { INounsAuctionHouse } from '../../contracts/interfaces/INounsAuctionHouse.sol';
import { NounsAuctionHouseV2 } from '../../contracts/NounsAuctionHouseV2.sol';
import { NounsAuctionHousePreV2Migration } from '../../contracts/NounsAuctionHousePreV2Migration.sol';
import { Noracle } from '../../contracts/libs/Noracle.sol';
import { BidderWithGasGriefing } from './helpers/BidderWithGasGriefing.sol';

contract NounsAuctionHouseV2Test is Test, DeployUtils {
    event PriceHistoryGrown(uint32 current, uint32 next);

    address owner = address(0x1111);
    address noundersDAO = address(0x2222);
    address minter = address(0x3333);

    NounsAuctionHouseV2 auction;

    function setUp() public {
        (NounsAuctionHouseProxy auctionProxy, NounsAuctionHouseProxyAdmin proxyAdmin) = _deployAuctionHouseV1AndToken(
            owner,
            noundersDAO,
            minter
        );

        _upgradeAuctionHouse(owner, proxyAdmin, auctionProxy);

        auction = NounsAuctionHouseV2(address(auctionProxy));

        vm.prank(owner);
        auction.unpause();
        vm.roll(block.number + 1);
    }

    function test_createBid_revertsGivenWrongNounId() public {
        (uint128 nounId, , , , , ) = auction.auction();

        vm.expectRevert(abi.encodeWithSelector(INounsAuctionHouse.NounNotUpForAuction.selector));
        auction.createBid(nounId - 1);

        vm.expectRevert(abi.encodeWithSelector(INounsAuctionHouse.NounNotUpForAuction.selector));
        auction.createBid(nounId + 1);
    }

    function test_createBid_revertsPastEndTime() public {
        (uint128 nounId, , , uint40 endTime, , ) = auction.auction();
        vm.warp(endTime + 1);

        vm.expectRevert(abi.encodeWithSelector(INounsAuctionHouse.AuctionExpired.selector));
        auction.createBid(nounId);
    }

    function test_createBid_revertsGivenBidBelowReservePrice() public {
        vm.prank(owner);
        auction.setReservePrice(1 ether);

        (uint128 nounId, , , , , ) = auction.auction();

        vm.expectRevert(abi.encodeWithSelector(INounsAuctionHouse.MustSendAtLeastReservePrice.selector));
        auction.createBid{ value: 0.9 ether }(nounId);
    }

    function test_createBid_revertsGivenBidLowerThanMinIncrement() public {
        vm.prank(owner);
        auction.setMinBidIncrementPercentage(50);
        (uint128 nounId, , , , , ) = auction.auction();
        auction.createBid{ value: 1 ether }(nounId);

        vm.expectRevert(
            abi.encodeWithSelector(INounsAuctionHouse.BidDifferenceMustBeGreaterThanMinBidIncrement.selector)
        );
        auction.createBid{ value: 1.49 ether }(nounId);
    }

    function test_createBid_refundsPreviousBidder() public {
        (uint256 nounId, , , , , ) = auction.auction();
        address bidder1 = address(0x4444);
        address bidder2 = address(0x5555);

        vm.deal(bidder1, 1.1 ether);
        vm.prank(bidder1);
        auction.createBid{ value: 1.1 ether }(nounId);

        assertEq(bidder1.balance, 0);

        vm.deal(bidder2, 2.2 ether);
        vm.prank(bidder2);
        auction.createBid{ value: 2.2 ether }(nounId);

        assertEq(bidder1.balance, 1.1 ether);
        assertEq(bidder2.balance, 0);
    }

    function test_createBid_preventsGasGriefingUponRefunding() public {
        BidderWithGasGriefing badBidder = new BidderWithGasGriefing();
        (uint256 nounId, , , , , ) = auction.auction();

        badBidder.bid{ value: 1 ether }(auction, nounId);

        address bidder = address(0x4444);
        vm.deal(bidder, 1.2 ether);
        vm.prank(bidder);
        uint256 gasBefore = gasleft();
        auction.createBid{ value: 1.2 ether }(nounId);
        uint256 gasDiffWithGriefing = gasBefore - gasleft();

        address bidder2 = address(0x5555);
        vm.deal(bidder2, 2.2 ether);
        vm.prank(bidder2);
        gasBefore = gasleft();
        auction.createBid{ value: 2.2 ether }(nounId);
        uint256 gasDiffNoGriefing = gasBefore - gasleft();

        // Before the transfer with assembly fix this diff was greater
        // closer to 50K
        assertLt(gasDiffWithGriefing - gasDiffNoGriefing, 10_000);
    }

    function test_settleAuction_revertsWhenAuctionInProgress() public {
        vm.expectRevert(abi.encodeWithSelector(INounsAuctionHouse.AuctionNotDone.selector));
        auction.settleCurrentAndCreateNewAuction();
    }

    function test_settleAuction_revertsWhenSettled() public {
        (, , , uint40 endTime, , ) = auction.auction();
        vm.warp(endTime + 1);

        vm.prank(owner);
        auction.pause();
        auction.settleAuction();

        vm.expectRevert(abi.encodeWithSelector(INounsAuctionHouse.AuctionAlreadySettled.selector));
        auction.settleAuction();
    }

    function test_settleAuction_revertsWhenAuctionHasntBegunYet() public {
        (NounsAuctionHouseProxy auctionProxy, NounsAuctionHouseProxyAdmin proxyAdmin) = _deployAuctionHouseV1AndToken(
            owner,
            noundersDAO,
            minter
        );
        _upgradeAuctionHouse(owner, proxyAdmin, auctionProxy);
        auction = NounsAuctionHouseV2(address(auctionProxy));

        vm.expectRevert(abi.encodeWithSelector(INounsAuctionHouse.AuctionHasntBegun.selector));
        auction.settleAuction();
    }

    function test_V2Migration_works() public {
        (NounsAuctionHouseProxy auctionProxy, NounsAuctionHouseProxyAdmin proxyAdmin) = _deployAuctionHouseV1AndToken(
            owner,
            noundersDAO,
            minter
        );
        NounsAuctionHouse auctionV1 = NounsAuctionHouse(address(auctionProxy));
        vm.prank(owner);
        auctionV1.unpause();
        vm.roll(block.number + 1);
        (uint256 nounId, , uint256 startTime, uint256 endTime, , ) = auctionV1.auction();

        address payable bidder = payable(address(0x142));
        uint256 amount = 142 ether;
        vm.deal(bidder, amount);
        vm.prank(bidder);
        auctionV1.createBid{ value: amount }(nounId);

        _upgradeAuctionHouse(owner, proxyAdmin, auctionProxy);

        NounsAuctionHouseV2 auctionV2 = NounsAuctionHouseV2(address(auctionProxy));
        (
            uint128 nounIdV2,
            uint128 amountV2,
            uint40 startTimeV2,
            uint40 endTimeV2,
            address payable bidderV2,
            bool settledV2
        ) = auctionV2.auction();

        assertEq(nounIdV2, nounId);
        assertEq(amountV2, amount);
        assertEq(startTimeV2, startTime);
        assertEq(endTimeV2, endTime);
        assertEq(bidderV2, bidder);
        assertEq(settledV2, false);
    }

    function bidAndWinCurrentAuction(address bidder, uint256 bid) internal returns (uint256) {
        (uint256 nounId, , , uint256 endTime, , ) = auction.auction();
        vm.deal(bidder, bid);
        vm.prank(bidder);
        auction.createBid{ value: bid }(nounId);
        vm.warp(endTime);
        auction.settleCurrentAndCreateNewAuction();
        return block.timestamp;
    }
}

contract NounsAuctionHouseV2_OracleTest is NounsAuctionHouseV2Test {
    function test_prices_worksWithOneAuction() public {
        address bidder = address(0x4444);
        bidAndWinCurrentAuction(bidder, 1 ether);

        Noracle.Observation[] memory prices = auction.prices(1);

        assertEq(prices[0].blockTimestamp, uint32(block.timestamp));
        assertEq(prices[0].nounId, 1);
        assertEq(prices[0].amount, 1e8);
        assertEq(prices[0].winner, bidder);
    }

    function test_prices_worksWithThreeAuctions() public {
        vm.prank(owner);
        auction.growPriceHistory(3);

        address bidder1 = address(0x4444);
        address bidder2 = address(0x5555);
        address bidder3 = address(0x6666);
        uint256 bid1Time = bidAndWinCurrentAuction(bidder1, 1.1 ether);
        uint256 bid2Time = bidAndWinCurrentAuction(bidder2, 2.2 ether);
        uint256 bid3Time = bidAndWinCurrentAuction(bidder3, 3.3 ether);

        Noracle.Observation[] memory prices = auction.prices(3);
        assertEq(prices.length, 3);

        assertEq(prices[0].blockTimestamp, uint32(bid3Time));
        assertEq(prices[0].nounId, 3);
        assertEq(prices[0].amount, 3.3e8);
        assertEq(prices[0].winner, bidder3);

        assertEq(prices[1].blockTimestamp, uint32(bid2Time));
        assertEq(prices[1].nounId, 2);
        assertEq(prices[1].amount, 2.2e8);
        assertEq(prices[1].winner, bidder2);

        assertEq(prices[2].blockTimestamp, uint32(bid1Time));
        assertEq(prices[2].nounId, 1);
        assertEq(prices[2].amount, 1.1e8);
        assertEq(prices[2].winner, bidder1);
    }

    function test_prices_worksWithHigherCardinality() public {
        address bidder1 = address(0x4444);
        uint256 bid1Time = bidAndWinCurrentAuction(bidder1, 1 ether);

        vm.prank(owner);
        auction.growPriceHistory(1_000);

        address bidder2 = address(0x5555);
        uint256 bid2Time = bidAndWinCurrentAuction(bidder2, 2 ether);

        (, uint32 cardinality, ) = auction.oracle();
        assertEq(cardinality, 1_000);

        Noracle.Observation[] memory prices = auction.prices(2);

        assertEq(prices[0].blockTimestamp, uint32(bid2Time));
        assertEq(prices[0].nounId, 2);
        assertEq(prices[0].amount, 2e8);
        assertEq(prices[0].winner, bidder2);

        assertEq(prices[1].blockTimestamp, uint32(bid1Time));
        assertEq(prices[1].nounId, 1);
        assertEq(prices[1].amount, 1e8);
        assertEq(prices[1].winner, bidder1);
    }

    function test_prices_dropsEarlierBidsWithLowerCardinality() public {
        vm.prank(owner);
        auction.growPriceHistory(2);

        address bidder1 = address(0x4444);
        address bidder2 = address(0x5555);
        address bidder3 = address(0x6666);
        bidAndWinCurrentAuction(bidder1, 1.1 ether);
        uint256 bid2Time = bidAndWinCurrentAuction(bidder2, 2.2 ether);
        uint256 bid3Time = bidAndWinCurrentAuction(bidder3, 3.3 ether);

        Noracle.Observation[] memory prices = auction.prices(2);
        assertEq(prices.length, 2);

        assertEq(prices[0].blockTimestamp, uint32(bid3Time));
        assertEq(prices[0].nounId, 3);
        assertEq(prices[0].amount, 3.3e8);
        assertEq(prices[0].winner, bidder3);

        assertEq(prices[1].blockTimestamp, uint32(bid2Time));
        assertEq(prices[1].nounId, 2);
        assertEq(prices[1].amount, 2.2e8);
        assertEq(prices[1].winner, bidder2);
    }

    function test_growPriceHistory_emitsEvent() public {
        vm.expectEmit(true, true, true, true);
        emit PriceHistoryGrown(1, 3);
        vm.prank(owner);
        auction.growPriceHistory(3);

        vm.expectEmit(true, true, true, true);
        emit PriceHistoryGrown(3, 5);
        vm.prank(owner);
        auction.growPriceHistory(5);

        vm.expectEmit(true, true, true, true);
        emit PriceHistoryGrown(5, 5);
        vm.prank(owner);
        auction.growPriceHistory(5);
    }
}
