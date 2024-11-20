// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { Test } from 'forge-std/Test.sol';
import { StreamEscrow } from '../../contracts/StreamEscrow.sol';
import { IStreamEscrow } from '../../contracts/interfaces/IStreamEscrow.sol';
import { ERC721Mock } from './helpers/ERC721Mock.sol';
import { ERC20Mock } from './helpers/ERC20Mock.sol';
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
        escrow = new StreamEscrow(treasury, ethRecipient, nounsRecipient, address(nounsToken), streamCreator, 24 hours);

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

    function test_createStream_nounOwner_failsIfNotWhitelisted() public {
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
        vm.expectEmit();
        emit IStreamEscrow.AllowedToCreateStreamChanged(user, true);
        escrow.setAllowedToCreateStream(user, true);

        vm.prank(user);
        escrow.createStream(2, 1000);
    }

    function test_removesAddressFromWhitelist() public {
        vm.prank(treasury);
        escrow.setAllowedToCreateStream(user, true);

        vm.prank(treasury);
        vm.expectEmit();
        emit IStreamEscrow.AllowedToCreateStreamChanged(user, false);
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
    function test_createStreamWithZeroValue_doesntFail() public {
        // just making sure it doesn't break somehow

        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 0 ether }({ nounId: 1, streamLengthInTicks: 20 });

        // forward 30 days
        for (uint i; i < 30; i++) {
            forwardOneDay();
        }
    }

    function test_createStream_emitsEvent() public {
        // create stream
        vm.prank(streamCreator);
        // check that event was emitted
        vm.expectEmit();
        emit IStreamEscrow.StreamCreated(1, 1 ether, 20, 0.05 ether, 0.05 ether, 20);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 1, streamLengthInTicks: 20 });

        forwardOneDay();

        // created another stream
        nounsToken.mint(streamCreator, 2);
        vm.prank(streamCreator);
        vm.expectEmit();
        emit IStreamEscrow.StreamCreated(2, 1 ether, 20, 0.05 ether, 0.1 ether, 21);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 2, streamLengthInTicks: 20 });
    }

    function test_forwardStreams_emitsEvent() public {
        // create stream
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 1, streamLengthInTicks: 20 });

        // forward 1 day
        vm.expectEmit();
        emit IStreamEscrow.StreamsForwarded(1, 0, 0.05 ether, block.timestamp + 24 hours);
        forwardOneDay();

        // forward 18 days
        for (uint i; i < 18; i++) {
            forwardOneDay();
        }

        // forward last day
        vm.expectEmit();
        emit IStreamEscrow.StreamsForwarded(20, 0.05 ether, 0 ether, block.timestamp + 24 hours);
        forwardOneDay();
    }

    function test_singleStreamLifetime() public {
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 1, streamLengthInTicks: 20 });

        // check that nothing has streamed yet
        assertEq(ethRecipient.balance, 0 ether);
        // check state changes
        assertEq(escrow.ethStreamedPerTick(), 0.5 ether);
        assertEq(escrow.getStream(1).lastTick, 20);
        assertEq(escrow.getStream(1).ethPerTick, 0.5 ether);
        assertEq(escrow.getStream(1).canceled, false);

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
        vm.expectEmit();
        emit IStreamEscrow.StreamCanceled(1, 7.5 ether, 0);
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

        // fails even if user gets the noun again
        vm.prank(nounsRecipient);
        nounsToken.transferFrom(nounsRecipient, user, 1);
        vm.prank(user);
        nounsToken.approve(address(escrow), 1);

        vm.expectRevert('stream not active');
        vm.prank(user);
        escrow.cancelStream(1);
    }

    function test_cancelMultipleStreams() public {
        // mint noun 2 to streamCreator
        nounsToken.mint(streamCreator, 2);
        // create stream for noun 2
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 10 ether }({ nounId: 2, streamLengthInTicks: 20 });

        // transfer noun 2 to user
        vm.prank(streamCreator);
        nounsToken.transferFrom(streamCreator, user, 2);

        // cancel both streams
        vm.prank(user);
        nounsToken.setApprovalForAll(address(escrow), true);
        uint256[] memory nounIds = new uint256[](2);
        nounIds[0] = 1;
        nounIds[1] = 2;
        vm.prank(user);
        escrow.cancelStreams(nounIds);

        // check that both streams were canceled
        assertEq(escrow.ethStreamedPerTick(), 0);
    }
}

contract FastForwardStreamTest is BaseStreamEscrowTest {
    function setUp() public virtual override {
        super.setUp();

        // create stream and transfer noun 1 to user
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 1, streamLengthInTicks: 100 });
        vm.prank(streamCreator);
        nounsToken.transferFrom(streamCreator, user, 1);
    }

    function test_onlyOwnerCanFastForward() public {
        vm.expectRevert('not noun owner');
        escrow.fastForwardStream({ nounId: 1, ticksToForward: 20 });

        vm.prank(user);
        vm.expectEmit();
        emit IStreamEscrow.StreamFastForwarded(1, 20, 80, 0.01 ether);
        escrow.fastForwardStream({ nounId: 1, ticksToForward: 20 });
    }

    function test_cantFastForwardACanceledStream() public {
        vm.prank(user);
        nounsToken.approve(address(escrow), 1);
        vm.prank(user);
        escrow.cancelStream(1);

        // transfer noun back to user
        vm.prank(nounsRecipient);
        nounsToken.transferFrom(nounsRecipient, user, 1);

        vm.prank(user);
        vm.expectRevert('stream not active');
        escrow.fastForwardStream({ nounId: 1, ticksToForward: 50 });
    }

    function test_cantFastForwardAStreamThatEnded() public {
        // forward until stream ends
        for (uint i; i < 100; i++) {
            forwardOneDay();
        }

        vm.prank(user);
        vm.expectRevert('stream not active');
        escrow.fastForwardStream({ nounId: 1, ticksToForward: 50 });
    }

    function test_cantFastForwardAStreamThatEndedByFastForwarding() public {
        vm.prank(user);
        escrow.fastForwardStream({ nounId: 1, ticksToForward: 100 });

        vm.prank(user);
        vm.expectRevert('stream not active');
        escrow.fastForwardStream({ nounId: 1, ticksToForward: 1 });
    }

    function test_ticksLargerThanZero() public {
        vm.prank(user);
        vm.expectRevert('ticksToForward must be positive');
        escrow.fastForwardStream({ nounId: 1, ticksToForward: 0 });
    }

    function test_ticksMustBeUnderNumberOfTicksLeftInStream() public {
        // forward 20 days
        for (uint i; i < 20; i++) {
            forwardOneDay();
        }

        vm.prank(user);
        vm.expectRevert('ticksToFoward too large');
        escrow.fastForwardStream({ nounId: 1, ticksToForward: 81 });
    }

    function test_fastForward() public {
        // forward 20 days
        for (uint i; i < 20; i++) {
            forwardOneDay();
        }
        assertEq(ethRecipient.balance, 0.2 ether);

        // fast forward 40 days out of the 80 left
        vm.prank(user);
        escrow.fastForwardStream({ nounId: 1, ticksToForward: 40 });

        assertEq(ethRecipient.balance, 0.6 ether);

        // forward the rest of the days
        for (uint i; i < 40; i++) {
            forwardOneDay();
        }

        // test that the stream ended
        assertEq(ethRecipient.balance, 1 ether);
        assertEq(escrow.ethStreamedPerTick(), 0 ether);
        assertEq(escrow.isStreamActive(1), false);
    }

    function test_fastForwardMaxTicks_finishesStream() public {
        // forward 20 days
        for (uint i; i < 20; i++) {
            forwardOneDay();
        }

        // fast forward 80 days out of the 80 left
        vm.prank(user);
        escrow.fastForwardStream({ nounId: 1, ticksToForward: 80 });

        // test that the stream ended
        assertEq(ethRecipient.balance, 1 ether);
        assertEq(escrow.ethStreamedPerTick(), 0 ether);
        assertEq(escrow.isStreamActive(1), false);
    }
}

contract MultipleStreamsTest is BaseStreamEscrowTest {
    address user2 = makeAddr('user2');
    address user3 = makeAddr('user3');

    function setUp() public virtual override {
        super.setUp();
        nounsToken.mint(streamCreator, 2);
        nounsToken.mint(streamCreator, 3);

        vm.startPrank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 1, streamLengthInTicks: 100 });
        vm.warp(block.timestamp + 24 hours);
        nounsToken.transferFrom(streamCreator, user, 1);

        escrow.forwardAllAndCreateStream{ value: 2 ether }({ nounId: 2, streamLengthInTicks: 100 });
        vm.warp(block.timestamp + 24 hours);
        nounsToken.transferFrom(streamCreator, user2, 2);

        escrow.forwardAllAndCreateStream{ value: 3 ether }({ nounId: 3, streamLengthInTicks: 100 });
        vm.warp(block.timestamp + 24 hours);
        nounsToken.transferFrom(streamCreator, user3, 3);
        vm.stopPrank();
    }

    function test_ethStreamedOverTheNextDays() public {
        // stream 1 = 0.01 eth/tick, streamed for 2 days = 0.02 eth
        // stream 2 = 0.02 eth/tick, streamed for 1 day = 0.02 eth
        // total = 0.04 eth
        assertEq(ethRecipient.balance, 0.04 ether);

        forwardOneDay();

        // stream 1 = 0.01 eth/tick, streamed for 1 day = 0.01 eth
        // stream 2 = 0.02 eth/tick, streamed for 1 day = 0.02 eth
        // stream 3 = 0.03 eth/tick, streamed for 1 day = 0.03 eth
        // total = 0.06 eth (+0.04 ether from previous day)
        assertEq(ethRecipient.balance, 0.1 ether);

        // forward 99 days
        for (uint i; i < 99; i++) {
            forwardOneDay();
        }
        assertEq(ethRecipient.balance, 6 ether);
    }

    function test_oneStreamCanceledMidWay() public {
        assertEq(ethRecipient.balance, 0.04 ether);

        // forward 50 days
        for (uint i; i < 50; i++) {
            forwardOneDay();
        }
        // 50 days streamed = 50 * 0.06 = 3 eth
        assertEq(ethRecipient.balance, 3.04 ether);

        // cancel stream 2
        vm.prank(user2);
        nounsToken.approve(address(escrow), 2);
        vm.prank(user2);
        escrow.cancelStream(2);

        // check user2 refund amount
        // stream 2 has streamed for 51 days, 51 * 0.02 = 1.02 eth, 2 eth - 1.02 eth = 0.98 eth
        assertEq(user2.balance, 0.98 ether);

        // forward 50 days
        for (uint i; i < 50; i++) {
            forwardOneDay();
        }
        // total streamed = 6 - 0.98 = 5.02 eth
        assertEq(ethRecipient.balance, 5.02 ether);
    }
}

contract DAOSettersTest is BaseStreamEscrowTest {
    function test_setDAOExecutorAddress_onlyDAO() public {
        vm.expectRevert('only dao');
        escrow.setDAOExecutorAddress(address(1));
    }

    function test_setDAOExecutorAddress() public {
        vm.prank(treasury);
        vm.expectEmit();
        emit IStreamEscrow.DAOExecutorAddressSet(address(1));
        escrow.setDAOExecutorAddress(address(1));

        assertEq(escrow.daoExecutor(), address(1));

        // treasury can't call setter now
        vm.prank(treasury);
        vm.expectRevert('only dao');
        escrow.setDAOExecutorAddress(address(2));

        // address(1) needs to call it
        vm.prank(address(1));
        escrow.setDAOExecutorAddress(address(2));
    }

    function test_setETHRecipient_onlyDAO() public {
        vm.expectRevert('only dao');
        escrow.setETHRecipient(address(1));
    }

    function test_setETHRecipient() public {
        vm.prank(treasury);
        vm.expectEmit();
        emit IStreamEscrow.ETHRecipientSet(makeAddr('ethRecipient2'));
        escrow.setETHRecipient(makeAddr('ethRecipient2'));

        // create a stream
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 1, streamLengthInTicks: 100 });
        forwardOneDay();

        // test that ethRecipient2 received the eth
        assertEq(makeAddr('ethRecipient2').balance, 0.01 ether);
    }

    function test_setNounsRecipient_onlyDAO() public {
        vm.expectRevert('only dao');
        escrow.setNounsRecipient(address(1));
    }

    function test_setNounsRecipient() public {
        vm.prank(treasury);
        vm.expectEmit();
        emit IStreamEscrow.NounsRecipientSet(makeAddr('nounsRecipient2'));
        escrow.setNounsRecipient(makeAddr('nounsRecipient2'));

        // create a stream
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 1, streamLengthInTicks: 100 });

        // cancel stream
        vm.prank(streamCreator);
        nounsToken.approve(address(escrow), 1);
        vm.prank(streamCreator);
        escrow.cancelStream(1);

        // check that new recipient received the noun
        assertEq(nounsToken.ownerOf(1), makeAddr('nounsRecipient2'));
    }
}

contract RescueTokensTest is BaseStreamEscrowTest {
    ERC20Mock erc20 = new ERC20Mock();

    function setUp() public virtual override {
        super.setUp();
        // send some erc20 tokens to the contract
        erc20.mint(address(escrow), 1000);
    }

    function test_rescueToken_onlyDAO() public {
        vm.expectRevert('only dao');
        escrow.rescueToken(address(erc20), address(123), 1000);
    }

    function test_rescueToken_worksForDAO() public {
        vm.prank(treasury);
        escrow.rescueToken(address(erc20), address(123), 1000);

        assertEq(erc20.balanceOf(address(123)), 1000);
    }
}

contract StreamEscrowGasTest is BaseStreamEscrowTest {
    function setUp() public virtual override {
        super.setUp();
        nounsToken.mint(streamCreator, 2);
        nounsToken.mint(streamCreator, 3);
    }

    // 99430 gas
    function test_createStreamSingleStream() public {
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 1, streamLengthInTicks: 100 });
    }

    // 289916 gas
    function test_createMultipleStreams() public {
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 1, streamLengthInTicks: 100 });
        forwardOneDay();
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 2 ether }({ nounId: 2, streamLengthInTicks: 100 });
        forwardOneDay();
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 3 ether }({ nounId: 3, streamLengthInTicks: 100 });
    }

    // 192163 gas
    function test_cancelStream() public {
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 1, streamLengthInTicks: 100 });
        vm.prank(streamCreator);
        nounsToken.transferFrom(streamCreator, user, 1);

        vm.prank(user);
        nounsToken.approve(address(escrow), 1);
        vm.prank(user);
        escrow.cancelStream(1);
    }

    // 194647 gas
    function test_fastForwardStream() public {
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 1, streamLengthInTicks: 100 });
        vm.prank(streamCreator);
        nounsToken.transferFrom(streamCreator, user, 1);

        vm.prank(user);
        escrow.fastForwardStream({ nounId: 1, ticksToForward: 50 });
    }

    // 152689 gas
    function test_fastForwardStreamMax() public {
        vm.prank(streamCreator);
        escrow.forwardAllAndCreateStream{ value: 1 ether }({ nounId: 1, streamLengthInTicks: 100 });
        vm.prank(streamCreator);
        nounsToken.transferFrom(streamCreator, user, 1);

        vm.prank(user);
        escrow.fastForwardStream({ nounId: 1, ticksToForward: 100 });
    }
}
