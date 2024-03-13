// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import { INounsAuctionHouse } from '../../contracts/interfaces/INounsAuctionHouse.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { INounsToken } from '../../contracts/interfaces/INounsToken.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { AuctionHouseUpgrader } from './helpers/AuctionHouseUpgrader.sol';
import { NounsAuctionHouseProxy } from '../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';

abstract contract NounsAuctionHouseBaseTest is DeployUtils {
    INounsAuctionHouse auctionHouse;
    INounsToken nouns;
    address noundersDAO = makeAddr('noundersDAO');
    address owner = makeAddr('owner');
    NounsAuctionHouseProxy auctionHouseProxy;
    NounsAuctionHouseProxyAdmin proxyAdmin;
    uint256[] nounIds;

    function setUp() public virtual {
        (
            NounsAuctionHouseProxy auctionHouseProxy_,
            NounsAuctionHouseProxyAdmin proxyAdmin_
        ) = _deployAuctionHouseV1AndToken(owner, noundersDAO, address(0));
        auctionHouseProxy = auctionHouseProxy_;
        proxyAdmin = proxyAdmin_;

        auctionHouse = INounsAuctionHouse(address(auctionHouseProxy_));

        vm.prank(owner);
        auctionHouse.unpause();
    }
}

contract NounsAuctionHouse_GasSnapshot is NounsAuctionHouseBaseTest {
    function test_createOneBid() public {
        auctionHouse.createBid{ value: 1 ether }(1);
    }

    function test_createTwoBids() public {
        auctionHouse.createBid{ value: 1 ether }(1);
        auctionHouse.createBid{ value: 1.1 ether }(1);
    }

    function test_settleCurrentAndCreateNewAuction() public {
        vm.warp(block.timestamp + 1.1 days);

        auctionHouse.settleCurrentAndCreateNewAuction();
    }
}

contract NounsAuctionHouseV2_GasSnapshot is NounsAuctionHouse_GasSnapshot {
    function setUp() public virtual override {
        super.setUp();
        AuctionHouseUpgrader.upgradeAuctionHouse(owner, proxyAdmin, auctionHouseProxy);
    }
}

contract NounsAuctionHouseV2WarmedUp_GasSnapshot is NounsAuctionHouseV2_GasSnapshot {
    function setUp() public override {
        super.setUp();
        INounsAuctionHouseV2(address(auctionHouse)).warmUpSettlementState(1, 4);
    }
}

contract NounsAuctionHouseV2_HistoricPrices_GasSnapshot is NounsAuctionHouseBaseTest {
    INounsAuctionHouseV2 auctionHouseV2;

    function setUp() public virtual override {
        super.setUp();
        AuctionHouseUpgrader.upgradeAuctionHouse(owner, proxyAdmin, auctionHouseProxy);
        auctionHouseV2 = INounsAuctionHouseV2(address(auctionHouse));

        for (uint256 i = 1; i <= 200; ++i) {
            address bidder = makeAddr(vm.toString(i));
            bidAndWinCurrentAuction(bidder, i * 1e18);
        }
    }

    function bidAndWinCurrentAuction(address bidder, uint256 bid) internal returns (uint256) {
        uint128 nounId = auctionHouseV2.auction().nounId;
        uint40 endTime = auctionHouseV2.auction().endTime;
        vm.deal(bidder, bid);
        vm.prank(bidder);
        auctionHouseV2.createBid{ value: bid }(nounId);
        vm.warp(endTime);
        auctionHouseV2.settleCurrentAndCreateNewAuction();
        return block.timestamp;
    }

    function test_getSettlements_90() public {
        INounsAuctionHouseV2.Settlement[] memory prices = auctionHouseV2.getSettlements(90, false);
        assertEq(prices.length, 90);
    }

    function test_getPrices_90() public {
        uint256[] memory prices = auctionHouseV2.getPrices(90);
        assertEq(prices.length, 90);
    }

    function test_getSettlements_range_100() public {
        INounsAuctionHouseV2.Settlement[] memory settlements = auctionHouseV2.getSettlements(0, 100, false);
        assertEq(settlements.length, 100);
    }

    function test_warmUp() public {
        auctionHouseV2.warmUpSettlementState(0, 1000);
    }
}
