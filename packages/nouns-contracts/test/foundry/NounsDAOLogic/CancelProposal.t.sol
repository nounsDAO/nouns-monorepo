// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicBaseTest } from './NounsDAOLogicBaseTest.sol';
import { NounsDAOTypes } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOProposals } from '../../../contracts/governance/NounsDAOProposals.sol';

abstract contract ZeroState is NounsDAOLogicBaseTest {
    address proposer = makeAddr('proposer');
    address rando = makeAddr('rando');
    address otherUser = makeAddr('otherUser');
    uint256 proposalId;

    address target = makeAddr('target');

    event ProposalCanceled(uint256 id);

    function verifyProposerCanCancel() internal {
        vm.expectEmit(true, true, true, true);
        emit ProposalCanceled(proposalId);
        vm.prank(proposer);
        dao.cancel(proposalId);
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOTypes.ProposalState.Canceled));
    }

    function verifyRandoCantCancel() internal {
        vm.expectRevert(bytes('NounsDAO::cancel: proposer above threshold'));
        vm.prank(rando);
        dao.cancel(proposalId);
    }

    function verifyRandoCanCancelIfProposerLosesVotingPower() internal {
        vm.prank(proposer);
        nounsToken.delegate(otherUser);
        vm.roll(block.number + 1);

        vm.prank(rando);
        dao.cancel(proposalId);
    }
}

abstract contract ProposalUpdatableState is ZeroState {
    function setUp() public virtual override {
        super.setUp();

        // mint 1 noun to proposer
        vm.startPrank(minter);
        nounsToken.mint();
        nounsToken.transferFrom(minter, proposer, 1);
        vm.roll(block.number + 1);
        vm.stopPrank();

        proposalId = propose(proposer, target, 0, '', '', '');
        vm.roll(block.number + 1);

        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOTypes.ProposalState.Updatable));
    }
}

abstract contract IsCancellable is ZeroState {
    function test_proposerCanCancel() public {
        verifyProposerCanCancel();
    }

    function test_randoCantCancel() public {
        verifyRandoCantCancel();
    }

    function test_randoCanCancelIfProposerLosesVotingPower() public {
        verifyRandoCanCancelIfProposerLosesVotingPower();
    }
}

abstract contract IsNotCancellable is ZeroState {
    function test_proposerCantCancel() public {
        vm.expectRevert(NounsDAOProposals.CantCancelProposalAtFinalState.selector);
        vm.prank(proposer);
        dao.cancel(proposalId);
    }
}

contract ProposalUpdatableStateTest is ProposalUpdatableState, IsCancellable {
    function setUp() public override(ProposalUpdatableState, NounsDAOLogicBaseTest) {
        ProposalUpdatableState.setUp();
    }
}

abstract contract ProposalPendingState is ProposalUpdatableState {
    function setUp() public virtual override {
        super.setUp();

        vm.roll(dao.proposalsV3(proposalId).updatePeriodEndBlock + 1);
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOTypes.ProposalState.Pending));
    }
}

contract ProposalPendingStateTest is ProposalPendingState, IsCancellable {
    function setUp() public override(ProposalPendingState, NounsDAOLogicBaseTest) {
        ProposalPendingState.setUp();
    }
}

abstract contract ProposalActiveState is ProposalPendingState {
    function setUp() public virtual override {
        super.setUp();

        vm.roll(dao.proposalsV3(proposalId).startBlock + 1);
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOTypes.ProposalState.Active));
    }
}

contract ProposalActiveStateTest is ProposalActiveState, IsCancellable {
    function setUp() public override(ProposalActiveState, NounsDAOLogicBaseTest) {
        ProposalActiveState.setUp();
    }
}

abstract contract ProposalObjectionPeriodState is ProposalActiveState {
    function setUp() public virtual override {
        super.setUp();

        vm.roll(dao.proposalsV3(proposalId).endBlock - 1);
        vm.prank(proposer);
        dao.castVote(proposalId, 1);

        vm.roll(dao.proposalsV3(proposalId).endBlock + 1);
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOTypes.ProposalState.ObjectionPeriod));
    }
}

contract ProposalObjectionPeriodStateTest is ProposalObjectionPeriodState, IsCancellable {
    function setUp() public override(ProposalObjectionPeriodState, NounsDAOLogicBaseTest) {
        ProposalObjectionPeriodState.setUp();
    }
}

abstract contract ProposalSucceededState is ProposalActiveState {
    function setUp() public virtual override {
        super.setUp();

        vm.prank(proposer);
        dao.castVote(proposalId, 1);

        vm.roll(dao.proposalsV3(proposalId).endBlock + 1);
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOTypes.ProposalState.Succeeded));
    }
}

contract ProposalSucceededStateTest is ProposalSucceededState, IsCancellable {
    function setUp() public override(ProposalSucceededState, NounsDAOLogicBaseTest) {
        ProposalSucceededState.setUp();
    }
}

abstract contract ProposalQueuedState is ProposalSucceededState {
    function setUp() public virtual override {
        super.setUp();

        dao.queue(proposalId);
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOTypes.ProposalState.Queued));
    }
}

contract ProposalQueuedStateTest is ProposalQueuedState, IsCancellable {
    function setUp() public override(ProposalQueuedState, NounsDAOLogicBaseTest) {
        ProposalQueuedState.setUp();
    }
}

abstract contract ProposalExecutedState is ProposalQueuedState {
    function setUp() public virtual override {
        super.setUp();

        vm.warp(dao.proposalsV3(proposalId).eta + 1);
        dao.execute(proposalId);
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOTypes.ProposalState.Executed));
    }
}

contract ProposalExecutedStateTest is ProposalExecutedState, IsNotCancellable {
    function setUp() public override(ProposalExecutedState, NounsDAOLogicBaseTest) {
        ProposalExecutedState.setUp();
    }
}

abstract contract ProposalDefeatedState is ProposalActiveState {
    function setUp() public virtual override {
        super.setUp();

        vm.roll(dao.proposalsV3(proposalId).endBlock + 1);
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOTypes.ProposalState.Defeated));
    }
}

contract ProposalDefeatedStateTest is ProposalDefeatedState, IsNotCancellable {
    function setUp() public override(ProposalDefeatedState, NounsDAOLogicBaseTest) {
        ProposalDefeatedState.setUp();
    }
}
