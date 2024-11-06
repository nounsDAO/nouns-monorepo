// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { Test } from 'forge-std/Test.sol';
import { StreamEscrow } from '../../contracts/StreamEscrow.sol';
import { ERC721Mock } from './helpers/ERC721Mock.sol';

abstract contract BaseStreamEscrowTest is Test {
    StreamEscrow escrow;
    address treasury = makeAddr('treasury');
    address ethRecipient = makeAddr('ethRecipient');
    address nounsRecipient = makeAddr('nounsRecipient');
    address streamCreator = makeAddr('streamCreator');
    ERC721Mock nounsToken = new ERC721Mock();
    address user = makeAddr('user');

    function setUp() public virtual {
        escrow = new StreamEscrow(treasury, ethRecipient, nounsRecipient, address(nounsToken), streamCreator);

        nounsToken.mint(streamCreator, 1);
        vm.deal(streamCreator, 1000 ether);
    }
}

contract CreateStreamPermissionsTest is BaseStreamEscrowTest {
    function test_createStream_failsIfNotWhitelisted() public {
        vm.expectRevert('not allowed');
        escrow.createStream(1, 1000);
    }

    function test_nounOwner_failsIfNotWhitelisted() public {
        nounsToken.mint(user, 2);
        vm.prank(user);
        vm.expectRevert('not allowed');
        escrow.createStream(2, 1000);
    }

    function test_createStream_allowsIfWhitelistedAndOwner() public {
        assertEq(nounsToken.ownerOf(1), streamCreator);

        vm.prank(streamCreator);
        escrow.createStream(1, 1000);
    }

    function test_createStream_failsIfWhitelistedAndNotOwner() public {
        nounsToken.mint(user, 2);

        vm.prank(streamCreator);
        vm.expectRevert('only noun owner or approved');
        escrow.createStream(2, 1000);
    }

    function test_createStream_allowsIfWhitelistedAndApprovedSingleToken() public {
        nounsToken.mint(user, 2);
        vm.prank(user);
        nounsToken.approve(streamCreator, 2);

        vm.prank(streamCreator);
        escrow.createStream(2, 1000);
    }

    function test_createStream_allowsIfWhitelistedAndApprovedAll() public {
        nounsToken.mint(user, 2);
        vm.prank(user);
        nounsToken.setApprovalForAll(streamCreator, true);

        vm.prank(streamCreator);
        escrow.createStream(2, 1000);
    }
}

contract SetAllowedToCreateStreamTest is BaseStreamEscrowTest {
    function setUp() public virtual override {
        super.setUp();
        nounsToken.mint(user, 2);
    }

    function test_addAddressToWhitelist() public {
        vm.prank(treasury);
        escrow.setAllowedToCreateStream(user, true);

        vm.prank(user);
        escrow.createStream(2, 1000);
    }

    function test_removesAddressFromWhitelist() public {
        vm.prank(treasury);
        escrow.setAllowedToCreateStream(user, true);

        vm.prank(treasury);
        escrow.setAllowedToCreateStream(user, false);

        vm.prank(user);
        vm.expectRevert('not allowed');
        escrow.createStream(2, 1000);
    }

    function test_failsIfNotCalledByDAO() public {
        vm.expectRevert('only dao');
        escrow.setAllowedToCreateStream(address(1), true);
    }
}

contract StreamEscrowTest is BaseStreamEscrowTest {
    function testSingleStream() public {
        vm.prank(streamCreator);
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
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });

        vm.prank(streamCreator);
        vm.expectRevert('stream active');
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });
    }

    function testSilentlyFailsIf24HoursDidntPass() public {
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });

        assertEq(ethRecipient.balance, 0 ether);

        vm.warp(block.timestamp + 24 hours - 1000);
        escrow.forwardAll();

        assertEq(ethRecipient.balance, 0 ether);
    }

    function testCancelStream() public {
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });
        vm.prank(streamCreator);
        nounsToken.transferFrom(streamCreator, user, 1);

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
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });
        vm.prank(streamCreator);
        nounsToken.transferFrom(streamCreator, user, 1);

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
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });
        vm.prank(streamCreator);
        nounsToken.transferFrom(streamCreator, user, 1);

        for (uint i; i < 20; i++) {
            forwardOneDay();
        }

        // creating another stream, otherwise it fails because ethStreamedPerAuction underflows below zero
        nounsToken.mint(streamCreator, 2);
        vm.prank(streamCreator);
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
        vm.prank(streamCreator);
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
        nounsToken.mint(streamCreator, 3);
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 3, streamLengthInTicks: 100 });

        vm.prank(streamCreator);
        nounsToken.transferFrom(streamCreator, user, 3);

        vm.expectRevert('not noun owner');
        escrow.fastForward({ nounId: 3, ticksToForward: 50 });
    }

    function test_fastForward() public {
        // setup
        nounsToken.mint(streamCreator, 3);
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 3, streamLengthInTicks: 100 });

        vm.prank(streamCreator);
        nounsToken.transferFrom(streamCreator, user, 3);

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

        nounsToken.mint(streamCreator, 3);
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 3, streamLengthInTicks: 100 });

        vm.prank(streamCreator);
        nounsToken.transferFrom(streamCreator, user, 3);

        vm.prank(user);
        vm.expectRevert('ticksToFoward too large');
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
