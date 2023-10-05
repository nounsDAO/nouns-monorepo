// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import { INounsAuctionHouse } from '../../contracts/interfaces/INounsAuctionHouse.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { INounsToken } from '../../contracts/interfaces/INounsToken.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { AuctionHouseUpgrader } from './helpers/AuctionHouseUpgrader.sol';
import { NounsAuctionHouseProxy } from '../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';

contract NounsAuctionHouse_GasSnapshot_createBid is DeployUtils {
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

contract NounsAuctionHouseV2_GasSnapshot_createBid is NounsAuctionHouse_GasSnapshot_createBid {
    function setUp() public virtual override {
        super.setUp();
        AuctionHouseUpgrader.upgradeAuctionHouse(owner, proxyAdmin, auctionHouseProxy);
    }
}

contract NounsAuctionHouseV2WarmedUp_GasSnapshot_createBid is NounsAuctionHouseV2_GasSnapshot_createBid {
    function setUp() public override {
        super.setUp();
        nounIds = [1, 2, 3];
        INounsAuctionHouseV2(address(auctionHouse)).warmUpSettlementState(nounIds);
    }
}
