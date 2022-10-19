// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { NounsAuctionHouseProxy } from '../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';
import { NounsAuctionHouseV2 } from '../../contracts/NounsAuctionHouseV2.sol';
import { Noracle } from '../../contracts/libs/Noracle.sol';

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

        NounsAuctionHouseV2 auctionV2 = new NounsAuctionHouseV2();
        _upgradeAuctionHouse(owner, proxyAdmin, auctionProxy, address(auctionV2));

        auction = NounsAuctionHouseV2(address(auctionProxy));

        vm.prank(owner);
        auction.unpause();
        vm.roll(block.number + 1);
    }

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
