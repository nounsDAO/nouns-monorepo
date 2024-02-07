// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { NounsAuctionHouseV2 } from '../../contracts/NounsAuctionHouseV2.sol';
import { NounsAuctionHouseProxy } from '../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';

import { NounsDescriptorV2 } from '../../contracts/NounsDescriptorV2.sol';
import { NounsSeeder } from '../../contracts/NounsSeeder.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';

interface AuctionEvents {
    event AuctionBidComment(string comment);
    event AuctionSettled(uint256 indexed nounId, address winner, uint256 amount);
}

contract NounsAuctionHouseV2Test is Test, DeployUtils, AuctionEvents {
    NounsAuctionHouseV2 auctionHouse;
    NounsAuctionHouseProxy auctionHouseProxy;
    NounsAuctionHouseProxyAdmin auctionHouseProxyAdmin;
    NounsAuctionHouseV2 auctionHouseProxyInstance;

    NounsToken nounsToken;
    address admin = address(0x4);
    address minter = address(0x6);
    address bidder = address(0x7);
    address noundersDAO = address(0x8);
    address weth = address(0x9);

    function setUp() public virtual {
        auctionHouse = new NounsAuctionHouseV2();

        NounsDescriptorV2 descriptor = _deployAndPopulateV2();

        nounsToken = new NounsToken(noundersDAO, minter, descriptor, new NounsSeeder(), IProxyRegistry(address(0x11)));

        auctionHouseProxyAdmin = new NounsAuctionHouseProxyAdmin();

        auctionHouseProxy = new NounsAuctionHouseProxy(
            address(auctionHouse),
            address(auctionHouseProxyAdmin),
            abi.encodeWithSignature(
                'initialize(address,address,uint256,uint256,uint8,uint256)',
                address(nounsToken),
                address(weth),
                TIME_BUFFER,
                RESERVE_PRICE,
                MIN_INCREMENT_BID_PERCENTAGE,
                DURATION
            )
        );

        auctionHouseProxyAdmin.upgrade(auctionHouseProxy, address(auctionHouse));
        auctionHouseProxyInstance = NounsAuctionHouseV2(address(auctionHouseProxy));
        nounsToken.setMinter(address(auctionHouseProxy));

        auctionHouseProxyInstance.unpause();
    }

    function setUpAuctionAndBid(uint256 nounId, uint256 bidAmount, string memory comment) internal {
        vm.prank(bidder);
        vm.deal(bidder, bidAmount);

        if (bytes(comment).length > 0) {
            auctionHouseProxyInstance.createBidWithComment{ value: bidAmount }(nounId, comment);
        } else {
            auctionHouseProxyInstance.createBid{ value: bidAmount }(nounId);
        }
    }

    function testCreateBid() public {
        uint256 nounId = 1;
        uint256 bidAmount = 1 ether;

        setUpAuctionAndBid(nounId, bidAmount, '');

        (uint256 noun, uint256 amount, , , address bidderAddress, ) = auctionHouseProxyInstance.auction();
        assertEq(noun, nounId);
        assertEq(amount, bidAmount);
        assertEq(bidderAddress, bidder);
    }

    function testCreateBidWithComment() public {
        uint256 nounId = 1;
        uint256 bidAmount = 2 ether;
        string memory comment = 'This is a test comment';

        vm.expectEmit();
        emit AuctionBidComment(comment);

        setUpAuctionAndBid(nounId, bidAmount, comment);

        (uint256 noun, uint256 amount, , , address bidderAddress, ) = auctionHouseProxyInstance.auction();
        assertEq(noun, nounId);
        assertEq(amount, bidAmount);
        assertEq(bidderAddress, bidder);
    }

    function testSettleAuction() public {
        uint256 nounId = 1;
        uint256 bidAmount = 2 ether;
        string memory comment = 'This is a test comment';
        setUpAuctionAndBid(nounId, bidAmount, comment);

        // Skip forward in time to simulate the end of the auction
        skip(DURATION + TIME_BUFFER);

        // Call settleCurrentAndCreateNewAuction to settle the current auction and start a new one
        vm.expectEmit(true, false, true, true);
        emit AuctionSettled(nounId, bidder, bidAmount);

        auctionHouseProxyInstance.settleCurrentAndCreateNewAuction();

        uint256 nextNounId = 2;
        (uint256 noun, , , , , ) = auctionHouseProxyInstance.auction();
        assertEq(noun, nextNounId);
    }

    receive() external payable {}
}
