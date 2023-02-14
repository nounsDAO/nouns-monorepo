// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { SigUtils, ERC1271Stub } from './helpers/SigUtils.sol';
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

    event ProposalCreated(
        uint256 id,
        address proposer,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        uint256 startBlock,
        uint256 endBlock,
        string description
    );

    event ProposalCreatedWithRequirements(
        uint256 id,
        address proposer,
        address[] signers,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        uint256 startBlock,
        uint256 endBlock,
        uint256 proposalThreshold,
        uint256 quorumVotes,
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

    function expectNewPropEvents(
        NounsDAOV3Proposals.ProposalTxs memory txs,
        address expectedProposer,
        uint256 expectedPropId,
        uint256 expectedPropThreshold,
        uint256 expectedMinQuorumVotes,
        address[] memory expectedSigners
    ) internal {
        uint256 expectedStartBlock = block.number + proposalUpdatablePeriodInBlocks + VOTING_DELAY;
        uint256 expectedEndBlock = expectedStartBlock + VOTING_PERIOD;

        vm.expectEmit(true, true, true, true);
        emit ProposalCreated(
            expectedPropId,
            expectedProposer,
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            expectedStartBlock,
            expectedEndBlock,
            'description'
        );

        vm.expectEmit(true, true, true, true);
        emit ProposalCreatedWithRequirements(
            expectedPropId,
            expectedProposer,
            expectedSigners,
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            expectedStartBlock,
            expectedEndBlock,
            expectedPropThreshold,
            expectedMinQuorumVotes,
            'description'
        );
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

contract NounsDAOLogicV3_ProposeBySigs_Test is NounsDAOLogicV3Test {
    address proposerWithVote = makeAddr('proposerWithVote');
    address proposerWithNoVotes = makeAddr('proposerWithNoVotes');
    address signerWithNoVotes;
    uint256 signerWithNoVotesPK;
    address signerWithVote1;
    uint256 signerWithVote1PK;
    address signerWithVote2;
    uint256 signerWithVote2PK;

    function setUp() public override {
        super.setUp();

        (signerWithNoVotes, signerWithNoVotesPK) = makeAddrAndKey('signerWithNoVotes');
        (signerWithVote1, signerWithVote1PK) = makeAddrAndKey('signerWithVote1');
        (signerWithVote2, signerWithVote2PK) = makeAddrAndKey('signerWithVote2');

        vm.prank(address(timelock));
        dao._setProposalThresholdBPS(1_000);

        vm.startPrank(minter);
        nounsToken.mint();
        nounsToken.transferFrom(minter, proposerWithVote, 1);
        nounsToken.mint();
        nounsToken.transferFrom(minter, signerWithVote1, 2);
        nounsToken.mint();
        nounsToken.transferFrom(minter, signerWithVote2, 3);
        vm.roll(block.number + 1);
        vm.stopPrank();
    }

    function test_givenNoSigs_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](0);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.MustProvideSignatures.selector));
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenCanceledSig_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, '', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        vm.prank(signerWithVote1);
        dao.cancelSig(proposerSignatures[0].sig);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.SignatureIsCancelled.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenExpireddSig_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp - 1;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, '', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.SignatureExpired.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, '');
    }

    function test_givenSigOnDifferentDescription_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(
                proposerWithVote,
                signerWithVote1PK,
                txs,
                'different sig description',
                expirationTimestamp,
                address(dao)
            ),
            signerWithVote1,
            expirationTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(
            proposerSignatures,
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            'prop description'
        );
    }

    function test_givenSigOnDifferentTargets_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        txs.targets[0] = makeAddr('different target');

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSigOnDifferentValues_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        txs.values[0] = 42;

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSigOnDifferentSignatures_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        txs.signatures[0] = 'different signature';

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSigOnDifferentCalldatas_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        txs.calldatas[0] = 'different calldatas';

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSigOnDifferentExpiration_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        proposerSignatures[0].expirationTimestamp = expirationTimestamp + 1;

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSigOnDifferentSigner_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        proposerSignatures[0].signer = makeAddr('different signer than sig');

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSigOnDifferentDomainName_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(
                proposerWithVote,
                signerWithVote1PK,
                txs,
                'description',
                expirationTimestamp,
                address(dao),
                'different domain name'
            ),
            signerWithVote1,
            expirationTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSigOnDifferentVerifyingContract_reverts() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(
                proposerWithVote,
                signerWithVote1PK,
                txs,
                'description',
                expirationTimestamp,
                makeAddr('different verifying contract')
            ),
            signerWithVote1,
            expirationTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenERC1271CheckReturnsFalse_reverts() public {
        ERC1271Stub erc1271 = new ERC1271Stub();
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            address(erc1271),
            expirationTimestamp
        );
        erc1271.setResponse(keccak256(proposerSignatures[0].sig), false);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.InvalidSignature.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenSignerWithAnActiveProp_reverts() public {
        propose(signerWithVote1, makeAddr('target'), 0, '', '', '');

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.ProposerAlreadyHasALiveProposal.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenProposerWithAnActiveProp_reverts() public {
        propose(proposerWithVote, makeAddr('target'), 0, '', '', '');

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOV3Proposals.ProposerAlreadyHasALiveProposal.selector));
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenProposerAndSignerWithVotesButBelowThreshold_reverts() public {
        // Minting to push proposer and signer below threshold
        vm.startPrank(minter);
        for (uint256 i = 0; i < 16; ++i) {
            nounsToken.mint();
        }
        vm.roll(block.number + 1);
        vm.stopPrank();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        vm.expectRevert('NounsDAO::propose: proposer votes below proposal threshold');
        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenProposerWithEnoughVotesAndSignerWithNoVotes_worksAndEmitsEvents() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithNoVotesPK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithNoVotes,
            expirationTimestamp
        );

        address[] memory expectedSigners = new address[](1);
        expectedSigners[0] = signerWithNoVotes;
        expectNewPropEvents(txs, proposerWithVote, dao.proposalCount() + 1, 0, 0, expectedSigners);

        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenProposerAndSignerWithEnoughVotesCombined_worksAndEmitsEvents() public {
        // Minting to push proposer below threshold, while combined with signer they have enough
        vm.startPrank(minter);
        for (uint256 i = 0; i < 6; ++i) {
            nounsToken.mint();
        }
        vm.roll(block.number + 1);
        vm.stopPrank();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithVote, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        address[] memory expectedSigners = new address[](1);
        expectedSigners[0] = signerWithVote1;
        expectNewPropEvents(txs, proposerWithVote, dao.proposalCount() + 1, 1, 0, expectedSigners);

        vm.prank(proposerWithVote);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenProposerWithNoVotesAndSignerWithEnoughVotes_worksAndEmitsEvents() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithNoVotes, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );

        address[] memory expectedSigners = new address[](1);
        expectedSigners[0] = signerWithVote1;
        expectNewPropEvents(txs, proposerWithNoVotes, dao.proposalCount() + 1, 0, 0, expectedSigners);

        vm.prank(proposerWithNoVotes);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenProposerWithNoVotesAndTwoSignersWithEnoughVotes_worksAndEmitsEvents() public {
        // Minting to push a single signer below threshold
        vm.startPrank(minter);
        for (uint256 i = 0; i < 6; ++i) {
            nounsToken.mint();
        }
        vm.roll(block.number + 1);
        vm.stopPrank();

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](2);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithNoVotes, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote1,
            expirationTimestamp
        );
        proposerSignatures[1] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithNoVotes, signerWithVote2PK, txs, 'description', expirationTimestamp, address(dao)),
            signerWithVote2,
            expirationTimestamp
        );

        address[] memory expectedSigners = new address[](2);
        expectedSigners[0] = signerWithVote1;
        expectedSigners[1] = signerWithVote2;
        expectNewPropEvents(txs, proposerWithNoVotes, dao.proposalCount() + 1, 1, 0, expectedSigners);

        vm.prank(proposerWithNoVotes);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    function test_givenProposerWithNoVotesAndERC1271SignerWithEnoughVotes_worksAndEmitsEvents() public {
        ERC1271Stub erc1271 = new ERC1271Stub();
        vm.prank(signerWithVote1);
        nounsToken.delegate(address(erc1271));
        vm.roll(block.number + 1);

        NounsDAOV3Proposals.ProposalTxs memory txs = makeTxs(makeAddr('target'), 0, '', '');
        uint256 expirationTimestamp = block.timestamp + 1234;
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures = new NounsDAOStorageV3.ProposerSignature[](1);
        proposerSignatures[0] = NounsDAOStorageV3.ProposerSignature(
            signProposal(proposerWithNoVotes, signerWithVote1PK, txs, 'description', expirationTimestamp, address(dao)),
            address(erc1271),
            expirationTimestamp
        );

        erc1271.setResponse(keccak256(proposerSignatures[0].sig), true);

        address[] memory expectedSigners = new address[](1);
        expectedSigners[0] = address(erc1271);
        expectNewPropEvents(txs, proposerWithNoVotes, dao.proposalCount() + 1, 0, 0, expectedSigners);

        vm.prank(proposerWithNoVotes);
        dao.proposeBySigs(proposerSignatures, txs.targets, txs.values, txs.signatures, txs.calldatas, 'description');
    }

    // TODO tests
    // test for event
}
