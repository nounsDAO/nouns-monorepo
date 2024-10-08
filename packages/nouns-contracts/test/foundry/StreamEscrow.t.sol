// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { Test } from 'forge-std/Test.sol';
import { StreamEscrow } from '../../contracts/StreamEscrow.sol';
import { ERC721Mock } from './helpers/ERC721Mock.sol';

contract StreamEscrowTest is Test {
    StreamEscrow escrow;
    address treasury = makeAddr('treasury');
    address auctionHouse = makeAddr('auctionHouse');
    ERC721Mock nounsToken = new ERC721Mock();
    address user = makeAddr('user');

    function setUp() public {
        escrow = new StreamEscrow(treasury, auctionHouse, address(nounsToken));

        vm.deal(auctionHouse, 1000 ether);
    }

    function testSingleStream() public {
        vm.prank(auctionHouse);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInAuctions: 20 });

        // check that nothing has streamed yet
        assertEq(escrow.ethStreamedToDAO(), 0 ether);

        for (uint i; i < 4; i++) {
            forwardOneDay();
        }

        assertEq(escrow.ethStreamedToDAO(), 2 ether);

        vm.prank(treasury);
        escrow.withdrawToTreasury(2 ether);

        // forward past the point of stream ending
        for (uint i; i < 20; i++) {
            forwardOneDay();
        }

        assertEq(escrow.ethStreamedToDAO(), 10 ether);
    }

    function testSilentlyFailsIf24HoursDidntPass() public {
        vm.prank(auctionHouse);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInAuctions: 20 });

        assertEq(escrow.ethStreamedToDAO(), 0 ether);

        vm.warp(block.timestamp + 24 hours - 1000);
        vm.prank(auctionHouse);
        escrow.forwardAll();

        assertEq(escrow.ethStreamedToDAO(), 0 ether);
    }

    function testCancelStream() public {
        nounsToken.mint(user, 1);

        vm.prank(auctionHouse);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInAuctions: 20 });

        for (uint i; i < 4; i++) {
            forwardOneDay();
        }

        assertEq(escrow.ethStreamedToDAO(), 2 ether);

        vm.prank(user);
        nounsToken.approve(address(escrow), 1);
        vm.prank(user);
        escrow.cancelStream(1);

        assertEq(user.balance, 8 ether);

        // make sure moving forward works with canceled streams
        for (uint i; i < 20; i++) {
            forwardOneDay();
        }
    }

    function testCantCancelAlreadyCanceledStream() public {
        nounsToken.mint(user, 1);

        vm.prank(auctionHouse);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInAuctions: 20 });

        vm.prank(user);
        nounsToken.approve(address(escrow), 1);
        vm.prank(user);
        escrow.cancelStream(1);

        // try to cancel again, should fail because user doesn't own noun 1 any more
        vm.expectRevert('ERC721: transfer caller is not owner nor approved');
        vm.prank(user);
        escrow.cancelStream(1);

        // fails even if user gets the noun again
        vm.prank(treasury);
        nounsToken.transferFrom(treasury, user, 1);
        vm.prank(user);
        nounsToken.approve(address(escrow), 1);

        vm.expectRevert('already canceled');
        vm.prank(user);
        escrow.cancelStream(1);
    }

    function testCantCancelAFinishedStream() public {
        nounsToken.mint(user, 1);

        vm.prank(auctionHouse);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInAuctions: 20 });

        for (uint i; i < 20; i++) {
            forwardOneDay();
        }

        // creating another stream, otherwise it fails because ethStreamedPerAuction underflows below zero
        vm.prank(auctionHouse);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 2, streamLengthInAuctions: 20 });

        vm.prank(user);
        nounsToken.approve(address(escrow), 1);
        vm.expectRevert('stream finished');
        vm.prank(user);
        escrow.cancelStream(1);
    }

    function testDAOCanWithdrawLessThanStreamed() public {
        vm.prank(auctionHouse);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInAuctions: 20 });
        forwardOneDay();

        assertEq(escrow.ethStreamedToDAO(), 0.5 ether);

        vm.prank(treasury);
        escrow.withdrawToTreasury(0.4 ether);
    }

    function testDAOCantWithdrawMoreThanStreamed() public {
        vm.prank(auctionHouse);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInAuctions: 20 });
        forwardOneDay();

        vm.expectRevert('not enough to withdraw');
        vm.prank(treasury);
        escrow.withdrawToTreasury(0.6 ether);
    }

    function forwardOneDay() internal {
        vm.warp(block.timestamp + 24 hours);
        vm.prank(auctionHouse);
        escrow.forwardAll();
    }

    function testRoundingDownStreamAmount() public {
        vm.prank(auctionHouse);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 1, streamLengthInAuctions: 1500 });

        // 1 ether divided by 1500 = 10^18/1500 = 666,666,666,666,666.666666666....
        // ethPerAuction should be: 666,666,666,666,666
        // the remainder, 0.666.. * 1500 = 1000 should be immediately streamed to the DAO
        assertEq(escrow.ethStreamedToDAO(), 1000);

        forwardOneDay();
        assertEq(escrow.ethStreamedToDAO(), 1000 + 666_666_666_666_666);

        // after streaming ends the entire amount is withdrawable
        for (uint i; i < 1500; i++) {
            forwardOneDay();
        }
        assertEq(escrow.ethStreamedToDAO(), 1 ether);
    }
}