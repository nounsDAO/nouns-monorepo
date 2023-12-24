// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsAuctionHouseV2 } from '../../contracts/NounsAuctionHouseV2.sol';
import { NounsAuctionHouseProxy } from '../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';

import { NounsDescriptorV2 } from '../../contracts/NounsDescriptorV2.sol';
import { NounsSeeder } from '../../contracts/NounsSeeder.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';

contract NounsAuctionHouseV2Test is Test, DeployUtils {
    NounsAuctionHouseV2 auctionHouse;
    NounsAuctionHouseV2 auctionHouseProxy;
    NounsAuctionHouseProxyAdmin auctionHouseProxyAdmin;

    NounsToken nounsToken;
    address admin = address(0x4);
    address minter = address(0x6);
    address bidder = address(0x7);
    address noundersDAO = address(0x8);
    address weth = address(0x9);

    function setUp() public virtual {
        auctionHouse = new NounsAuctionHouseV2();

        NounsDescriptorV2 descriptor = _deployAndPopulateV2();

        nounsToken = new NounsToken(noundersDAO, minter, descriptor, new NounsSeeder(), IProxyRegistry(address(0)));
        auctionHouseProxyAdmin = new NounsAuctionHouseProxyAdmin();
        auctionHouseProxy = NounsAuctionHouseV2(
            payable(
                new NounsAuctionHouseProxy(
                    address(nounsToken),
                    address(auctionHouseProxyAdmin),
                    abi.encodeWithSignature(
                        'initialize(address,address,uint256,uint256,uint8,uint256)',
                        address(nounsToken),
                        weth,
                        TIME_BUFFER,
                        RESERVE_PRICE,
                        MIN_INCREMENT_BID_PERCENTAGE,
                        DURATION
                    )
                )
            )
        );
    }

    function testCreateBid() public {
        uint256 nounId = 1;
        uint256 bidAmount = 1 ether;

        vm.prank(bidder);
        vm.deal(bidder, bidAmount);

        auctionHouseProxy.createBid{ value: bidAmount }(nounId);

        assertEq(auctionHouseProxy.auction().amount, bidAmount);
        assertEq(auctionHouseProxy.auction().bidder, bidder);
    }

    function testCreateBidWithComment() public {
        uint256 nounId = 1;
        uint256 bidAmount = 1 ether;
        string memory comment = 'This is a test comment';

        vm.prank(bidder);
        vm.deal(bidder, bidAmount);

        auctionHouseProxy.createBidWithComment{ value: bidAmount }(nounId, comment);

        assertEq(auctionHouseProxy.auction().amount, bidAmount);
        assertEq(auctionHouseProxy.auction().bidder, bidder);
        assertEq(auctionHouseProxy.auction().comment, comment);
    }

    function testSettleAuction() public {
        auctionHouseProxy.settleAuction();

        assertTrue(auctionHouseProxy.auction().settled);
    }
}
