// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { SigUtils } from './helpers/SigUtils.sol';
import { NounsDAOLogicV3 } from '../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOV3Proposals } from '../../contracts/governance/NounsDAOV3Proposals.sol';
import { NounsDAOProxyV3 } from '../../contracts/governance/NounsDAOProxyV3.sol';
import { NounsDAOStorageV3 } from '../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { NounsSeeder } from '../../contracts/NounsSeeder.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsDAOExecutor } from '../../contracts/governance/NounsDAOExecutor.sol';

abstract contract NounsDAOLogicV3Test is Test, DeployUtils, SigUtils {
    event ProposalUpdated(
        uint256 indexed id,
        address indexed proposer,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        string description
    );

    NounsToken nounsToken;
    NounsDAOLogicV3 dao;
    NounsDAOExecutor timelock;

    address noundersDAO = makeAddr('nounders');
    address minter = makeAddr('minter');
    address vetoer = makeAddr('vetoer');
    uint32 lastMinuteWindowInBlocks = 10;
    uint32 objectionPeriodDurationInBlocks = 10;
    uint32 proposalUpdatablePeriodInBlocks = 10;
    uint256 voteSnapshotBlockSwitchProposalId;

    function setUp() public virtual {
        timelock = new NounsDAOExecutor(address(1), TIMELOCK_DELAY);

        nounsToken = new NounsToken(
            noundersDAO,
            minter,
            _deployAndPopulateV2(),
            new NounsSeeder(),
            IProxyRegistry(address(0))
        );
        nounsToken.transferOwnership(address(timelock));

        dao = NounsDAOLogicV3(
            payable(
                new NounsDAOProxyV3(
                    NounsDAOProxyV3.ProxyParams(address(timelock), address(new NounsDAOLogicV3())),
                    address(timelock),
                    address(nounsToken),
                    vetoer,
                    VOTING_PERIOD,
                    VOTING_DELAY,
                    PROPOSAL_THRESHOLD,
                    NounsDAOStorageV3.DynamicQuorumParams({
                        minQuorumVotesBPS: 200,
                        maxQuorumVotesBPS: 2000,
                        quorumCoefficient: 10000
                    }),
                    lastMinuteWindowInBlocks,
                    objectionPeriodDurationInBlocks,
                    proposalUpdatablePeriodInBlocks,
                    voteSnapshotBlockSwitchProposalId
                )
            )
        );

        vm.prank(address(timelock));
        timelock.setPendingAdmin(address(dao));
        vm.prank(address(dao));
        timelock.acceptAdmin();
    }

    function propose(
        address proposer,
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        string memory description
    ) internal returns (uint256 proposalId) {
        vm.prank(proposer);
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        proposalId = dao.propose(targets, values, signatures, calldatas, description);
    }

    function updateProposal(
        address proposer,
        uint256 proposalId,
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        string memory description
    ) internal {
        vm.prank(proposer);
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        dao.updateProposal(proposalId, targets, values, signatures, calldatas, description);
    }

    function proposeBySigs(
        address proposer,
        address signer,
        uint256 signerPK,
        NounsDAOV3Proposals.ProposalTxs memory txs,
        string memory description,
        uint256 expirationTimestamp
    ) internal returns (uint256 proposalId) {
        vm.prank(proposer);
        NounsDAOStorageV3.ProposerSignature[] memory sigs = new NounsDAOStorageV3.ProposerSignature[](1);
        sigs[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposer, signerPK, txs, description, expirationTimestamp, address(dao)),
            signer,
            expirationTimestamp
        );

        proposalId = dao.proposeBySigs(sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, description);
    }

    function makeTxs(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data
    ) internal pure returns (NounsDAOV3Proposals.ProposalTxs memory) {
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        return NounsDAOV3Proposals.ProposalTxs(targets, values, signatures, calldatas);
    }
}

contract NounsDAOLogicV3_UpdateProposal_Test is NounsDAOLogicV3Test {
    address proposer = makeAddr('proposer');
    uint256 proposalId;

    function setUp() public override {
        super.setUp();

        vm.startPrank(minter);
        nounsToken.mint();
        nounsToken.transferFrom(minter, proposer, 1);
        vm.roll(block.number + 1);
        vm.stopPrank();

        proposalId = propose(proposer, makeAddr('target'), 0, '', '', '');
        vm.roll(block.number + 1);
    }

    function test_givenProposalDoesntExist_reverts() public {
        vm.expectRevert('NounsDAO::state: invalid proposal id');
        updateProposal(proposer, proposalId + 1, makeAddr('target'), 0, '', '', '');
    }

    function test_givenNoTxs_reverts() public {
        address[] memory targets = new address[](0);
        uint256[] memory values = new uint256[](0);
        string[] memory signatures = new string[](0);
        bytes[] memory calldatas = new bytes[](0);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.MustProvideActions.selector));
        vm.prank(proposer);
        dao.updateProposal(proposalId, targets, values, signatures, calldatas, '');
    }

    function test_givenTooManyTxs_reverts() public {
        address[] memory targets = new address[](11);
        uint256[] memory values = new uint256[](11);
        string[] memory signatures = new string[](11);
        bytes[] memory calldatas = new bytes[](11);
        for (uint256 i = 0; i < 11; ++i) {
            targets[i] = makeAddr('target');
            values[i] = i;
            signatures[i] = '';
            calldatas[i] = '';
        }

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.TooManyActions.selector));
        vm.prank(proposer);
        dao.updateProposal(proposalId, targets, values, signatures, calldatas, '');
    }

    function test_givenTxsWithArityMismatch_reverts() public {
        address[] memory targets = new address[](1);
        targets[0] = makeAddr('target');
        uint256[] memory values = new uint256[](0);
        string[] memory signatures = new string[](0);
        bytes[] memory calldatas = new bytes[](0);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.ProposalInfoArityMismatch.selector));
        vm.prank(proposer);
        dao.updateProposal(proposalId, targets, values, signatures, calldatas, '');
    }

    function test_givenMsgSenderNotProposer_reverts() public {
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.OnlyProposerCanEdit.selector));
        updateProposal(makeAddr('not proposer'), proposalId, makeAddr('target'), 0, '', '', '');
    }

    function test_givenPropWithSigners_reverts() public {
        vm.prank(proposer);
        dao.cancel(proposalId);
        (address signer, uint256 signerPK) = makeAddrAndKey('signer');
        uint256 expirationTimestamp = block.timestamp + 1234;
        uint256 propId = proposeBySigs(
            proposer,
            signer,
            signerPK,
            makeTxs(makeAddr('target'), 0, '', ''),
            'description',
            expirationTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.ProposerCannotUpdateProposalWithSigners.selector));
        updateProposal(proposer, propId, makeAddr('target'), 1, '', '', 'description');
    }

    function test_givenStatesPendingActiveSucceededQueuedAndExecuted_reverts() public {
        // Pending
        vm.roll(block.number + proposalUpdatablePeriodInBlocks);
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Pending);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.CanOnlyEditUpdatableProposals.selector));
        updateProposal(proposer, proposalId, makeAddr('target'), 0, '', '', '');

        // Active
        vm.roll(block.number + VOTING_DELAY);
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Active);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.CanOnlyEditUpdatableProposals.selector));
        updateProposal(proposer, proposalId, makeAddr('target'), 0, '', '', '');

        // Succeeded
        vm.prank(proposer);
        dao.castVote(proposalId, 1);
        vm.roll(block.number + VOTING_PERIOD);
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Succeeded);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.CanOnlyEditUpdatableProposals.selector));
        updateProposal(proposer, proposalId, makeAddr('target'), 0, '', '', '');

        // Queued
        dao.queue(proposalId);
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Queued);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.CanOnlyEditUpdatableProposals.selector));
        updateProposal(proposer, proposalId, makeAddr('target'), 0, '', '', '');

        // Executed
        vm.warp(block.timestamp + TIMELOCK_DELAY);
        dao.execute(proposalId);
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Executed);
        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.CanOnlyEditUpdatableProposals.selector));
        updateProposal(proposer, proposalId, makeAddr('target'), 0, '', '', '');
    }

    function test_givenStateCanceled_reverts() public {
        vm.prank(proposer);
        dao.cancel(proposalId);
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Canceled);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.CanOnlyEditUpdatableProposals.selector));
        updateProposal(proposer, proposalId, makeAddr('target'), 0, '', '', '');
    }

    function test_givenStateDefeated_reverts() public {
        vm.roll(block.number + proposalUpdatablePeriodInBlocks + VOTING_DELAY);
        vm.prank(proposer);
        dao.castVote(proposalId, 0);
        vm.roll(block.number + VOTING_PERIOD);
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Defeated);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.CanOnlyEditUpdatableProposals.selector));
        updateProposal(proposer, proposalId, makeAddr('target'), 0, '', '', '');
    }

    function test_givenStateExpired_reverts() public {
        vm.roll(block.number + proposalUpdatablePeriodInBlocks + VOTING_DELAY);
        vm.prank(proposer);
        dao.castVote(proposalId, 1);
        vm.roll(block.number + VOTING_PERIOD);
        dao.queue(proposalId);
        vm.warp(block.timestamp + TIMELOCK_DELAY + timelock.GRACE_PERIOD());
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Expired);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.CanOnlyEditUpdatableProposals.selector));
        updateProposal(proposer, proposalId, makeAddr('target'), 0, '', '', '');
    }

    function test_givenStateVetoed_reverts() public {
        vm.prank(vetoer);
        dao.veto(proposalId);
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Vetoed);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.CanOnlyEditUpdatableProposals.selector));
        updateProposal(proposer, proposalId, makeAddr('target'), 0, '', '', '');
    }

    function test_givenStateObjectionPeriod_reverts() public {
        vm.roll(
            block.number + proposalUpdatablePeriodInBlocks + VOTING_DELAY + VOTING_PERIOD - lastMinuteWindowInBlocks
        );
        vm.prank(proposer);
        dao.castVote(proposalId, 1);
        vm.roll(block.number + lastMinuteWindowInBlocks);
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.ObjectionPeriod);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.CanOnlyEditUpdatableProposals.selector));
        updateProposal(proposer, proposalId, makeAddr('target'), 0, '', '', '');
    }

    function test_givenStateUpdatable_updatesTxsAndEmitsEvent() public {
        assertTrue(dao.state(proposalId) == NounsDAOStorageV3.ProposalState.Updatable);
        (
            address[] memory targetsBefore,
            uint256[] memory valuesBefore,
            string[] memory signaturesBefore,
            bytes[] memory calldatasBefore
        ) = dao.getActions(proposalId);
        assertEq(targetsBefore[0], makeAddr('target'));
        assertEq(valuesBefore[0], 0);
        assertEq(signaturesBefore[0], '');
        assertEq(calldatasBefore[0], '');
        NounsDAOV3Proposals.ProposalTxs memory txsAfter = makeTxs(
            makeAddr('targetAfter'),
            1,
            'signatureAfter',
            'dataAfter'
        );

        vm.expectEmit(true, true, true, true);
        emit ProposalUpdated(
            proposalId,
            proposer,
            txsAfter.targets,
            txsAfter.values,
            txsAfter.signatures,
            txsAfter.calldatas,
            'descriptionAfter'
        );
        updateProposal(
            proposer,
            proposalId,
            txsAfter.targets[0],
            txsAfter.values[0],
            txsAfter.signatures[0],
            txsAfter.calldatas[0],
            'descriptionAfter'
        );

        (
            address[] memory targetsAfter,
            uint256[] memory valuesAfter,
            string[] memory signaturesAfter,
            bytes[] memory calldatasAfter
        ) = dao.getActions(proposalId);
        assertEq(targetsAfter[0], makeAddr('targetAfter'));
        assertEq(valuesAfter[0], 1);
        assertEq(signaturesAfter[0], 'signatureAfter');
        assertEq(calldatasAfter[0], 'dataAfter');
    }
}
