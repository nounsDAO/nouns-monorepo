// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicV3BaseTest } from './NounsDAOLogicV3BaseTest.sol';
import { NounsDAOV3Votes } from '../../../contracts/governance/NounsDAOV3Votes.sol';
import { NounsDAOStorageV3 } from '../../../contracts/governance/NounsDAOInterfaces.sol';

contract NounsDAOLogicV3VotesTest is NounsDAOLogicV3BaseTest {
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
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.ObjectionPeriod);

        vm.expectRevert(NounsDAOV3Votes.CanOnlyVoteAgainstDuringObjectionPeriod.selector);
        vm.prank(voter);
        dao.castVote(proposalId, 1);
    }

    function test_givenStateUpdatable_reverts() public {
        vm.startPrank(voter);
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Updatable);

        vm.expectRevert('NounsDAO::castVoteInternal: voting is closed');
        dao.castVote(proposalId, 1);
    }

    function test_givenStatePending_reverts() public {
        vm.startPrank(voter);

        vm.roll(block.number + dao.proposalUpdatablePeriodInBlocks() + 1);
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Pending);

        vm.expectRevert('NounsDAO::castVoteInternal: voting is closed');
        dao.castVote(proposalId, 1);
    }

    function test_givenStateDefeated_reverts() public {
        vm.startPrank(voter);

        vm.roll(block.number + dao.proposalUpdatablePeriodInBlocks() + dao.votingDelay() + dao.votingPeriod() + 1);
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Defeated);

        vm.expectRevert('NounsDAO::castVoteInternal: voting is closed');
        dao.castVote(proposalId, 1);
    }

    function test_givenStateSucceeded_reverts() public {
        vm.startPrank(voter);

        vm.roll(block.number + dao.proposalUpdatablePeriodInBlocks() + dao.votingDelay() + 1);
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Active);

        dao.castVote(proposalId, 1);

        vm.roll(block.number + dao.votingPeriod());
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Succeeded);

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
