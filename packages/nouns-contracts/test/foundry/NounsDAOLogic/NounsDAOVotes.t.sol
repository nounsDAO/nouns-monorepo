// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicBaseTest } from './NounsDAOLogicBaseTest.sol';
import { NounsDAOVotes } from '../../../contracts/governance/NounsDAOVotes.sol';
import { NounsDAOTypes } from '../../../contracts/governance/NounsDAOInterfaces.sol';

contract NounsDAOLogicVotesTest is NounsDAOLogicBaseTest {
    address proposer = makeAddr('proposer');
    address voter = makeAddr('voter');
    uint256 proposalId;

    function setUp() public override {
        super.setUp();

        mintTo(proposer);
        mintTo(proposer);
        mintTo(voter);

        assertTrue(nounsToken.getCurrentVotes(proposer) > dao.proposalThreshold());
        proposalId = propose(proposer, proposer, 0.01 ether, '', '', '');
    }

    function test_duringObjectionPeriod_givenForVote_reverts() public {
        // go into last minute
        vm.roll(
            block.number +
                dao.proposalUpdatablePeriodInBlocks() +
                dao.votingDelay() +
                dao.votingPeriod() -
                dao.lastMinuteWindowInBlocks() +
                1
        );

        // trigger objection period
        vm.prank(proposer);
        dao.castVote(proposalId, 1);

        // go into objection period
        vm.roll(block.number + dao.lastMinuteWindowInBlocks());
        assertTrue(dao.state(proposalId) == NounsDAOTypes.ProposalState.ObjectionPeriod);

        vm.expectRevert(NounsDAOVotes.CanOnlyVoteAgainstDuringObjectionPeriod.selector);
        vm.prank(voter);
        dao.castVote(proposalId, 1);
    }

    function test_givenStateUpdatable_reverts() public {
        vm.startPrank(voter);
        assertTrue(dao.state(proposalId) == NounsDAOTypes.ProposalState.Updatable);

        vm.expectRevert('NounsDAO::castVoteInternal: voting is closed');
        dao.castVote(proposalId, 1);
    }

    function test_givenStatePending_reverts() public {
        vm.startPrank(voter);

        vm.roll(block.number + dao.proposalUpdatablePeriodInBlocks() + 1);
        assertTrue(dao.state(proposalId) == NounsDAOTypes.ProposalState.Pending);

        vm.expectRevert('NounsDAO::castVoteInternal: voting is closed');
        dao.castVote(proposalId, 1);
    }

    function test_givenStateDefeated_reverts() public {
        vm.startPrank(voter);

        vm.roll(block.number + dao.proposalUpdatablePeriodInBlocks() + dao.votingDelay() + dao.votingPeriod() + 1);
        assertTrue(dao.state(proposalId) == NounsDAOTypes.ProposalState.Defeated);

        vm.expectRevert('NounsDAO::castVoteInternal: voting is closed');
        dao.castVote(proposalId, 1);
    }

    function test_givenStateSucceeded_reverts() public {
        vm.startPrank(voter);

        vm.roll(block.number + dao.proposalUpdatablePeriodInBlocks() + dao.votingDelay() + 1);
        assertTrue(dao.state(proposalId) == NounsDAOTypes.ProposalState.Active);

        dao.castVote(proposalId, 1);

        vm.roll(block.number + dao.votingPeriod());
        assertTrue(dao.state(proposalId) == NounsDAOTypes.ProposalState.Succeeded);

        vm.expectRevert('NounsDAO::castVoteInternal: voting is closed');
        dao.castVote(proposalId, 1);
    }

    function test_givenStateQueued_reverts() public {
        vm.startPrank(voter);

        // Get the proposal to succeeded state
        vm.roll(block.number + dao.proposalUpdatablePeriodInBlocks() + dao.votingDelay() + 1);
        dao.castVote(proposalId, 1);
        vm.roll(block.number + dao.votingPeriod());

        dao.queue(proposalId);

        changePrank(proposer);
        vm.expectRevert('NounsDAO::castVoteInternal: voting is closed');
        dao.castVote(proposalId, 1);
    }
}
