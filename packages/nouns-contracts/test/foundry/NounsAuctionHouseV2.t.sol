// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { NounsAuctionHouseProxy } from '../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';
import { NounsAuctionHouseV2 } from '../../contracts/NounsAuctionHouseV2.sol';
import { Noracle } from '../../contracts/libs/Noracle.sol';

contract NounsAuctionHouseV2Test is Test, DeployUtils {
    address owner = address(0x1111);
    address noundersDAO = address(0x2222);
    address minter = address(0x3333);
    address user = address(0x4444);

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
        (uint256 nounId, , , uint256 endTime, , ) = auction.auction();
        vm.deal(user, 1 ether);
        vm.prank(user);
        auction.createBid{ value: 1 ether }(nounId);
        vm.warp(endTime);
        auction.settleCurrentAndCreateNewAuction();

        Noracle.Observation[] memory prices = auction.prices(1);

        assertEq(prices[0].blockTimestamp, uint32(block.timestamp));
        assertEq(prices[0].nounId, 1);
        assertEq(prices[0].amount, 1e8);
        assertEq(prices[0].winner, user);
    }
}
