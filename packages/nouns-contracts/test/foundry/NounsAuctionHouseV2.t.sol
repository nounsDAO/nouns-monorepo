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
import { BidderWithGasGriefing } from './helpers/BidderWithGasGriefing.sol';

contract NounsAuctionHouseV2TestBase is Test, DeployUtils {
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

    function bidAndWinCurrentAuction(address bidder, uint256 bid) internal returns (uint256) {
        (uint256 nounId, , , uint256 endTime, , ) = auction.auction();
        vm.deal(bidder, bid);
        vm.prank(bidder);
        auction.createBid{ value: bid }(nounId);
        vm.warp(endTime);
        auction.settleCurrentAndCreateNewAuction();
        return block.timestamp;
    }

    function bidDontCreateNewAuction(address bidder, uint256 bid) internal returns (uint256) {
        (uint256 nounId, , , uint256 endTime, , ) = auction.auction();
        vm.deal(bidder, bid);
        vm.prank(bidder);
        auction.createBid{ value: bid }(nounId);
        vm.warp(endTime);
        return block.timestamp;
    }
}

contract NounsAuctionHouseV2Test is NounsAuctionHouseV2TestBase {
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

    function test_auctionGetter_compatibleWithV1() public {
        address bidder = address(0x4242);
        vm.deal(bidder, 1.1 ether);
        vm.prank(bidder);
        auction.createBid{ value: 1.1 ether }(1);

        NounsAuctionHouse auctionV1 = NounsAuctionHouse(address(auction));

        (
            uint128 nounIdV2,
            uint128 amountV2,
            uint40 startTimeV2,
            uint40 endTimeV2,
            address payable bidderV2,
            bool settledV2
        ) = auction.auction();

        (
            uint256 nounIdV1,
            uint256 amountV1,
            uint256 startTimeV1,
            uint256 endTimeV1,
            address payable bidderV1,
            bool settledV1
        ) = auctionV1.auction();

        assertEq(nounIdV2, nounIdV1);
        assertEq(amountV2, amountV1);
        assertEq(startTimeV2, startTimeV1);
        assertEq(endTimeV2, endTimeV1);
        assertEq(bidderV2, bidderV1);
        assertEq(settledV2, settledV1);
    }
}

contract NounsAuctionHouseV2_OracleTest is NounsAuctionHouseV2TestBase {
    function test_prices_oneAuction_higherAuctionCountReturnsTheOneAuction() public {
        address bidder = address(0x4444);
        bidAndWinCurrentAuction(bidder, 1 ether);

        INounsAuctionHouse.Settlement[] memory prices = auction.prices(2);

        assertEq(prices.length, 1);
        assertEq(prices[0].blockTimestamp, uint32(block.timestamp));
        assertEq(prices[0].nounId, 1);
        assertEq(prices[0].amount, 1e10);
        assertEq(prices[0].winner, bidder);
    }

    function test_prices_preserves10DecimalsUnderUint64MaxValue() public {
        // amount is uint64; maxValue - 1 = 18446744073709551615
        // at 10 decimal points it's 1844674407.3709551615
        bidAndWinCurrentAuction(makeAddr('bidder'), 1844674407.3709551615999999 ether);

        INounsAuctionHouse.Settlement[] memory prices = auction.prices(1);

        assertEq(prices.length, 1);
        assertEq(prices[0].nounId, 1);
        assertEq(prices[0].amount, 18446744073709551615);
        assertEq(prices[0].winner, makeAddr('bidder'));
    }

    function test_prices_overflowsGracefullyOverUint64MaxValue() public {
        bidAndWinCurrentAuction(makeAddr('bidder'), 1844674407.3709551617 ether);

        INounsAuctionHouse.Settlement[] memory prices = auction.prices(1);

        assertEq(prices.length, 1);
        assertEq(prices[0].nounId, 1);
        assertEq(prices[0].amount, 1);
        assertEq(prices[0].winner, makeAddr('bidder'));
    }

    function test_prices_20Auctions_skipsNounerNounsAsExpected() public {
        for (uint256 i = 1; i <= 20; ++i) {
            address bidder = makeAddr(vm.toString(i));
            bidAndWinCurrentAuction(bidder, i * 1e18);
        }

        INounsAuctionHouse.Settlement[] memory prices = auction.prices(20);
        assertEq(prices[0].nounId, 22);
        assertEq(prices[1].nounId, 21);
        assertEq(prices[2].nounId, 19);
        assertEq(prices[10].nounId, 11);
        assertEq(prices[11].nounId, 9);
        assertEq(prices[19].nounId, 1);

        assertEq(prices[0].amount, 20e10);
        assertEq(prices[1].amount, 19e10);
        assertEq(prices[2].amount, 18e10);
        assertEq(prices[10].amount, 10e10);
        assertEq(prices[11].amount, 9e10);
        assertEq(prices[19].amount, 1e10);
    }

    function test_prices_2AuctionsNoNewAuction_includesSettledNoun() public {
        uint256 bid1Timestamp = bidAndWinCurrentAuction(makeAddr('bidder'), 1 ether);
        uint256 bid2Timestamp = bidDontCreateNewAuction(makeAddr('bidder 2'), 2 ether);

        vm.prank(auction.owner());
        auction.pause();
        auction.settleAuction();

        INounsAuctionHouse.Settlement[] memory prices = auction.prices(2);

        assertEq(prices.length, 2);
        assertEq(prices[0].blockTimestamp, uint32(bid2Timestamp));
        assertEq(prices[0].nounId, 2);
        assertEq(prices[0].amount, 2e10);
        assertEq(prices[0].winner, makeAddr('bidder 2'));
        assertEq(prices[1].blockTimestamp, uint32(bid1Timestamp));
        assertEq(prices[1].nounId, 1);
        assertEq(prices[1].amount, 1e10);
        assertEq(prices[1].winner, makeAddr('bidder'));
    }

    function test_prices_withRange_givenBiggerRangeThanAuctionsReturnsAuctionsAndZeroObservations() public {
        uint256 lastBidTime;
        for (uint256 i = 1; i <= 3; ++i) {
            address bidder = makeAddr(vm.toString(i));
            lastBidTime = bidAndWinCurrentAuction(bidder, i * 1e18);
        }

        INounsAuctionHouse.Settlement[] memory prices = auction.prices(4, 0);
        assertEq(prices.length, 4);
        assertEq(prices[0].blockTimestamp, 0);
        assertEq(prices[0].nounId, 4);
        assertEq(prices[0].amount, 0);
        assertEq(prices[0].winner, address(0));
        assertEq(prices[1].blockTimestamp, uint32(lastBidTime));
        assertEq(prices[1].nounId, 3);
        assertEq(prices[1].amount, 3e10);
        assertEq(prices[1].winner, makeAddr('3'));
        assertEq(prices[2].nounId, 2);
        assertEq(prices[2].amount, 2e10);
        assertEq(prices[2].winner, makeAddr('2'));
        assertEq(prices[3].nounId, 1);
        assertEq(prices[3].amount, 1e10);
        assertEq(prices[3].winner, makeAddr('1'));
    }

    function test_prices_withRange_givenSmallerRangeThanAuctionsReturnsAuctions() public {
        for (uint256 i = 1; i <= 20; ++i) {
            address bidder = makeAddr(vm.toString(i));
            bidAndWinCurrentAuction(bidder, i * 1e18);
        }

        INounsAuctionHouse.Settlement[] memory prices = auction.prices(11, 6);
        assertEq(prices.length, 4);
        assertEq(prices[0].nounId, 11);
        assertEq(prices[0].amount, 10e10);
        assertEq(prices[0].winner, makeAddr('10'));
        assertEq(prices[1].nounId, 9);
        assertEq(prices[1].amount, 9e10);
        assertEq(prices[1].winner, makeAddr('9'));
        assertEq(prices[2].nounId, 8);
        assertEq(prices[2].amount, 8e10);
        assertEq(prices[2].winner, makeAddr('8'));
        assertEq(prices[3].nounId, 7);
        assertEq(prices[3].amount, 7e10);
        assertEq(prices[3].winner, makeAddr('7'));
    }

    function test_setPrices_revertsForNonOwner() public {
        INounsAuctionHouse.Settlement[] memory observations = new INounsAuctionHouse.Settlement[](1);
        observations[0] = INounsAuctionHouse.Settlement({
            blockTimestamp: uint32(block.timestamp),
            amount: 42e10,
            winner: makeAddr('winner'),
            nounId: 3
        });

        vm.expectRevert('Ownable: caller is not the owner');
        auction.setPrices(observations);
    }

    function test_setPrices_worksForOwner() public {
        INounsAuctionHouse.Settlement[] memory observations = new INounsAuctionHouse.Settlement[](20);
        uint256 nounId = 0;
        for (uint256 i = 0; i < 20; ++i) {
            // skip Nouners
            if (nounId <= 1820 && nounId % 10 == 0) {
                nounId++;
            }

            observations[i] = INounsAuctionHouse.Settlement({
                blockTimestamp: uint32(nounId),
                amount: uint64(nounId * 1e10),
                winner: makeAddr(vm.toString(nounId)),
                nounId: nounId
            });

            nounId++;
        }

        vm.prank(auction.owner());
        auction.setPrices(observations);

        INounsAuctionHouse.Settlement[] memory actualObservations = auction.prices(22, 0);
        assertEq(actualObservations.length, 20);
        for (uint256 i = 0; i < 20; ++i) {
            uint256 actualIndex = 19 - i;
            assertEq(observations[i].blockTimestamp, actualObservations[actualIndex].blockTimestamp);
            assertEq(observations[i].amount, actualObservations[actualIndex].amount);
            assertEq(observations[i].winner, actualObservations[actualIndex].winner);
            assertEq(observations[i].nounId, actualObservations[actualIndex].nounId);
        }
    }
}
