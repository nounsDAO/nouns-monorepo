// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { Noracle } from '../../contracts/libs/Noracle.sol';

contract NoracleTest is Test {
    using Noracle for Noracle.NoracleState;

    Noracle.NoracleState state;

    function setUp() public {
        vm.warp(Noracle.WARMUP_TIMESTAMP + 1);
    }

    function test_initialize_revertsOnRepeatAttempt() public {
        state.initialize();

        vm.expectRevert(abi.encodeWithSelector(Noracle.AlreadyInitialized.selector));
        state.initialize();
    }

    function test_grow_revertsWheNotInitialized() public {
        vm.expectRevert(abi.encodeWithSelector(Noracle.NotInitialized.selector));
        state.grow(42);
    }

    function test_write_doesntRevertsWheNotInitialized() public {
        state.write(uint32(block.timestamp), 142, 69, address(0xdead));
    }

    function test_writeObserve_cardinality1_worksWithOneWrite() public {
        state.initialize();
        state.write(uint32(block.timestamp), 142, 69, address(0xdead));

        Noracle.Observation[] memory observations = state.observe(1);

        assertEq(observations.length, 1);
        assertEq(observations[0].blockTimestamp, block.timestamp);
        assertEq(observations[0].nounId, 142);
        assertEq(observations[0].amount, 69);
        assertEq(observations[0].winner, address(0xdead));
    }

    function test_writeObserve_cardinality1_preserves8DecimalsUnderUint48MaxValue() public {
        state.initialize();

        // amount is uint48; maxValue - 1 = 281474976710655
        // at 8 decimal points it's 2814749.76710655
        state.write(
            uint32(block.timestamp),
            142,
            Noracle.ethPriceToUint48(2814749.76710655999999 ether),
            address(0xdead)
        );

        Noracle.Observation[] memory observations = state.observe(1);

        assertEq(observations.length, 1);
        assertEq(observations[0].blockTimestamp, block.timestamp);
        assertEq(observations[0].nounId, 142);
        assertEq(observations[0].amount, 281474976710655);
        assertEq(observations[0].winner, address(0xdead));
    }

    function test_writeObserve_cardinality1_secondWriteOverrides() public {
        state.initialize();
        state.write(uint32(block.timestamp), 142, 69, address(0xdead));
        state.write(uint32(block.timestamp + 1), 143, 70, address(0x1234));

        Noracle.Observation[] memory observations = state.observe(1);

        assertEq(observations.length, 1);
        assertEq(observations[0].blockTimestamp, block.timestamp + 1);
        assertEq(observations[0].nounId, 143);
        assertEq(observations[0].amount, 70);
        assertEq(observations[0].winner, address(0x1234));

        vm.expectRevert(abi.encodeWithSelector(Noracle.AuctionCountOutOfBounds.selector, 2, 1));
        state.observe(2);
    }

    function test_writeObserve_cadinality2_secondWriteDoesNotOverride() public {
        state.initialize();
        state.write(uint32(block.timestamp), 142, 69, address(0xdead));
        state.grow(2);
        state.write(uint32(block.timestamp + 1), 143, 70, address(0x1234));

        Noracle.Observation[] memory observations = state.observe(2);
        assertEq(observations.length, 2);

        assertEq(observations[0].blockTimestamp, block.timestamp + 1);
        assertEq(observations[0].nounId, 143);
        assertEq(observations[0].amount, 70);
        assertEq(observations[0].winner, address(0x1234));

        assertEq(observations[1].blockTimestamp, block.timestamp);
        assertEq(observations[1].nounId, 142);
        assertEq(observations[1].amount, 69);
        assertEq(observations[1].winner, address(0xdead));
    }

    function test_observe_returnsEmptyArrayGivenNoWrites() public {
        state.initialize();

        Noracle.Observation[] memory observations = state.observe(1);

        assertEq(observations.length, 0);
    }

    function test_observe_trimsObervationsArrayGivenHighCardinalityWithManyEmptySlots() public {
        state.initialize();
        state.write(uint32(block.timestamp), 142, 69, address(0xdead));
        state.grow(1_000);
        state.write(uint32(block.timestamp + 1), 143, 70, address(0x1234));

        Noracle.Observation[] memory observations = state.observe(500);

        assertEq(state.cardinality, 1_000);
        assertEq(observations.length, 2);
    }
}