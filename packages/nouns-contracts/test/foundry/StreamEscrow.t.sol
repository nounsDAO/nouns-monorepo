// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { Test } from 'forge-std/Test.sol';
import { StreamEscrow } from '../../contracts/StreamEscrow.sol';
import { ERC721Mock } from './helpers/ERC721Mock.sol';
import 'forge-std/console.sol';

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

    function forwardOneDay() internal {
        vm.warp(block.timestamp + 24 hours);
        escrow.forwardAll();
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

contract SingleStreamTest is BaseStreamEscrowTest {
    function test_singleStreamLifetime() public {
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });

        // check that nothing has streamed yet
        assertEq(ethRecipient.balance, 0 ether);
        // check state changes
        assertEq(escrow.ethStreamedPerTick(), 0.5 ether);
        assertEq(escrow.getStream(1).lastTick, 20);
        assertEq(escrow.getStream(1).ethPerTick, 0.5 ether);
        assertEq(escrow.getStream(1).active, true);

        assertTrue(escrow.isStreamActive(1));

        for (uint i; i < 4; i++) {
            forwardOneDay();
        }

        assertEq(ethRecipient.balance, 2 ether);
        assertTrue(escrow.isStreamActive(1));

        // forward past the point of stream ending
        for (uint i; i < 16; i++) {
            forwardOneDay();
        }

        assertEq(ethRecipient.balance, 10 ether);
        assertFalse(escrow.isStreamActive(1));
        // check that no more eth is streaming
        assertEq(escrow.ethStreamedPerTick(), 0 ether);

        // can keep forwarding days
        for (uint i; i < 10; i++) {
            forwardOneDay();
        }
    }

    function test_forwardAll_silentlyFailsIf24HoursDidntPass() public {
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });

        assertEq(ethRecipient.balance, 0 ether);

        vm.warp(block.timestamp + 24 hours - 1000);
        escrow.forwardAll();

        assertEq(ethRecipient.balance, 0 ether);
    }

    function testRoundingDownStreamAmount() public {
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 1, streamLengthInTicks: 1500 });

        // 1 ether divided by 1500 = 10^18/1500 = 666,666,666,666,666.666666666....
        // ethPerTick should be: 666,666,666,666,666
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
}

contract SingleActiveStreamPerNoun is BaseStreamEscrowTest {
    function setUp() public virtual override {
        super.setUp();

        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });
    }

    function test_cantCreateStreamForNounIdIfAlreadyActive() public {
        vm.prank(streamCreator);
        vm.expectRevert('stream active');
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });
    }

    function test_canCreateNewStreamIfPreviousStreamEnded() public {
        for (uint i; i < 20; i++) {
            forwardOneDay();
        }

        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });
    }

    function test_canCreateNewStreamIfPreviousStreamWasCanceled() public {
        vm.prank(streamCreator);
        nounsToken.approve(address(escrow), 1);
        vm.prank(streamCreator);
        escrow.cancelStream(1);

        // transfer noun back to streamCreator
        vm.prank(nounsRecipient);
        nounsToken.transferFrom(nounsRecipient, streamCreator, 1);

        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });
    }
}

contract CancelStreamTest is BaseStreamEscrowTest {
    function setUp() public virtual override {
        super.setUp();
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });
        vm.prank(streamCreator);
        nounsToken.transferFrom(streamCreator, user, 1);
    }

    function test_onlyNounOwnerCanCancel() public {
        vm.expectRevert('ERC721: transfer caller is not owner nor approved');
        escrow.cancelStream(1);

        // must approve first
        vm.prank(user);
        nounsToken.approve(address(escrow), 1);

        vm.expectRevert('ERC721: transfer of token that is not own');
        escrow.cancelStream(1);

        // still has to be called by the owner
        vm.prank(user);
        escrow.cancelStream(1);
    }

    function test_cancelImmediately() public {
        // cancel stream
        vm.prank(user);
        nounsToken.approve(address(escrow), 1);
        vm.prank(user);
        escrow.cancelStream(1);

        // check that nothing was streamed
        assertEq(ethRecipient.balance, 0 ether);

        // check that user was refunded
        assertEq(user.balance, 10 ether);

        // check that noun was transfered
        assertEq(nounsToken.ownerOf(1), nounsRecipient);

        // check that stream is no longer active
        assertFalse(escrow.isStreamActive(1));

        // forward days and test no more eth is streamed
        for (uint i; i < 20; i++) {
            forwardOneDay();
        }
        assertEq(ethRecipient.balance, 0 ether);
    }

    function test_cancelMidStream() public {
        // forward 5 days, quarter way through the stream
        for (uint i; i < 5; i++) {
            forwardOneDay();
        }

        // cancel stream
        vm.prank(user);
        nounsToken.approve(address(escrow), 1);
        vm.prank(user);
        escrow.cancelStream(1);

        // check streamed amount
        assertEq(ethRecipient.balance, 2.5 ether);

        // check user was refunded
        assertEq(user.balance, 7.5 ether);

        assertEq(nounsToken.ownerOf(1), nounsRecipient);
        assertFalse(escrow.isStreamActive(1));

        // forward days and test no more eth is streamed
        for (uint i; i < 20; i++) {
            forwardOneDay();
        }
        assertEq(ethRecipient.balance, 2.5 ether);
    }

    function test_cancelFailsAfterStreamEnds() public {
        // forward until stream ends
        for (uint i; i < 20; i++) {
            forwardOneDay();
        }

        // try to cancel stream
        vm.prank(user);
        nounsToken.approve(address(escrow), 1);
        vm.expectRevert('stream not active');
        vm.prank(user);
        escrow.cancelStream(1);
    }

    function test_cantCancelAlreadyCanceledStream() public {
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

        vm.expectRevert('stream not active');
        vm.prank(user);
        escrow.cancelStream(1);
    }
}

contract StreamEscrowTest is BaseStreamEscrowTest {
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
