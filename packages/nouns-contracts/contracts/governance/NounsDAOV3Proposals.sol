// SPDX-License-Identifier: GPL-3.0

/// @title

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░██░░░████░░██░░░████░░░ *
 * ░░██████░░░████████░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 *********************************/

pragma solidity ^0.8.6;

import './NounsDAOInterfaces.sol';
import { NounsDAOV3DynamicQuorum } from './NounsDAOV3DynamicQuorum.sol';
import { SignatureChecker } from '@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol';

library NounsDAOV3Proposals {
    using NounsDAOV3DynamicQuorum for NounsDAOStorageV3.StorageV3;

    error CantCancelExecutedProposal();
    error ProposalInfoArityMismatch();
    error MustProvideActions();
    error TooManyActions();
    error ProposerAlreadyHasALiveProposal();
    error ProposalSignatureNonceAlreadyUsed();
    error InvalidSignature();
    error SignatureExpired();
    error CanOnlyEditPendingProposals();
    error OnlyProposerCanEdit();
    error ProposerCannotUpdateProposalWithSigners();

    /// @notice An event emitted when a new proposal is created
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

    /// @notice An event emitted when a new proposal is created, which includes additional information
    event ProposalCreatedWithRequirements(
        uint256 id,
        address proposer,
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

    event ProposalUpdated(
        uint256 id,
        address indexed proposer,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        string description
    );

    /// @notice An event emitted when a proposal has been queued in the NounsDAOExecutor
    event ProposalQueued(uint256 id, uint256 eta);

    /// @notice An event emitted when a proposal has been executed in the NounsDAOExecutor
    event ProposalExecuted(uint256 id);

    /// @notice An event emitted when a proposal has been canceled
    event ProposalCanceled(uint256 id);

    struct ProposalTemp {
        uint256 totalSupply;
        uint256 proposalThreshold;
        uint256 latestProposalId;
    }

    // Created to solve stack-too-deep errors
    struct ProposalTxs {
        address[] targets;
        uint256[] values;
        string[] signatures;
        bytes[] calldatas;
    }

    /// @notice The maximum number of actions that can be included in a proposal
    uint256 public constant proposalMaxOperations = 10; // 10 actions

    /**
     * @notice Function used to propose a new proposal. Sender must have delegates above the proposal threshold
     * @param txs Target addresses, eth values, function signatures and calldatas for proposal calls
     * @param description String description of the proposal
     * @return Proposal id of new proposal
     */
    function propose(
        NounsDAOStorageV3.StorageV3 storage ds,
        ProposalTxs memory txs,
        string memory description
    ) internal returns (uint256) {
        ProposalTemp memory temp;
        temp.totalSupply = ds.nouns.totalSupply();
        temp.proposalThreshold = checkPropThreshold(ds, ds.nouns.getPriorVotes(msg.sender, block.number - 1));
        checkProposaTxs(txs);
        checkNoActiveProp(ds, msg.sender);

        ds.proposalCount++;
        NounsDAOStorageV3.Proposal storage newProposal = createNewProposal(
            ds,
            ds.proposalCount,
            temp.proposalThreshold,
            txs
        );
        ds.latestProposalIds[newProposal.proposer] = newProposal.id;

        emitNewPropEvents(newProposal, ds.minQuorumVotes(), txs, description);

        return newProposal.id;
    }

    function proposeBySigs(
        NounsDAOStorageV3.StorageV3 storage ds,
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures,
        uint256 nonce,
        ProposalTxs memory txs,
        string memory description
    ) internal returns (uint256) {
        checkProposaTxs(txs);
        checkNonce(ds, nonce);
        uint256 proposalId = ds.proposalCount = ds.proposalCount + 1;
        bytes32 proposalHash = keccak256(
            abi.encode(msg.sender, nonce, txs.targets, txs.values, txs.signatures, txs.calldatas, description)
        );

        uint256 votes;
        address[] memory signers = new address[](proposerSignatures.length);
        for (uint256 i = 0; i < proposerSignatures.length; ++i) {
            verifyProposalSignature(proposalHash, proposerSignatures[i]);
            address signer = signers[i] = proposerSignatures[i].signer;

            checkNoActiveProp(ds, signer);
            ds.latestProposalIds[signer] = proposalId;

            votes += ds.nouns.getPriorVotes(signer, block.number - 1);
        }

        NounsDAOStorageV3.Proposal storage newProposal = createNewProposal(
            ds,
            proposalId,
            checkPropThreshold(ds, votes),
            txs
        );
        newProposal.signers = signers;

        emitNewPropEvents(newProposal, ds.minQuorumVotes(), txs, description);

        return proposalId;
    }

    function updateProposal(
        NounsDAOStorageV3.StorageV3 storage ds,
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) internal {
        if (
            targets.length != values.length || targets.length != signatures.length || targets.length != calldatas.length
        ) revert ProposalInfoArityMismatch();
        if (targets.length == 0) revert MustProvideActions();
        if (targets.length > proposalMaxOperations) revert TooManyActions();

        NounsDAOStorageV3.Proposal storage proposal = ds._proposals[proposalId];
        if (state(ds, proposalId) != NounsDAOStorageV3.ProposalState.Pending) revert CanOnlyEditPendingProposals();
        if (msg.sender != proposal.proposer) revert OnlyProposerCanEdit();
        if (proposal.signers.length > 0) revert ProposerCannotUpdateProposalWithSigners();

        proposal.targets = targets;
        proposal.values = values;
        proposal.signatures = signatures;
        proposal.calldatas = calldatas;

        emit ProposalUpdated(proposalId, msg.sender, targets, values, signatures, calldatas, description);
    }

    function updateProposalBySigs(
        NounsDAOStorageV3.StorageV3 storage ds,
        uint256 proposalId,
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures,
        uint256 nonce,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) internal {
        checkProposaTxs(ProposalTxs(targets, values, signatures, calldatas));
        checkNonce(ds, nonce);

        NounsDAOStorageV3.Proposal storage proposal = ds._proposals[proposalId];
        if (state(ds, proposalId) != NounsDAOStorageV3.ProposalState.Pending) revert CanOnlyEditPendingProposals();

        address[] memory signers = proposal.signers;
        if (proposerSignatures.length != signers.length) revert OnlyProposerCanEdit();

        bytes32 proposalHash = keccak256(
            abi.encode(msg.sender, nonce, targets, values, signatures, calldatas, description)
        );
        for (uint256 i = 0; i < proposerSignatures.length; ++i) {
            verifyProposalSignature(proposalHash, proposerSignatures[i]);

            // To avoid the gas cost of having to search signers in proposal.signers, we're assuming the sigs we get
            // use the same amount of signers and the same order.
            if (signers[i] != proposerSignatures[i].signer) revert OnlyProposerCanEdit();
        }

        proposal.targets = targets;
        proposal.values = values;
        proposal.signatures = signatures;
        proposal.calldatas = calldatas;

        emit ProposalUpdated(proposalId, msg.sender, targets, values, signatures, calldatas, description);
    }

    /**
     * @notice Queues a proposal of state succeeded
     * @param proposalId The id of the proposal to queue
     */
    function queue(NounsDAOStorageV3.StorageV3 storage ds, uint256 proposalId) external {
        require(
            state(ds, proposalId) == NounsDAOStorageV3.ProposalState.Succeeded,
            'NounsDAO::queue: proposal can only be queued if it is succeeded'
        );
        NounsDAOStorageV3.Proposal storage proposal = ds._proposals[proposalId];
        uint256 eta = block.timestamp + ds.timelock.delay();
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            queueOrRevertInternal(
                ds,
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                eta
            );
        }
        proposal.eta = eta;
        emit ProposalQueued(proposalId, eta);
    }

    function queueOrRevertInternal(
        NounsDAOStorageV3.StorageV3 storage ds,
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) internal {
        require(
            !ds.timelock.queuedTransactions(keccak256(abi.encode(target, value, signature, data, eta))),
            'NounsDAO::queueOrRevertInternal: identical proposal action already queued at eta'
        );
        ds.timelock.queueTransaction(target, value, signature, data, eta);
    }

    /**
     * @notice Executes a queued proposal if eta has passed
     * @param proposalId The id of the proposal to execute
     */
    function execute(NounsDAOStorageV3.StorageV3 storage ds, uint256 proposalId) external {
        require(
            state(ds, proposalId) == NounsDAOStorageV3.ProposalState.Queued,
            'NounsDAO::execute: proposal can only be executed if it is queued'
        );
        NounsDAOStorageV3.Proposal storage proposal = ds._proposals[proposalId];
        proposal.executed = true;
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            ds.timelock.executeTransaction(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                proposal.eta
            );
        }
        emit ProposalExecuted(proposalId);
    }

    /**
     * @notice Cancels a proposal only if sender is the proposer, or proposer delegates dropped below proposal threshold
     * @param proposalId The id of the proposal to cancel
     */
    function cancel(NounsDAOStorageV3.StorageV3 storage ds, uint256 proposalId) external {
        if (state(ds, proposalId) == NounsDAOStorageV3.ProposalState.Executed) {
            revert CantCancelExecutedProposal();
        }

        NounsDAOStorageV3.Proposal storage proposal = ds._proposals[proposalId];
        address proposer = proposal.proposer;

        uint256 votes;
        bool msgSenderIsProposer = proposer == msg.sender;
        address[] memory signers = proposal.signers;
        if (signers.length == 0) {
            votes = ds.nouns.getPriorVotes(proposer, block.number - 1);
        } else {
            for (uint256 i = 0; i < signers.length; ++i) {
                msgSenderIsProposer = msgSenderIsProposer || msg.sender == signers[i];
                votes += ds.nouns.getPriorVotes(signers[i], block.number - 1);
            }
        }

        require(
            msgSenderIsProposer || votes <= proposal.proposalThreshold,
            'NounsDAO::cancel: proposer above threshold'
        );

        proposal.canceled = true;
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            ds.timelock.cancelTransaction(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                proposal.eta
            );
        }

        emit ProposalCanceled(proposalId);
    }

    /**
     * @notice Gets the state of a proposal
     * @param proposalId The id of the proposal
     * @return Proposal state
     */
    function state(NounsDAOStorageV3.StorageV3 storage ds, uint256 proposalId)
        public
        view
        returns (NounsDAOStorageV3.ProposalState)
    {
        require(ds.proposalCount >= proposalId, 'NounsDAO::state: invalid proposal id');
        NounsDAOStorageV3.Proposal storage proposal = ds._proposals[proposalId];
        if (proposal.vetoed) {
            return NounsDAOStorageV3.ProposalState.Vetoed;
        } else if (proposal.canceled) {
            return NounsDAOStorageV3.ProposalState.Canceled;
        } else if (block.number <= proposal.startBlock) {
            return NounsDAOStorageV3.ProposalState.Pending;
        } else if (block.number <= proposal.endBlock) {
            return NounsDAOStorageV3.ProposalState.Active;
        } else if (block.number <= proposal.objectionPeriodEndBlock) {
            return NounsDAOStorageV3.ProposalState.ObjectionPeriod;
        } else if (isDefeated(ds, proposal)) {
            return NounsDAOStorageV3.ProposalState.Defeated;
        } else if (proposal.eta == 0) {
            return NounsDAOStorageV3.ProposalState.Succeeded;
        } else if (proposal.executed) {
            return NounsDAOStorageV3.ProposalState.Executed;
        } else if (block.timestamp >= proposal.eta + ds.timelock.GRACE_PERIOD()) {
            return NounsDAOStorageV3.ProposalState.Expired;
        } else {
            return NounsDAOStorageV3.ProposalState.Queued;
        }
    }

    /**
     * @notice Gets actions of a proposal
     * @param proposalId the id of the proposal
     * @return targets
     * @return values
     * @return signatures
     * @return calldatas
     */
    function getActions(NounsDAOStorageV3.StorageV3 storage ds, uint256 proposalId)
        internal
        view
        returns (
            address[] memory targets,
            uint256[] memory values,
            string[] memory signatures,
            bytes[] memory calldatas
        )
    {
        NounsDAOStorageV3.Proposal storage p = ds._proposals[proposalId];
        return (p.targets, p.values, p.signatures, p.calldatas);
    }

    /**
     * @notice Gets the receipt for a voter on a given proposal
     * @param proposalId the id of proposal
     * @param voter The address of the voter
     * @return The voting receipt
     */
    function getReceipt(
        NounsDAOStorageV3.StorageV3 storage ds,
        uint256 proposalId,
        address voter
    ) internal view returns (NounsDAOStorageV3.Receipt memory) {
        return ds._proposals[proposalId].receipts[voter];
    }

    /**
     * @notice Returns the proposal details given a proposal id.
     *     The `quorumVotes` member holds the *current* quorum, given the current votes.
     * @param proposalId the proposal id to get the data for
     * @return A `ProposalCondensed` struct with the proposal data
     */
    function proposals(NounsDAOStorageV3.StorageV3 storage ds, uint256 proposalId)
        external
        view
        returns (NounsDAOStorageV3.ProposalCondensed memory)
    {
        NounsDAOStorageV3.Proposal storage proposal = ds._proposals[proposalId];
        return
            NounsDAOStorageV3.ProposalCondensed({
                id: proposal.id,
                proposer: proposal.proposer,
                proposalThreshold: proposal.proposalThreshold,
                quorumVotes: ds.quorumVotes(proposal.id),
                eta: proposal.eta,
                startBlock: proposal.startBlock,
                endBlock: proposal.endBlock,
                forVotes: proposal.forVotes,
                againstVotes: proposal.againstVotes,
                abstainVotes: proposal.abstainVotes,
                canceled: proposal.canceled,
                vetoed: proposal.vetoed,
                executed: proposal.executed,
                totalSupply: proposal.totalSupply,
                creationBlock: proposal.creationBlock,
                signers: proposal.signers
            });
    }

    /**
     * @notice Current proposal threshold using Noun Total Supply
     * Differs from `GovernerBravo` which uses fixed amount
     */
    function proposalThreshold(NounsDAOStorageV3.StorageV3 storage ds) internal view returns (uint256) {
        return bps2Uint(ds.proposalThresholdBPS, ds.nouns.totalSupply());
    }

    function isDefeated(NounsDAOStorageV3.StorageV3 storage ds, NounsDAOStorageV3.Proposal storage proposal)
        internal
        view
        returns (bool)
    {
        return proposal.forVotes <= proposal.againstVotes || proposal.forVotes < ds.quorumVotes(proposal.id);
    }

    function proposalCreationBlock(NounsDAOStorageV3.StorageV3 storage ds, NounsDAOStorageV3.Proposal storage proposal)
        internal
        view
        returns (uint256)
    {
        if (proposal.creationBlock == 0) {
            return proposal.startBlock - ds.votingDelay;
        }
        return proposal.creationBlock;
    }

    function checkNoActiveProp(NounsDAOStorageV3.StorageV3 storage ds, address proposer) internal view {
        uint256 latestProposalId = ds.latestProposalIds[proposer];
        if (latestProposalId != 0) {
            NounsDAOStorageV3.ProposalState proposersLatestProposalState = state(ds, latestProposalId);
            if (
                proposersLatestProposalState == NounsDAOStorageV3.ProposalState.Active ||
                proposersLatestProposalState == NounsDAOStorageV3.ProposalState.Pending
            ) revert ProposerAlreadyHasALiveProposal();
        }
    }

    function createNewProposal(
        NounsDAOStorageV3.StorageV3 storage ds,
        uint256 proposalId,
        uint256 proposalThreshold_,
        ProposalTxs memory txs
    ) internal returns (NounsDAOStorageV3.Proposal storage newProposal) {
        uint256 startBlock = block.number + ds.votingDelay;

        newProposal = ds._proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.proposer = msg.sender;
        newProposal.proposalThreshold = proposalThreshold_;
        newProposal.eta = 0;
        newProposal.targets = txs.targets;
        newProposal.values = txs.values;
        newProposal.signatures = txs.signatures;
        newProposal.calldatas = txs.calldatas;
        newProposal.startBlock = startBlock;
        newProposal.endBlock = startBlock + ds.votingPeriod;
        newProposal.forVotes = 0;
        newProposal.againstVotes = 0;
        newProposal.abstainVotes = 0;
        newProposal.canceled = false;
        newProposal.executed = false;
        newProposal.vetoed = false;
        newProposal.totalSupply = ds.nouns.totalSupply();
        newProposal.creationBlock = block.number;
    }

    function emitNewPropEvents(
        NounsDAOStorageV3.Proposal storage newProposal,
        uint256 minQuorumVotes,
        ProposalTxs memory txs,
        string memory description
    ) internal {
        /// @notice Maintains backwards compatibility with GovernorBravo events
        emit ProposalCreated(
            newProposal.id,
            msg.sender,
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            newProposal.startBlock,
            newProposal.endBlock,
            description
        );

        /// @notice Updated event with `proposalThreshold` and `minQuorumVotes`
        /// @notice `minQuorumVotes` is always zero since V2 introduces dynamic quorum with checkpoints
        emit ProposalCreatedWithRequirements(
            newProposal.id,
            msg.sender,
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            newProposal.startBlock,
            newProposal.endBlock,
            newProposal.proposalThreshold,
            minQuorumVotes,
            description
        );
    }

    function checkPropThreshold(NounsDAOStorageV3.StorageV3 storage ds, uint256 votes)
        internal
        view
        returns (uint256 propThreshold)
    {
        uint256 totalSupply = ds.nouns.totalSupply();
        propThreshold = bps2Uint(ds.proposalThresholdBPS, totalSupply);

        require(votes > propThreshold, 'NounsDAO::propose: proposer votes below proposal threshold');
    }

    function checkProposaTxs(ProposalTxs memory txs) internal pure {
        if (
            txs.targets.length != txs.values.length ||
            txs.targets.length != txs.signatures.length ||
            txs.targets.length != txs.calldatas.length
        ) revert ProposalInfoArityMismatch();
        if (txs.targets.length == 0) revert MustProvideActions();
        if (txs.targets.length > proposalMaxOperations) revert TooManyActions();
    }

    function checkNonce(NounsDAOStorageV3.StorageV3 storage ds, uint256 nonce) internal {
        if (ds.proposeBySigNonces[nonce]) revert ProposalSignatureNonceAlreadyUsed();
        ds.proposeBySigNonces[nonce] = true;
    }

    function verifyProposalSignature(bytes32 proposalHash, NounsDAOStorageV3.ProposerSignature memory proposerSignature)
        internal
        view
    {
        bytes32 signerHash = keccak256(abi.encode(proposalHash, proposerSignature.expirationTimestamp));

        if (!SignatureChecker.isValidSignatureNow(proposerSignature.signer, signerHash, proposerSignature.sig))
            revert InvalidSignature();

        if (block.timestamp > proposerSignature.expirationTimestamp) revert SignatureExpired();
    }

    function bps2Uint(uint256 bps, uint256 number) internal pure returns (uint256) {
        return (number * bps) / 10000;
    }
}
