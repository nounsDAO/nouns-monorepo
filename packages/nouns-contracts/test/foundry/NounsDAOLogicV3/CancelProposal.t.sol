// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV3BaseTest } from './NounsDAOLogicV3BaseTest.sol';
import { NounsDAOStorageV3 } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOV3Proposals } from '../../../contracts/governance/NounsDAOV3Proposals.sol';

abstract contract ZeroState is NounsDAOLogicV3BaseTest {
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
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOStorageV3.ProposalState.Canceled));
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

        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOStorageV3.ProposalState.Updatable));
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
        vm.expectRevert(NounsDAOV3Proposals.CantCancelProposalAtFinalState.selector);
        vm.prank(proposer);
        dao.cancel(proposalId);
    }
}

contract ProposalUpdatableStateTest is ProposalUpdatableState, IsCancellable {
    function setUp() public override(ProposalUpdatableState, NounsDAOLogicV3BaseTest) {
        ProposalUpdatableState.setUp();
    }
}

abstract contract ProposalPendingState is ProposalUpdatableState {
    function setUp() public virtual override {
        super.setUp();

        vm.roll(dao.proposalsV3(proposalId).updatePeriodEndBlock + 1);
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOStorageV3.ProposalState.Pending));
    }
}

contract ProposalPendingStateTest is ProposalPendingState, IsCancellable {
    function setUp() public override(ProposalPendingState, NounsDAOLogicV3BaseTest) {
        ProposalPendingState.setUp();
    }
}

abstract contract ProposalActiveState is ProposalPendingState {
    function setUp() public virtual override {
        super.setUp();

        vm.roll(dao.proposalsV3(proposalId).startBlock + 1);
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOStorageV3.ProposalState.Active));
    }
}

contract ProposalActiveStateTest is ProposalActiveState, IsCancellable {
    function setUp() public override(ProposalActiveState, NounsDAOLogicV3BaseTest) {
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
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOStorageV3.ProposalState.ObjectionPeriod));
    }
}

contract ProposalObjectionPeriodStateTest is ProposalObjectionPeriodState, IsCancellable {
    function setUp() public override(ProposalObjectionPeriodState, NounsDAOLogicV3BaseTest) {
        ProposalObjectionPeriodState.setUp();
    }
}

abstract contract ProposalSucceededState is ProposalActiveState {
    function setUp() public virtual override {
        super.setUp();

        vm.prank(proposer);
        dao.castVote(proposalId, 1);

        vm.roll(dao.proposalsV3(proposalId).endBlock + 1);
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOStorageV3.ProposalState.Succeeded));
    }
}

contract ProposalSucceededStateTest is ProposalSucceededState, IsCancellable {
    function setUp() public override(ProposalSucceededState, NounsDAOLogicV3BaseTest) {
        ProposalSucceededState.setUp();
    }
}

abstract contract ProposalQueuedState is ProposalSucceededState {
    function setUp() public virtual override {
        super.setUp();

        dao.queue(proposalId);
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOStorageV3.ProposalState.Queued));
    }
}

contract ProposalQueuedStateTest is ProposalQueuedState, IsCancellable {
    function setUp() public override(ProposalQueuedState, NounsDAOLogicV3BaseTest) {
        ProposalQueuedState.setUp();
    }
}

abstract contract ProposalExecutedState is ProposalQueuedState {
    function setUp() public virtual override {
        super.setUp();

        vm.warp(dao.proposalsV3(proposalId).eta + 1);
        dao.execute(proposalId);
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOStorageV3.ProposalState.Executed));
    }
}

contract ProposalExecutedStateTest is ProposalExecutedState, IsNotCancellable {
    function setUp() public override(ProposalExecutedState, NounsDAOLogicV3BaseTest) {
        ProposalExecutedState.setUp();
    }
}

abstract contract ProposalDefeatedState is ProposalActiveState {
    function setUp() public virtual override {
        super.setUp();

        vm.roll(dao.proposalsV3(proposalId).endBlock + 1);
        assertEq(uint256(dao.state(proposalId)), uint256(NounsDAOStorageV3.ProposalState.Defeated));
    }
}

contract ProposalDefeatedStateTest is ProposalDefeatedState, IsNotCancellable {
    function setUp() public override(ProposalDefeatedState, NounsDAOLogicV3BaseTest) {
        ProposalDefeatedState.setUp();
    }
}
