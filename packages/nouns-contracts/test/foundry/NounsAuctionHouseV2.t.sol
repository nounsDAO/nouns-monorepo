// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { AuctionHouseUpgrader } from './helpers/AuctionHouseUpgrader.sol';
import { NounsAuctionHouseProxy } from '../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';
import { NounsAuctionHouse } from '../../contracts/NounsAuctionHouse.sol';
import { INounsAuctionHouseV2 as IAH } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { NounsAuctionHouseV2 } from '../../contracts/NounsAuctionHouseV2.sol';
import { BidderWithGasGriefing } from './helpers/BidderWithGasGriefing.sol';

contract NounsAuctionHouseV2TestBase is Test, DeployUtils {
    address owner = address(0x1111);
    address noundersDAO = address(0x2222);
    address minter = address(0x3333);
    uint256[] nounIds;
    uint32 timestamp = 1702289583;

    NounsAuctionHouseV2 auction;

    function setUp() public virtual {
        vm.warp(timestamp);
        (NounsAuctionHouseProxy auctionProxy, NounsAuctionHouseProxyAdmin proxyAdmin) = _deployAuctionHouseV1AndToken(
            owner,
            noundersDAO,
            minter
        );

        AuctionHouseUpgrader.upgradeAuctionHouse(owner, proxyAdmin, auctionProxy);

        auction = NounsAuctionHouseV2(address(auctionProxy));

        vm.prank(owner);
        auction.unpause();
        vm.roll(block.number + 1);
    }

    function bidAndWinCurrentAuction(address bidder, uint256 bid) internal returns (uint256) {
        uint128 nounId = auction.auction().nounId;
        vm.deal(bidder, bid);
        vm.prank(bidder);
        auction.createBid{ value: bid }(nounId);
        endAuctionAndSettle();
        return block.timestamp;
    }

    function endAuctionAndSettle() internal {
        uint40 endTime = auction.auction().endTime;
        vm.warp(endTime);
        auction.settleCurrentAndCreateNewAuction();
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
        (NounsAuctionHouseProxy auctionProxy, NounsAuctionHouseProxyAdmin proxyAdmin) = _deployAuctionHouseV1AndToken(
            owner,
            noundersDAO,
            minter
        );
        AuctionHouseUpgrader.upgradeAuctionHouse(owner, proxyAdmin, auctionProxy);
        auction = NounsAuctionHouseV2(address(auctionProxy));

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

        address nounsBefore = address(auctionV1.nouns());
        address wethBefore = address(auctionV1.weth());

        AuctionHouseUpgrader.upgradeAuctionHouse(owner, proxyAdmin, auctionProxy);

        NounsAuctionHouseV2 auctionV2 = NounsAuctionHouseV2(address(auctionProxy));

        IAH.AuctionV2View memory auctionV2State = auctionV2.auction();

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
        (NounsAuctionHouseProxy auctionProxy, NounsAuctionHouseProxyAdmin proxyAdmin) = _deployAuctionHouseV1AndToken(
            owner,
            noundersDAO,
            minter
        );
        NounsAuctionHouse auctionV1 = NounsAuctionHouse(address(auctionProxy));
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

        NounsAuctionHouseV2 auctionV2 = NounsAuctionHouseV2(address(auctionProxy));
        assertEq(auctionV2.paused(), true);
    }

    function test_auctionGetter_compatibleWithV1() public {
        address bidder = address(0x4242);
        vm.deal(bidder, 1.1 ether);
        vm.prank(bidder);
        auction.createBid{ value: 1.1 ether }(1);

        NounsAuctionHouse auctionV1 = NounsAuctionHouse(address(auction));

        IAH.AuctionV2View memory auctionV2 = auction.auction();

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

    function test_setMinBidIncrementPercentage_givenNonOwnerSender_reverts() public {
        vm.expectRevert('Ownable: caller is not the owner');
        auction.setMinBidIncrementPercentage(42);
    }

    function test_setMinBidIncrementPercentage_givenZero_reverts() public {
        vm.prank(auction.owner());
        vm.expectRevert('must be greater than zero');
        auction.setMinBidIncrementPercentage(0);
    }

    function test_setMinBidIncrementPercentage_givenNonZeroInput_works() public {
        assertNotEq(auction.minBidIncrementPercentage(), 42);

        vm.prank(auction.owner());
        auction.setMinBidIncrementPercentage(42);

        assertEq(auction.minBidIncrementPercentage(), 42);
    }
}

abstract contract NoracleBaseTest is NounsAuctionHouseV2TestBase {
    uint256[] expectedPrices;
    IAH.Settlement[] expectedSettlements;
    address bidder = makeAddr('bidder');

    function assertEq(IAH.Settlement[] memory s1, IAH.Settlement[] memory s2) internal {
        assertEq(s1.length, s2.length, 'wrong length');
        for (uint256 i; i < s1.length; i++) {
            assertEq(s1[i].blockTimestamp, s2[i].blockTimestamp, 'wrong timestamp');
            assertEq(s1[i].amount, s2[i].amount, 'wrong amount');
            assertEq(s1[i].winner, s2[i].winner, 'wrong winner');
            assertEq(s1[i].nounId, s2[i].nounId, 'wrong noun id');
        }
    }

    function reverse(IAH.Settlement[] storage s) internal view returns (IAH.Settlement[] memory) {
        IAH.Settlement[] memory s2 = new IAH.Settlement[](s.length);
        for (uint256 i = 0; i < s.length; ++i) {
            s2[s2.length - i - 1] = s[i];
        }
        return s2;
    }
}

contract NoracleTestOneAuctionSettledStateTest is NoracleBaseTest {
    IAH.Settlement nounId1Settlement;

    function setUp() public override {
        super.setUp();
        bidAndWinCurrentAuction(bidder, 1 ether);

        nounId1Settlement = IAH.Settlement({
            blockTimestamp: uint32(block.timestamp),
            amount: 1 ether,
            winner: bidder,
            nounId: 1,
            clientId: 0
        });
    }

    function test_prices() public {
        expectedPrices = [1 ether];

        assertEq(auction.getPrices(1), expectedPrices);
    }

    function test_prices_reverts_ifRequestMoreThanAvailableHistory() public {
        vm.expectRevert('Not enough history');
        auction.getPrices(2);
    }

    function test_getSettlements_skipFalse_1() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(1, false);

        expectedSettlements.push(nounId1Settlement);
        assertEq(settlements, expectedSettlements);
    }

    function test_getSettlementsRange_skipFalse_1() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(1, 2, false);
        expectedSettlements.push(nounId1Settlement);
        assertEq(settlements, expectedSettlements);
    }

    function test_getSettlementsFromIdtoTimestamp_skipFalse_1() public {
        IAH.Settlement[] memory settlements = auction.getSettlementsFromIdtoTimestamp(1, block.timestamp, false);
        expectedSettlements.push(nounId1Settlement);
        assertEq(settlements, expectedSettlements);
    }

    function test_getSettlements_skipFalse_returnsRawNounderNouns() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(2, false);

        expectedSettlements.push(nounId1Settlement);
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 0, amount: 0, winner: address(0), nounId: 0, clientId: 0 })
        );
        assertEq(settlements, expectedSettlements);
    }

    function test_getSettlementsRange_skipFalse_returnsRawNounderNouns() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(0, 2, false);
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 0, amount: 0, winner: address(0), nounId: 0, clientId: 0 })
        );
        expectedSettlements.push(nounId1Settlement);
        assertEq(settlements, expectedSettlements);
    }

    function test_getSettlementsFromIdtoTimestamp_skipFalse_returnsRawNounderNouns() public {
        IAH.Settlement[] memory settlements = auction.getSettlementsFromIdtoTimestamp(0, block.timestamp, false);
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 0, amount: 0, winner: address(0), nounId: 0, clientId: 0 })
        );
        expectedSettlements.push(nounId1Settlement);
        assertEq(settlements, expectedSettlements);
    }

    function test_getSettlementsFormIdToTimestamp_skipFalse_stopsAtEndTimestamp() public {
        IAH.Settlement[] memory settlements = auction.getSettlementsFromIdtoTimestamp(0, block.timestamp - 1, false);
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 0, amount: 0, winner: address(0), nounId: 0, clientId: 0 })
        );
        assertEq(settlements, expectedSettlements);
    }

    function test_getSettlementsFormIdToTimestamp_skipFalse_startIdInTheFuture_reverts() public {
        vm.expectRevert('startId too large');
        auction.getSettlementsFromIdtoTimestamp(3, block.timestamp, false);
    }

    function test_getSettlementsRange_skipFalse_returnsEmptyData() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(0, 3, false);
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 0, amount: 0, winner: address(0), nounId: 0, clientId: 0 })
        );
        expectedSettlements.push(nounId1Settlement);
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 0, amount: 0, winner: address(0), nounId: 2, clientId: 0 })
        );
        assertEq(settlements, expectedSettlements);
    }

    function test_getSettlements_skipFalse_returnsLessResultsIfReachedNounZero() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(3, false);

        expectedSettlements.push(nounId1Settlement);
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 0, amount: 0, winner: address(0), nounId: 0, clientId: 0 })
        );
        assertEq(settlements, expectedSettlements);
    }

    function test_getSettlements_skipTrue_skipsNounderNouns() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(2, true);

        expectedSettlements.push(nounId1Settlement);
        assertEq(settlements, expectedSettlements);
    }

    function test_getSettlementsRange_skipTrue_skipsNounderNouns() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(0, 2, true);
        expectedSettlements.push(nounId1Settlement);
        assertEq(settlements, expectedSettlements);
    }

    function test_getSettlementsFromIdToTimestamp_skipTrue_skipsNonderNouns() public {
        IAH.Settlement[] memory settlements = auction.getSettlementsFromIdtoTimestamp(0, block.timestamp, true);
        expectedSettlements.push(nounId1Settlement);
        assertEq(settlements, expectedSettlements);
    }

    function test_getSettlementsRange_skipTrue_skipsEmptyData() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(0, 4, true);
        expectedSettlements.push(nounId1Settlement);
        assertEq(settlements, expectedSettlements);
    }

    function test_prices_preserves10DecimalsUnderUint64MaxValue() public {
        // amount is uint64; maxValue - 1 = 18446744073709551615
        // at 10 decimal points it's 1844674407.3709551615
        bidAndWinCurrentAuction(makeAddr('bidder'), 1844674407.3709551615999999 ether);

        IAH.Settlement[] memory settlements = auction.getSettlements(1, true);

        assertEq(settlements.length, 1);
        assertEq(settlements[0].nounId, 2);
        assertEq(settlements[0].amount, 1844674407.3709551615 ether);
        assertEq(settlements[0].winner, makeAddr('bidder'));

        uint256[] memory prices = auction.getPrices(1);
        assertEq(prices[0], 1844674407.3709551615 ether);
    }

    function test_prices_overflowsGracefullyOverUint64MaxValue() public {
        bidAndWinCurrentAuction(makeAddr('bidder'), 1844674407.3709551617 ether);

        IAH.Settlement[] memory settlements = auction.getSettlements(1, false);

        assertEq(settlements.length, 1);
        assertEq(settlements[0].nounId, 2);
        assertEq(settlements[0].amount, 1 * 1e8);
        assertEq(settlements[0].winner, makeAddr('bidder'));

        uint256[] memory prices = auction.getPrices(1);
        assertEq(prices[0], 1 * 1e8);
    }
}

contract NoracleTestManyAuctionsSettledStateTest is NoracleBaseTest {
    function setUp() public override {
        super.setUp();
        for (uint256 i = 1; i <= 20; ++i) {
            address bidder = makeAddr(vm.toString(i));
            bidAndWinCurrentAuction(bidder, i * 1e18);
        }
    }

    function test_getSettlements_skipsNounderNouns() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(20, true);
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
    }

    function test_getPrices_skipsNounderNouns() public {
        uint256[] memory prices = auction.getPrices(20);
        // prettier-ignore
        expectedPrices = [20e18, 19e18, 18e18, 17e18, 16e18, 15e18, 14e18, 13e18, 12e18, 11e18,
                          10e18, 9e18, 8e18, 7e18, 6e18, 5e18, 4e18, 3e18, 2e18, 1e18];
        assertEq(prices, expectedPrices);
    }

    function test_getSettlementRange_limitsToRange() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(3, 8, true);
        assertEq(settlements.length, 5);
        assertEq(settlements[0].nounId, 3);
        assertEq(settlements[1].nounId, 4);
        assertEq(settlements[2].nounId, 5);
        assertEq(settlements[3].nounId, 6);
        assertEq(settlements[4].nounId, 7);
    }

    function test_getSettlementFromIdToTimestamp_limitsToTimestamp() public {
        // get the timestamp of id 7
        uint256 endTimestamp = auction.getSettlements(7, 8, true)[0].blockTimestamp;

        IAH.Settlement[] memory settlements = auction.getSettlementsFromIdtoTimestamp(3, endTimestamp, true);
        assertEq(settlements.length, 5);
        assertEq(settlements[0].nounId, 3);
        assertEq(settlements[1].nounId, 4);
        assertEq(settlements[2].nounId, 5);
        assertEq(settlements[3].nounId, 6);
        assertEq(settlements[4].nounId, 7);
    }
}

contract NoracleTest_GapInHistoricPricesTest is NoracleBaseTest {
    function setUp() public override {
        super.setUp();

        bidAndWinCurrentAuction(bidder, 1 ether); // settle noun 1

        vm.startPrank(address(auction));
        for (uint256 i = 0; i < 3; ++i) {
            auction.nouns().mint(); // mint nouns 3,4,5
        }
        vm.stopPrank();

        bidAndWinCurrentAuction(bidder, 2 ether); // settle noun 2
        bidAndWinCurrentAuction(bidder, 6 ether); // settle noun 6
    }

    function test_prices_revertsIfEmptyAuctionData() public {
        // this works
        auction.getPrices(1);

        // this doesn't
        vm.expectRevert('Missing data');
        auction.getPrices(2);
    }

    function test_getSettlements_skipTrue_skipsEmptyData() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(20, true);

        uint256 ts = block.timestamp;
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: uint32(ts), amount: 6 ether, winner: bidder, nounId: 6, clientId: 0 })
        );
        expectedSettlements.push(
            IAH.Settlement({
                blockTimestamp: uint32(ts - 24 hours),
                amount: 2 ether,
                winner: bidder,
                nounId: 2,
                clientId: 0
            })
        );
        expectedSettlements.push(
            IAH.Settlement({
                blockTimestamp: uint32(ts - 48 hours),
                amount: 1 ether,
                winner: bidder,
                nounId: 1,
                clientId: 0
            })
        );
        assertEq(settlements, expectedSettlements);

        IAH.Settlement[] memory settlements2 = auction.getSettlements(0, 20, true);
        assertEq(settlements2, reverse(expectedSettlements));

        IAH.Settlement[] memory settlements3 = auction.getSettlementsFromIdtoTimestamp(0, block.timestamp, true);
        assertEq(settlements3, reverse(expectedSettlements));
    }

    function test_getSettlements_skipFalse() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(20, false);

        uint256 ts = block.timestamp;
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: uint32(ts), amount: 6 ether, winner: bidder, nounId: 6, clientId: 0 })
        );
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 0, amount: 0, winner: address(0), nounId: 5, clientId: 0 })
        );
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 0, amount: 0, winner: address(0), nounId: 4, clientId: 0 })
        );
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 0, amount: 0, winner: address(0), nounId: 3, clientId: 0 })
        );
        expectedSettlements.push(
            IAH.Settlement({
                blockTimestamp: uint32(ts - 24 hours),
                amount: 2 ether,
                winner: bidder,
                nounId: 2,
                clientId: 0
            })
        );
        expectedSettlements.push(
            IAH.Settlement({
                blockTimestamp: uint32(ts - 48 hours),
                amount: 1 ether,
                winner: bidder,
                nounId: 1,
                clientId: 0
            })
        );
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 0, amount: 0, winner: address(0), nounId: 0, clientId: 0 })
        );
        assertEq(settlements, expectedSettlements);

        IAH.Settlement[] memory settlements2 = auction.getSettlements(0, 7, false);
        assertEq(settlements2, reverse(expectedSettlements));

        IAH.Settlement[] memory settlements3 = auction.getSettlementsFromIdtoTimestamp(0, block.timestamp, false);
        assertEq(settlements3, reverse(expectedSettlements));
    }
}

contract NoracleTest_GapInHistoricPrices_AfterWarmUp_Test is NoracleBaseTest {
    function setUp() public override {
        super.setUp();

        auction.warmUpSettlementState(0, 7);

        bidAndWinCurrentAuction(bidder, 1 ether); // settle noun 1

        vm.startPrank(address(auction));
        for (uint256 i = 0; i < 3; ++i) {
            auction.nouns().mint(); // mint nouns 3,4,5
        }
        vm.stopPrank();

        bidAndWinCurrentAuction(bidder, 2 ether); // settle noun 2
        bidAndWinCurrentAuction(bidder, 6 ether); // settle noun 6
    }

    function test_prices_revertsIfEmptyAuctionData() public {
        // this works
        auction.getPrices(1);

        // this doesn't
        vm.expectRevert('Missing data');
        auction.getPrices(2);
    }

    function test_getSettlements_skipTrue_skipsEmptyData() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(20, true);

        uint256 ts = block.timestamp;
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: uint32(ts), amount: 6 ether, winner: bidder, nounId: 6, clientId: 0 })
        );
        expectedSettlements.push(
            IAH.Settlement({
                blockTimestamp: uint32(ts - 24 hours),
                amount: 2 ether,
                winner: bidder,
                nounId: 2,
                clientId: 0
            })
        );
        expectedSettlements.push(
            IAH.Settlement({
                blockTimestamp: uint32(ts - 48 hours),
                amount: 1 ether,
                winner: bidder,
                nounId: 1,
                clientId: 0
            })
        );
        assertEq(settlements, expectedSettlements);

        IAH.Settlement[] memory settlements2 = auction.getSettlements(0, 20, true);
        assertEq(settlements2, reverse(expectedSettlements));

        IAH.Settlement[] memory settlements3 = auction.getSettlementsFromIdtoTimestamp(0, block.timestamp, true);
        assertEq(settlements3, reverse(expectedSettlements));
    }

    function test_getSettlements_skipFalse() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(20, false);

        uint256 ts = block.timestamp;
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: uint32(ts), amount: 6 ether, winner: bidder, nounId: 6, clientId: 0 })
        );
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 1, amount: 0, winner: address(0), nounId: 5, clientId: 0 })
        );
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 1, amount: 0, winner: address(0), nounId: 4, clientId: 0 })
        );
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 1, amount: 0, winner: address(0), nounId: 3, clientId: 0 })
        );
        expectedSettlements.push(
            IAH.Settlement({
                blockTimestamp: uint32(ts - 24 hours),
                amount: 2 ether,
                winner: bidder,
                nounId: 2,
                clientId: 0
            })
        );
        expectedSettlements.push(
            IAH.Settlement({
                blockTimestamp: uint32(ts - 48 hours),
                amount: 1 ether,
                winner: bidder,
                nounId: 1,
                clientId: 0
            })
        );

        // timestamp remains 0 here because it's a Nounder reward ID that does not get warmed up.
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 0, amount: 0, winner: address(0), nounId: 0, clientId: 0 })
        );
        assertEq(settlements, expectedSettlements);

        IAH.Settlement[] memory settlements2 = auction.getSettlements(0, 7, false);
        assertEq(settlements2, reverse(expectedSettlements));

        IAH.Settlement[] memory settlements3 = auction.getSettlementsFromIdtoTimestamp(0, block.timestamp, false);
        assertEq(settlements3, reverse(expectedSettlements));
    }
}

contract NoracleTest_AuctionWithNoBids is NoracleBaseTest {
    function setUp() public override {
        super.setUp();

        bidAndWinCurrentAuction(bidder, 1 ether); // settle noun 1
        endAuctionAndSettle(); // no winner for noun 2
        bidAndWinCurrentAuction(bidder, 3 ether); // settle noun 3
    }

    function test_getPrices_skipsAuctionsWithNotBids() public {
        uint256[] memory prices = auction.getPrices(2);
        expectedPrices = [3 ether, 1 ether];
        assertEq(prices, expectedPrices);
    }

    function test_getSettlements_skipFalse() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(20, false);

        uint256 ts = block.timestamp;
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: uint32(ts), amount: 3 ether, winner: bidder, nounId: 3, clientId: 0 })
        );
        expectedSettlements.push(
            IAH.Settlement({
                blockTimestamp: uint32(ts - 24 hours),
                amount: 0,
                winner: address(0),
                nounId: 2,
                clientId: 0
            })
        );
        expectedSettlements.push(
            IAH.Settlement({
                blockTimestamp: uint32(ts - 48 hours),
                amount: 1 ether,
                winner: bidder,
                nounId: 1,
                clientId: 0
            })
        );
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: 0, amount: 0, winner: address(0), nounId: 0, clientId: 0 })
        );
        assertEq(settlements, expectedSettlements);

        IAH.Settlement[] memory settlements2 = auction.getSettlements(0, 4, false);
        assertEq(settlements2, reverse(expectedSettlements));

        IAH.Settlement[] memory settlements3 = auction.getSettlementsFromIdtoTimestamp(0, block.timestamp, false);
        assertEq(settlements3, reverse(expectedSettlements));
    }

    function test_getSettlements_skipTrue_includesAuctionsWithNoBids() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(20, true);

        uint256 ts = block.timestamp;
        expectedSettlements.push(
            IAH.Settlement({ blockTimestamp: uint32(ts), amount: 3 ether, winner: bidder, nounId: 3, clientId: 0 })
        );
        expectedSettlements.push(
            IAH.Settlement({
                blockTimestamp: uint32(ts - 24 hours),
                amount: 0,
                winner: address(0),
                nounId: 2,
                clientId: 0
            })
        );
        expectedSettlements.push(
            IAH.Settlement({
                blockTimestamp: uint32(ts - 48 hours),
                amount: 1 ether,
                winner: bidder,
                nounId: 1,
                clientId: 0
            })
        );
        assertEq(settlements, expectedSettlements);

        IAH.Settlement[] memory settlements2 = auction.getSettlements(0, 20, true);
        assertEq(settlements2, reverse(expectedSettlements));

        IAH.Settlement[] memory settlements3 = auction.getSettlementsFromIdtoTimestamp(0, block.timestamp, true);
        assertEq(settlements3, reverse(expectedSettlements));
    }
}

contract NoracleTest_NoActiveAuction is NoracleBaseTest {
    function setUp() public override {
        super.setUp();

        bidAndWinCurrentAuction(makeAddr('bidder'), 1 ether);
        bidDontCreateNewAuction(makeAddr('bidder 2'), 2 ether);

        vm.prank(auction.owner());
        auction.pause();
        auction.settleAuction();
    }

    function test_prices_includesLastNoun() public {
        expectedPrices = [2 ether, 1 ether];
        uint256[] memory prices = auction.getPrices(2);
        assertEq(prices, expectedPrices);
    }

    function test_getSettlements_includesLastNoun() public {
        IAH.Settlement[] memory settlements = auction.getSettlements(20, true);

        uint256 ts = block.timestamp;
        expectedSettlements.push(
            IAH.Settlement({
                blockTimestamp: uint32(ts),
                amount: 2 ether,
                winner: makeAddr('bidder 2'),
                nounId: 2,
                clientId: 0
            })
        );
        expectedSettlements.push(
            IAH.Settlement({
                blockTimestamp: uint32(ts - 24 hours),
                amount: 1 ether,
                winner: makeAddr('bidder'),
                nounId: 1,
                clientId: 0
            })
        );
        assertEq(settlements, expectedSettlements);

        IAH.Settlement[] memory settlements2 = auction.getSettlements(0, 20, true);
        assertEq(settlements2, reverse(expectedSettlements));

        IAH.Settlement[] memory settlements3 = auction.getSettlementsFromIdtoTimestamp(0, block.timestamp, true);
        assertEq(settlements3, reverse(expectedSettlements));
    }
}

contract NounsAuctionHouseV2_setPricesTest is NoracleBaseTest {
    function test_setPrices_revertsForNonOwner() public {
        IAH.SettlementNoClientId[] memory settlements = new IAH.SettlementNoClientId[](1);
        settlements[0] = IAH.SettlementNoClientId({
            blockTimestamp: uint32(block.timestamp),
            amount: 42 ether,
            winner: makeAddr('winner'),
            nounId: 3
        });

        vm.expectRevert('Ownable: caller is not the owner');
        auction.setPrices(settlements);
    }

    function test_setPrices_worksForOwner() public {
        IAH.SettlementNoClientId[] memory settlements = new IAH.SettlementNoClientId[](20);

        uint256 nounId = 0;
        for (uint256 i = 0; i < 20; ++i) {
            // skip Nouners
            if (nounId <= 1820 && nounId % 10 == 0) {
                nounId++;
            }

            uint256 price = nounId * 1 ether;

            settlements[i] = IAH.SettlementNoClientId({
                blockTimestamp: 100000000 + uint32(nounId),
                amount: price,
                winner: makeAddr(vm.toString(nounId)),
                nounId: nounId
            });

            nounId++;
        }

        vm.prank(auction.owner());
        auction.setPrices(settlements);

        IAH.Settlement[] memory actualSettlements = auction.getSettlements(0, 23, true);
        assertEq(actualSettlements.length, 20);
        for (uint256 i = 0; i < 20; ++i) {
            assertEq(settlements[i].blockTimestamp, actualSettlements[i].blockTimestamp);
            assertEq(settlements[i].amount, actualSettlements[i].amount);
            assertEq(settlements[i].winner, actualSettlements[i].winner);
            assertEq(settlements[i].nounId, actualSettlements[i].nounId);
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
