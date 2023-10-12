// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { AuctionHouseUpgrader } from './helpers/AuctionHouseUpgrader.sol';
import { NounsAuctionHouseProxy } from '../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';
import { NounsAuctionHouse } from '../../contracts/NounsAuctionHouse.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { NounsAuctionHouseV2 } from '../../contracts/NounsAuctionHouseV2.sol';
import { BidderWithGasGriefing } from './helpers/BidderWithGasGriefing.sol';

contract NounsAuctionHouseV2TestBase is Test, DeployUtils {
    event HistoricPricesSet(uint256[] nounIds, uint256[] prices);

    address owner = address(0x1111);
    address noundersDAO = address(0x2222);
    address minter = address(0x3333);
    uint256[] nounIds;

    NounsAuctionHouseV2 auction;

    function setUp() public {
        (address auctionProxy, NounsAuctionHouseProxyAdmin proxyAdmin) = _deployAuctionHouseV1AndToken(
            owner,
            noundersDAO,
            minter
        );

        AuctionHouseUpgrader.upgradeAuctionHouse(owner, proxyAdmin, auctionProxy);

        auction = NounsAuctionHouseV2(auctionProxy);

        vm.prank(owner);
        auction.unpause();
        vm.roll(block.number + 1);
    }

    function bidAndWinCurrentAuction(address bidder, uint256 bid) internal returns (uint256) {
        uint128 nounId = auction.auction().nounId;
        uint40 endTime = auction.auction().endTime;
        vm.deal(bidder, bid);
        vm.prank(bidder);
        auction.createBid{ value: bid }(nounId);
        vm.warp(endTime);
        auction.settleCurrentAndCreateNewAuction();
        return block.timestamp;
    }

    function bidDontCreateNewAuction(address bidder, uint256 bid) internal returns (uint256) {
        uint128 nounId = auction.auction().nounId;
        uint40 endTime = auction.auction().endTime;
        vm.deal(bidder, bid);
        vm.prank(bidder);
        auction.createBid{ value: bid }(nounId);
        vm.warp(endTime);
        return block.timestamp;
    }
}

contract NounsAuctionHouseV2Test is NounsAuctionHouseV2TestBase {
    function test_createBid_revertsGivenWrongNounId() public {
        uint128 nounId = auction.auction().nounId;

        vm.expectRevert('Noun not up for auction');
        auction.createBid(nounId - 1);

        vm.expectRevert('Noun not up for auction');
        auction.createBid(nounId + 1);
    }

    function test_createBid_revertsPastEndTime() public {
        uint128 nounId = auction.auction().nounId;
        uint40 endTime = auction.auction().endTime;
        vm.warp(endTime + 1);

        vm.expectRevert('Auction expired');
        auction.createBid(nounId);
    }

    function test_createBid_revertsGivenBidBelowReservePrice() public {
        vm.prank(owner);
        auction.setReservePrice(1 ether);

        uint128 nounId = auction.auction().nounId;

        vm.expectRevert('Must send at least reservePrice');
        auction.createBid{ value: 0.9 ether }(nounId);
    }

    function test_createBid_revertsGivenBidLowerThanMinIncrement() public {
        vm.prank(owner);
        auction.setMinBidIncrementPercentage(50);
        uint128 nounId = auction.auction().nounId;
        auction.createBid{ value: 1 ether }(nounId);

        vm.expectRevert('Must send more than last bid by minBidIncrementPercentage amount');
        auction.createBid{ value: 1.49 ether }(nounId);
    }

    function test_createBid_refundsPreviousBidder() public {
        uint256 nounId = auction.auction().nounId;
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
        uint256 nounId = auction.auction().nounId;

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
        vm.expectRevert("Auction hasn't completed");
        auction.settleCurrentAndCreateNewAuction();
    }

    function test_settleAuction_revertsWhenSettled() public {
        uint40 endTime = auction.auction().endTime;
        vm.warp(endTime + 1);

        vm.prank(owner);
        auction.pause();
        auction.settleAuction();

        vm.expectRevert('Auction has already been settled');
        auction.settleAuction();
    }

    function test_settleAuction_revertsWhenAuctionHasntBegunYet() public {
        (address auctionProxy, NounsAuctionHouseProxyAdmin proxyAdmin) = _deployAuctionHouseV1AndToken(
            owner,
            noundersDAO,
            minter
        );
        AuctionHouseUpgrader.upgradeAuctionHouse(owner, proxyAdmin, auctionProxy);
        auction = NounsAuctionHouseV2(auctionProxy);

        vm.expectRevert("Auction hasn't begun");
        auction.settleAuction();
    }

    function test_settleCurrentAndCreateNewAuction_revertsWhenPaused() public {
        uint40 endTime = auction.auction().endTime;
        vm.warp(endTime + 1);

        vm.prank(owner);
        auction.pause();

        vm.expectRevert('Pausable: paused');
        auction.settleCurrentAndCreateNewAuction();
    }

    function test_V2Migration_works() public {
        (address auctionProxy, NounsAuctionHouseProxyAdmin proxyAdmin) = _deployAuctionHouseV1AndToken(
            owner,
            noundersDAO,
            minter
        );
        NounsAuctionHouse auctionV1 = NounsAuctionHouse(auctionProxy);
        vm.prank(owner);
        auctionV1.unpause();
        vm.roll(block.number + 1);
        (uint256 nounId, , uint256 startTime, uint256 endTime, , ) = auctionV1.auction();

        address payable bidder = payable(address(0x142));
        uint256 amount = 142 ether;
        vm.deal(bidder, amount);
        vm.prank(bidder);
        auctionV1.createBid{ value: amount }(nounId);

        address nounsBefore = address(auctionV1.nouns());
        address wethBefore = address(auctionV1.weth());

        AuctionHouseUpgrader.upgradeAuctionHouse(owner, proxyAdmin, auctionProxy);

        NounsAuctionHouseV2 auctionV2 = NounsAuctionHouseV2(auctionProxy);

        INounsAuctionHouseV2.AuctionV2 memory auctionV2State = auctionV2.auction();

        assertEq(auctionV2State.nounId, nounId);
        assertEq(auctionV2State.amount, amount);
        assertEq(auctionV2State.startTime, startTime);
        assertEq(auctionV2State.endTime, endTime);
        assertEq(auctionV2State.bidder, bidder);
        assertEq(auctionV2State.settled, false);

        assertEq(address(auctionV2.nouns()), nounsBefore);
        assertEq(address(auctionV2.weth()), wethBefore);
        assertEq(auctionV2.timeBuffer(), AUCTION_TIME_BUFFER);
        assertEq(auctionV2.reservePrice(), AUCTION_RESERVE_PRICE);
        assertEq(auctionV2.minBidIncrementPercentage(), AUCTION_MIN_BID_INCREMENT_PRCT);
        assertEq(auctionV2.duration(), AUCTION_DURATION);
        assertEq(auctionV2.paused(), false);
        assertEq(auctionV2.owner(), owner);
    }

    function test_V2Migration_copiesPausedWhenTrue() public {
        (address auctionProxy, NounsAuctionHouseProxyAdmin proxyAdmin) = _deployAuctionHouseV1AndToken(
            owner,
            noundersDAO,
            minter
        );
        NounsAuctionHouse auctionV1 = NounsAuctionHouse(auctionProxy);
        vm.prank(owner);
        auctionV1.unpause();
        vm.roll(block.number + 1);
        (uint256 nounId, , , , , ) = auctionV1.auction();

        address payable bidder = payable(address(0x142));
        uint256 amount = 142 ether;
        vm.deal(bidder, amount);
        vm.prank(bidder);
        auctionV1.createBid{ value: amount }(nounId);

        vm.prank(owner);
        auctionV1.pause();

        AuctionHouseUpgrader.upgradeAuctionHouse(owner, proxyAdmin, auctionProxy);

        NounsAuctionHouseV2 auctionV2 = NounsAuctionHouseV2(auctionProxy);
        assertEq(auctionV2.paused(), true);
    }

    function test_auctionGetter_compatibleWithV1() public {
        address bidder = address(0x4242);
        vm.deal(bidder, 1.1 ether);
        vm.prank(bidder);
        auction.createBid{ value: 1.1 ether }(1);

        NounsAuctionHouse auctionV1 = NounsAuctionHouse(address(auction));

        INounsAuctionHouseV2.AuctionV2 memory auctionV2 = auction.auction();

        (
            uint256 nounIdV1,
            uint256 amountV1,
            uint256 startTimeV1,
            uint256 endTimeV1,
            address payable bidderV1,
            bool settledV1
        ) = auctionV1.auction();

        assertEq(auctionV2.nounId, nounIdV1);
        assertEq(auctionV2.amount, amountV1);
        assertEq(auctionV2.startTime, startTimeV1);
        assertEq(auctionV2.endTime, endTimeV1);
        assertEq(auctionV2.bidder, bidderV1);
        assertEq(auctionV2.settled, settledV1);
    }
}

contract NounsAuctionHouseV2_OracleTest is NounsAuctionHouseV2TestBase {
    uint256[] expectedPrices;

    function test_prices_oneAuction_higherAuctionCountReturnsTheOneAuction() public {
        address bidder = address(0x4444);
        bidAndWinCurrentAuction(bidder, 1 ether);

        INounsAuctionHouseV2.Settlement[] memory settlements = auction.getSettlements(2);

        assertEq(settlements.length, 1);
        assertEq(settlements[0].blockTimestamp, uint32(block.timestamp));
        assertEq(settlements[0].nounId, 1);
        assertEq(settlements[0].amount, 1 ether);
        assertEq(settlements[0].winner, bidder);

        uint256[] memory prices = auction.getPrices(2);
        assertEq(prices.length, 1);
        assertEq(prices[0], 1 ether);
    }

    function test_prices_preserves10DecimalsUnderUint64MaxValue() public {
        // amount is uint64; maxValue - 1 = 18446744073709551615
        // at 10 decimal points it's 1844674407.3709551615
        bidAndWinCurrentAuction(makeAddr('bidder'), 1844674407.3709551615999999 ether);

        INounsAuctionHouseV2.Settlement[] memory settlements = auction.getSettlements(1);

        assertEq(settlements.length, 1);
        assertEq(settlements[0].nounId, 1);
        assertEq(settlements[0].amount, 1844674407.3709551615 ether);
        assertEq(settlements[0].winner, makeAddr('bidder'));

        uint256[] memory prices = auction.getPrices(1);
        assertEq(prices[0], 1844674407.3709551615 ether);
    }

    function test_prices_overflowsGracefullyOverUint64MaxValue() public {
        bidAndWinCurrentAuction(makeAddr('bidder'), 1844674407.3709551617 ether);

        INounsAuctionHouseV2.Settlement[] memory settlements = auction.getSettlements(1);

        assertEq(settlements.length, 1);
        assertEq(settlements[0].nounId, 1);
        assertEq(settlements[0].amount, 1 * 1e8);
        assertEq(settlements[0].winner, makeAddr('bidder'));

        uint256[] memory prices = auction.getPrices(1);
        assertEq(prices[0], 1 * 1e8);
    }

    function test_prices_20Auctions_skipsNounerNounsAsExpected() public {
        for (uint256 i = 1; i <= 20; ++i) {
            address bidder = makeAddr(vm.toString(i));
            bidAndWinCurrentAuction(bidder, i * 1e18);
        }

        INounsAuctionHouseV2.Settlement[] memory settlements = auction.getSettlements(20);
        assertEq(settlements[0].nounId, 22);
        assertEq(settlements[1].nounId, 21);
        assertEq(settlements[2].nounId, 19);
        assertEq(settlements[10].nounId, 11);
        assertEq(settlements[11].nounId, 9);
        assertEq(settlements[19].nounId, 1);

        assertEq(settlements[0].amount, 20 ether);
        assertEq(settlements[1].amount, 19 ether);
        assertEq(settlements[2].amount, 18 ether);
        assertEq(settlements[10].amount, 10 ether);
        assertEq(settlements[11].amount, 9 ether);
        assertEq(settlements[19].amount, 1 ether);

        uint256[] memory prices = auction.getPrices(20);
        // prettier-ignore
        expectedPrices = [20e18, 19e18, 18e18, 17e18, 16e18, 15e18, 14e18, 13e18, 12e18, 11e18, 
                          10e18, 9e18, 8e18, 7e18, 6e18, 5e18, 4e18, 3e18, 2e18, 1e18];
        assertEq(prices, expectedPrices);
    }

    function test_prices_skipsEmptySettlementsPostWarmUp() public {
        nounIds = [0, 1, 2, 10, 11, 20, 21];
        auction.warmUpSettlementState(nounIds);

        for (uint256 i = 1; i <= 20; ++i) {
            address bidder = makeAddr(vm.toString(i));
            bidAndWinCurrentAuction(bidder, i * 1e18);
        }

        INounsAuctionHouseV2.Settlement[] memory settlements = auction.getSettlements(20);
        assertEq(settlements[0].nounId, 22);
        assertEq(settlements[1].nounId, 21);
        assertEq(settlements[2].nounId, 19);
        assertEq(settlements[10].nounId, 11);
        assertEq(settlements[11].nounId, 9);
        assertEq(settlements[19].nounId, 1);

        uint256[] memory prices = auction.getPrices(20);
        // prettier-ignore
        expectedPrices = [20e18, 19e18, 18e18, 17e18, 16e18, 15e18, 14e18, 13e18, 12e18, 11e18, 
                          10e18, 9e18, 8e18, 7e18, 6e18, 5e18, 4e18, 3e18, 2e18, 1e18];
        assertEq(prices, expectedPrices);

        settlements = auction.getSettlements(20, 21);
        assertEq(settlements.length, 0);

        prices = auction.getPrices(20, 21);
        assertEq(prices.length, 0);
    }

    function test_prices_2AuctionsNoNewAuction_includesSettledNoun() public {
        uint256 bid1Timestamp = bidAndWinCurrentAuction(makeAddr('bidder'), 1 ether);
        uint256 bid2Timestamp = bidDontCreateNewAuction(makeAddr('bidder 2'), 2 ether);

        vm.prank(auction.owner());
        auction.pause();
        auction.settleAuction();

        INounsAuctionHouseV2.Settlement[] memory settlements = auction.getSettlements(2);

        assertEq(settlements.length, 2);
        assertEq(settlements[0].blockTimestamp, uint32(bid2Timestamp));
        assertEq(settlements[0].nounId, 2);
        assertEq(settlements[0].amount, 2 ether);
        assertEq(settlements[0].winner, makeAddr('bidder 2'));
        assertEq(settlements[1].blockTimestamp, uint32(bid1Timestamp));
        assertEq(settlements[1].nounId, 1);
        assertEq(settlements[1].amount, 1 ether);
        assertEq(settlements[1].winner, makeAddr('bidder'));

        uint256[] memory prices = auction.getPrices(2);
        assertEq(prices[0], 2 ether);
        assertEq(prices[1], 1 ether);
    }

    function test_prices_givenMissingAuctionData_skipsMissingNounIDs() public {
        address bidder = makeAddr('some bidder');
        bidAndWinCurrentAuction(bidder, 1 ether);

        vm.startPrank(address(auction));
        for (uint256 i = 0; i < 3; ++i) {
            auction.nouns().mint();
        }
        vm.stopPrank();

        bidAndWinCurrentAuction(bidder, 2 ether);
        bidAndWinCurrentAuction(bidder, 3 ether);

        INounsAuctionHouseV2.Settlement[] memory settlements = auction.getSettlements(3);
        assertEq(settlements.length, 3);
        assertEq(settlements[0].nounId, 6);
        assertEq(settlements[0].amount, 3 ether);
        assertEq(settlements[0].winner, bidder);
        assertEq(settlements[1].nounId, 2);
        assertEq(settlements[1].amount, 2 ether);
        assertEq(settlements[1].winner, bidder);
        assertEq(settlements[2].nounId, 1);
        assertEq(settlements[2].amount, 1 ether);
        assertEq(settlements[2].winner, bidder);

        uint256[] memory prices = auction.getPrices(3);
        assertEq(prices.length, 3);
        assertEq(prices[0], 3 ether);
        assertEq(prices[1], 2 ether);
        assertEq(prices[2], 1 ether);
    }

    function test_prices_withRange_givenBiggerRangeThanAuctionsReturnsAuctionsAndZeroObservations() public {
        uint256 lastBidTime;
        for (uint256 i = 1; i <= 3; ++i) {
            address bidder = makeAddr(vm.toString(i));
            lastBidTime = bidAndWinCurrentAuction(bidder, i * 1e18);
        }

        INounsAuctionHouseV2.Settlement[] memory settlements = auction.getSettlements(0, 5);
        // lastest ID 4 has no settlement data, so it's not included in the result
        assertEq(settlements.length, 3);
        assertEq(settlements[0].nounId, 1);
        assertEq(settlements[0].amount, 1 ether);
        assertEq(settlements[0].winner, makeAddr('1'));
        assertEq(settlements[1].nounId, 2);
        assertEq(settlements[1].amount, 2 ether);
        assertEq(settlements[1].winner, makeAddr('2'));
        assertEq(settlements[2].blockTimestamp, uint32(lastBidTime));
        assertEq(settlements[2].nounId, 3);
        assertEq(settlements[2].amount, 3 ether);
        assertEq(settlements[2].winner, makeAddr('3'));

        uint256[] memory prices = auction.getPrices(0, 5);
        expectedPrices = [1 ether, 2 ether, 3 ether];
        assertEq(prices, expectedPrices);
    }

    function test_prices_withRange_givenSmallerRangeThanAuctionsReturnsAuctions() public {
        for (uint256 i = 1; i <= 20; ++i) {
            address bidder = makeAddr(vm.toString(i));
            bidAndWinCurrentAuction(bidder, i * 1e18);
        }

        INounsAuctionHouseV2.Settlement[] memory settlements = auction.getSettlements(7, 12);
        assertEq(settlements.length, 4);
        assertEq(settlements[0].nounId, 7);
        assertEq(settlements[0].amount, 7 ether);
        assertEq(settlements[0].winner, makeAddr('7'));
        assertEq(settlements[1].nounId, 8);
        assertEq(settlements[1].amount, 8 ether);
        assertEq(settlements[1].winner, makeAddr('8'));
        assertEq(settlements[2].nounId, 9);
        assertEq(settlements[2].amount, 9 ether);
        assertEq(settlements[2].winner, makeAddr('9'));
        assertEq(settlements[3].nounId, 11);
        assertEq(settlements[3].amount, 10 ether);
        assertEq(settlements[3].winner, makeAddr('10'));

        uint256[] memory prices = auction.getPrices(7, 12);
        expectedPrices = [7 ether, 8 ether, 9 ether, 10 ether];
        assertEq(prices, expectedPrices);
    }

    function test_prices_withRange_givenMissingAuctionData_skipsMissingNounIDs() public {
        address bidder = makeAddr('some bidder');
        bidAndWinCurrentAuction(bidder, 1 ether);

        vm.startPrank(address(auction));
        for (uint256 i = 0; i < 3; ++i) {
            auction.nouns().mint();
        }
        vm.stopPrank();

        bidAndWinCurrentAuction(bidder, 2 ether);
        bidAndWinCurrentAuction(bidder, 3 ether);

        INounsAuctionHouseV2.Settlement[] memory settlements = auction.getSettlements(1, 7);
        assertEq(settlements.length, 3);
        assertEq(settlements[0].nounId, 1);
        assertEq(settlements[0].amount, 1 ether);
        assertEq(settlements[0].winner, bidder);
        assertEq(settlements[1].nounId, 2);
        assertEq(settlements[1].amount, 2 ether);
        assertEq(settlements[1].winner, bidder);
        assertEq(settlements[2].nounId, 6);
        assertEq(settlements[2].amount, 3 ether);
        assertEq(settlements[2].winner, bidder);

        uint256[] memory prices = auction.getPrices(1, 7);
        expectedPrices = [1 ether, 2 ether, 3 ether];
        assertEq(prices, expectedPrices);
    }

    function test_setPrices_revertsForNonOwner() public {
        INounsAuctionHouseV2.Settlement[] memory settlements = new INounsAuctionHouseV2.Settlement[](1);
        settlements[0] = INounsAuctionHouseV2.Settlement({
            blockTimestamp: uint32(block.timestamp),
            amount: 42 ether,
            winner: makeAddr('winner'),
            nounId: 3
        });

        vm.expectRevert('Ownable: caller is not the owner');
        auction.setPrices(settlements);
    }

    function test_setPrices_worksForOwner() public {
        INounsAuctionHouseV2.Settlement[] memory settlements = new INounsAuctionHouseV2.Settlement[](20);
        uint256[] memory nounIds = new uint256[](20);
        uint256[] memory prices = new uint256[](20);

        uint256 nounId = 0;
        for (uint256 i = 0; i < 20; ++i) {
            // skip Nouners
            if (nounId <= 1820 && nounId % 10 == 0) {
                nounId++;
            }

            uint256 price = nounId * 1 ether;

            settlements[i] = INounsAuctionHouseV2.Settlement({
                blockTimestamp: uint32(nounId),
                amount: price,
                winner: makeAddr(vm.toString(nounId)),
                nounId: nounId
            });

            nounIds[i] = nounId;
            prices[i] = price;

            nounId++;
        }

        vm.expectEmit(true, true, true, true);
        emit HistoricPricesSet(nounIds, prices);

        vm.prank(auction.owner());
        auction.setPrices(settlements);

        INounsAuctionHouseV2.Settlement[] memory actualSettlements = auction.getSettlements(0, 23);
        uint256[] memory actualPrices = auction.getPrices(0, 23);
        assertEq(actualSettlements.length, 20);
        assertEq(actualPrices.length, 20);
        for (uint256 i = 0; i < 20; ++i) {
            assertEq(settlements[i].blockTimestamp, actualSettlements[i].blockTimestamp);
            assertEq(settlements[i].amount, actualSettlements[i].amount);
            assertEq(settlements[i].winner, actualSettlements[i].winner);
            assertEq(settlements[i].nounId, actualSettlements[i].nounId);
            assertEq(settlements[i].amount, actualPrices[i]);
        }
    }
}

contract NounsAuctionHouseV2_OwnerFunctionsTest is NounsAuctionHouseV2TestBase {
    function test_setTimeBuffer_revertsForNonOwner() public {
        vm.expectRevert('Ownable: caller is not the owner');
        auction.setTimeBuffer(1 days);
    }

    function test_setTimeBuffer_revertsGivenValueAboveMax() public {
        vm.prank(auction.owner());
        vm.expectRevert('timeBuffer too large');
        auction.setTimeBuffer(1 days + 1);
    }

    function test_setTimeBuffer_worksForOwner() public {
        assertEq(auction.timeBuffer(), 5 minutes);

        vm.prank(auction.owner());
        auction.setTimeBuffer(1 days);

        assertEq(auction.timeBuffer(), 1 days);
    }
}
