// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOLogicBaseTest } from './NounsDAOLogicBaseTest.sol';
import { NounsDAOTypes } from '../../../contracts/governance/NounsDAOInterfaces.sol';

contract ProposeTest is NounsDAOLogicBaseTest {
    address proposer = makeAddr('proposer');

    function setUp() public override {
        super.setUp();

        vm.prank(address(dao.timelock()));
        dao._setProposalThresholdBPS(1_000);

        for (uint256 i = 0; i < 10; i++) {
            mintTo(proposer);
        }
    }

    function testEmits_ProposalCreated_and_ProposalCreatedWithRequirements() public {
        address[] memory targets = new address[](1);
        targets[0] = makeAddr('target');
        uint256[] memory values = new uint256[](1);
        values[0] = 42;
        string[] memory signatures = new string[](1);
        signatures[0] = 'some signature';
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = '';

        uint256 updatablePeriodEndBlock = block.number + dao.proposalUpdatablePeriodInBlocks();
        uint256 startBlock = updatablePeriodEndBlock + dao.votingDelay();
        uint256 endBlock = startBlock + dao.votingPeriod();

        vm.expectEmit(true, true, true, true);
        emit ProposalCreated(
            1,
            proposer,
            targets,
            values,
            signatures,
            calldatas,
            startBlock,
            endBlock,
            'some description'
        );

        vm.expectEmit(true, true, true, true);
        emit ProposalCreatedWithRequirements(
            1,
            new address[](0),
            updatablePeriodEndBlock,
            1, // prop threshold
            dao.minQuorumVotes(),
            0 // clientId
        );

        vm.prank(proposer);

        dao.propose(targets, values, signatures, calldatas, 'some description');
    }
}

contract ProposalDataForRewardsTest is NounsDAOLogicBaseTest {
    address proposer = makeAddr('proposer');
    address voter = makeAddr('voter');

    function setUp() public override {
        super.setUp();

        vm.prank(address(dao.timelock()));
        dao._setProposalThresholdBPS(1_000);

        for (uint256 i = 0; i < 10; i++) {
            mintTo(proposer);
        }

        for (uint256 i = 0; i < 3; i++) {
            mintTo(voter);
        }
    }

    function test_returnsData() public {
        uint256 proposalId = propose(proposer, address(1), 0, '', '', 'proposal', 123);
        uint32[] memory emptyArray = new uint32[](0);

        NounsDAOTypes.ProposalForRewards[] memory data = dao.proposalDataForRewards({
            firstProposalId: proposalId,
            lastProposalId: proposalId,
            proposalEligibilityQuorumBps: 0,
            excludeCanceled: false,
            requireVotingEnded: false,
            votingClientIds: emptyArray
        });

        assertEq(data[0].clientId, 123);
        assertEq(data[0].creationTimestamp, block.timestamp);
    }

    function test_excludesCanceledProposalsIfFlagIsOn() public {
        uint256 proposalId = propose(proposer, address(1), 0, '', '', 'proposal', 123);

        vm.prank(proposer);
        dao.cancel(proposalId);

        uint32[] memory emptyArray = new uint32[](0);
        NounsDAOTypes.ProposalForRewards[] memory data = dao.proposalDataForRewards({
            firstProposalId: proposalId,
            lastProposalId: proposalId,
            proposalEligibilityQuorumBps: 0,
            excludeCanceled: true,
            requireVotingEnded: false,
            votingClientIds: emptyArray
        });

        assertEq(data.length, 0);
    }

    function test_requireVotingEnded_revertsIfVotingNotEnded() public {
        uint256 proposalId = propose(proposer, address(1), 0, '', '', 'proposal', 123);

        uint32[] memory emptyArray = new uint32[](0);
        vm.expectRevert('all proposals must be done with voting');
        dao.proposalDataForRewards({
            firstProposalId: proposalId,
            lastProposalId: proposalId,
            proposalEligibilityQuorumBps: 0,
            excludeCanceled: true,
            requireVotingEnded: true,
            votingClientIds: emptyArray
        });
    }

    function test_requireVotingEnded_doesntRevertIfVotingEnded() public {
        uint256 proposalId = propose(proposer, address(1), 0, '', '', 'proposal', 123);

        vm.roll(dao.proposals(proposalId).endBlock + 1);

        uint32[] memory emptyArray = new uint32[](0);
        dao.proposalDataForRewards({
            firstProposalId: proposalId,
            lastProposalId: proposalId,
            proposalEligibilityQuorumBps: 0,
            excludeCanceled: true,
            requireVotingEnded: true,
            votingClientIds: emptyArray
        });
    }

    function test_includesCanceledProposalsIfFlagIsOff() public {
        uint256 proposalId = propose(proposer, address(1), 0, '', '', 'proposal', 123);

        vm.prank(proposer);
        dao.cancel(proposalId);

        uint32[] memory emptyArray = new uint32[](0);
        NounsDAOTypes.ProposalForRewards[] memory data = dao.proposalDataForRewards({
            firstProposalId: proposalId,
            lastProposalId: proposalId,
            proposalEligibilityQuorumBps: 0,
            excludeCanceled: false,
            requireVotingEnded: false,
            votingClientIds: emptyArray
        });

        assertEq(data.length, 1);
    }

    function test_filtersProposalsBasedOnQuorum() public {
        uint256 proposalId = propose(proposer, address(1), 0, '', '', 'proposal', 123);

        uint32[] memory emptyArray = new uint32[](0);
        NounsDAOTypes.ProposalForRewards[] memory data = dao.proposalDataForRewards({
            firstProposalId: proposalId,
            lastProposalId: proposalId,
            proposalEligibilityQuorumBps: 2000,
            excludeCanceled: false,
            requireVotingEnded: false,
            votingClientIds: emptyArray
        });

        assertEq(data.length, 0);

        vm.roll(dao.proposals(proposalId).startBlock + 1);
        vm.prank(voter);
        dao.castRefundableVote(proposalId, 1);

        data = dao.proposalDataForRewards({
            firstProposalId: proposalId,
            lastProposalId: proposalId,
            proposalEligibilityQuorumBps: 2000,
            excludeCanceled: false,
            requireVotingEnded: false,
            votingClientIds: emptyArray
        });

        assertEq(data.length, 1);
    }
}
