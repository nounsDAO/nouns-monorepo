// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { Test } from 'forge-std/Test.sol';
import { StreamEscrow } from '../../contracts/StreamEscrow.sol';
import { ERC721Mock } from './helpers/ERC721Mock.sol';

contract StreamEscrowTest is Test {
    StreamEscrow escrow;
    address treasury = makeAddr('treasury');
    address ethRecipient = makeAddr('ethRecipient');
    address nounsRecipient = makeAddr('nounsRecipient');
    ERC721Mock nounsToken = new ERC721Mock();
    address user = makeAddr('user');

    function setUp() public {
        escrow = new StreamEscrow(treasury, ethRecipient, nounsRecipient, address(nounsToken));

        nounsToken.mint(address(this), 1);
    }

    function testSingleStream() public {
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });

        // check that nothing has streamed yet
        assertEq(ethRecipient.balance, 0 ether);

        for (uint i; i < 4; i++) {
            forwardOneDay();
        }

        assertEq(ethRecipient.balance, 2 ether);

        // forward past the point of stream ending
        for (uint i; i < 20; i++) {
            forwardOneDay();
        }

        assertEq(ethRecipient.balance, 10 ether);
    }

    function testCantCreateMoreThanOneActiveStreamForSameNoun() public {
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });

        vm.expectRevert('stream active');
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });
    }

    function testSilentlyFailsIf24HoursDidntPass() public {
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });

        assertEq(ethRecipient.balance, 0 ether);

        vm.warp(block.timestamp + 24 hours - 1000);
        escrow.forwardAll();

        assertEq(ethRecipient.balance, 0 ether);
    }

    function testCancelStream() public {
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });
        nounsToken.transferFrom(address(this), user, 1);

        for (uint i; i < 4; i++) {
            forwardOneDay();
        }

        assertEq(ethRecipient.balance, 2 ether);

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
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });
        nounsToken.transferFrom(address(this), user, 1);

        vm.prank(user);
        nounsToken.approve(address(escrow), 1);
        vm.prank(user);
        escrow.cancelStream(1);

        // try to cancel again, should fail because user doesn't own noun 1 any more
        vm.expectRevert('ERC721: transfer caller is not owner nor approved');
        vm.prank(user);
        escrow.cancelStream(1);

        // fails even if user gets the noun again
        vm.prank(nounsRecipient);
        nounsToken.transferFrom(nounsRecipient, user, 1);
        vm.prank(user);
        nounsToken.approve(address(escrow), 1);

        vm.expectRevert('already canceled');
        vm.prank(user);
        escrow.cancelStream(1);
    }

    function testCantCancelAFinishedStream() public {
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });
        nounsToken.transferFrom(address(this), user, 1);

        for (uint i; i < 20; i++) {
            forwardOneDay();
        }

        // creating another stream, otherwise it fails because ethStreamedPerAuction underflows below zero
        nounsToken.mint(address(this), 2);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 2, streamLengthInTicks: 20 });

        vm.prank(user);
        nounsToken.approve(address(escrow), 1);
        vm.expectRevert('stream finished');
        vm.prank(user);
        escrow.cancelStream(1);
    }

    function forwardOneDay() internal {
        vm.warp(block.timestamp + 24 hours);
        escrow.forwardAll();
    }

    function testRoundingDownStreamAmount() public {
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 1, streamLengthInTicks: 1500 });

        // 1 ether divided by 1500 = 10^18/1500 = 666,666,666,666,666.666666666....
        // ethPerAuction should be: 666,666,666,666,666
        // the remainder, 0.666.. * 1500 = 1000 should be immediately streamed to the DAO
        assertEq(ethRecipient.balance, 1000);

        forwardOneDay();
        assertEq(ethRecipient.balance, 1000 + 666_666_666_666_666);

        // after streaming ends the entire amount is withdrawable
        for (uint i; i < 1500; i++) {
            forwardOneDay();
        }
        assertEq(ethRecipient.balance, 1 ether);
    }

    function test_onlyOwnerCanFastForward() public {
        // setup
        vm.deal(user, 10 ether);
        nounsToken.mint(user, 3);
        vm.prank(user);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 3, streamLengthInTicks: 100 });

        vm.expectRevert('not noun owner');
        escrow.fastForward({ nounId: 3, ticksToForward: 50 });
    }

    function test_fastForward() public {
        // setup
        vm.deal(user, 10 ether);
        nounsToken.mint(user, 3);
        vm.prank(user);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 3, streamLengthInTicks: 100 });

        // forward 20 days
        for (uint i; i < 20; i++) {
            forwardOneDay();
        }
        assertEq(ethRecipient.balance, 0.2 ether);

        // fast forward 40 days out of the 80 left
        vm.prank(user);
        escrow.fastForward({ nounId: 3, ticksToForward: 40 });

        assertEq(ethRecipient.balance, 0.6 ether);
    }

    function test_fastForward_cantForwardPastStreamEnd() public {
        // setup
        for (uint i; i < 20; i++) {
            forwardOneDay();
        }

        vm.deal(user, 10 ether);
        nounsToken.mint(user, 3);
        vm.prank(user);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 3, streamLengthInTicks: 100 });

        vm.prank(user);
        vm.expectRevert('too many ticks');
        escrow.fastForward({ nounId: 3, ticksToForward: 101 });

        vm.prank(user);
        escrow.fastForward({ nounId: 3, ticksToForward: 100 });

        assertEq(ethRecipient.balance, 1 ether);

        vm.prank(user);
        vm.expectRevert('stream not active');
        escrow.fastForward({ nounId: 3, ticksToForward: 1 });
    }

    // TODO: test fastForward: fails for canceled or finished streams
    // TODO: test fastForward: fails if too many ticks
}
