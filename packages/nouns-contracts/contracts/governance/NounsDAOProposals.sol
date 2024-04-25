// SPDX-License-Identifier: GPL-3.0

/// @title Library for Nouns DAO Logic containing the proposal lifecycle code

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

pragma solidity ^0.8.19;

import './NounsDAOInterfaces.sol';
import { NounsDAODynamicQuorum } from './NounsDAODynamicQuorum.sol';
import { NounsDAOFork } from './fork/NounsDAOFork.sol';
import { SignatureChecker } from '../external/openzeppelin/SignatureChecker.sol';
import { ECDSA } from '../external/openzeppelin/ECDSA.sol';
import { SafeCast } from '@openzeppelin/contracts/utils/math/SafeCast.sol';

library NounsDAOProposals {
    using NounsDAODynamicQuorum for NounsDAOTypes.Storage;
    using NounsDAOFork for NounsDAOTypes.Storage;

    error CantCancelProposalAtFinalState();
    error ProposalInfoArityMismatch();
    error MustProvideActions();
    error TooManyActions();
    error ProposerAlreadyHasALiveProposal();
    error InvalidSignature();
    error SignatureExpired();
    error CanOnlyEditUpdatableProposals();
    error OnlyProposerCanEdit();
    error SignerCountMismtach();
    error ProposerCannotUpdateProposalWithSigners();
    error MustProvideSignatures();
    error SignatureIsCancelled();
    error CannotExecuteDuringForkingPeriod();
    error VetoerBurned();
    error VetoerOnly();
    error CantVetoExecutedProposal();
    error VotesBelowProposalThreshold();

    // Created to solve stack-too-deep errors
    struct ProposalTxs {
        address[] targets;
        uint256[] values;
        string[] signatures;
        bytes[] calldatas;
    }

    /// @notice The maximum number of actions that can be included in a proposal
    uint256 public constant PROPOSAL_MAX_OPERATIONS = 10; // 10 actions

    bytes32 public constant DOMAIN_TYPEHASH =
        keccak256('EIP712Domain(string name,uint256 chainId,address verifyingContract)');

    bytes32 public constant PROPOSAL_TYPEHASH =
        keccak256(
            'Proposal(address proposer,address[] targets,uint256[] values,string[] signatures,bytes[] calldatas,string description,uint256 expiry)'
        );

    bytes32 public constant UPDATE_PROPOSAL_TYPEHASH =
        keccak256(
            'UpdateProposal(uint256 proposalId,address proposer,address[] targets,uint256[] values,string[] signatures,bytes[] calldatas,string description,uint256 expiry)'
        );

    /**
     * @notice Function used to propose a new proposal. Sender must have delegates above the proposal threshold
     * @param txs Target addresses, eth values, function signatures and calldatas for proposal calls
     * @param description String description of the proposal
     * @param clientId The ID of the client that faciliated posting the proposal onchain
     * @return Proposal id of new proposal
     */
    function propose(
        NounsDAOTypes.Storage storage ds,
        ProposalTxs memory txs,
        string memory description,
        uint32 clientId
    ) internal returns (uint256) {
        uint256 adjustedTotalSupply = ds.adjustedTotalSupply();
        uint256 proposalThreshold_ = checkPropThreshold(
            ds,
            ds.nouns.getPriorVotes(msg.sender, block.number - 1),
            adjustedTotalSupply
        );
        checkProposalTxs(txs);
        checkNoActiveProp(ds, msg.sender);

        ds.proposalCount = ds.proposalCount + 1;
        uint32 proposalId = SafeCast.toUint32(ds.proposalCount);
        NounsDAOTypes.Proposal storage newProposal = createNewProposal(
            ds,
            proposalId,
            proposalThreshold_,
            adjustedTotalSupply,
            txs,
            clientId
        );
        ds.latestProposalIds[msg.sender] = proposalId;

        emitNewPropEvents(
            newProposal,
            new address[](0),
            ds.minQuorumVotes(adjustedTotalSupply),
            txs,
            description,
            clientId
        );

        return proposalId;
    }

    /**
     * @notice Function used to propose a new proposal. Sender must have delegates above the proposal threshold.
     * This proposal would be executed via the timelockV1 contract. This is meant to be used in case timelockV1
     * is still holding funds or has special permissions to execute on certain contracts.
     * @param txs Target addresses, eth values, function signatures and calldatas for proposal calls
     * @param description String description of the proposal
     * @param clientId The ID of the client that faciliated posting the proposal onchain
     * @return uint256 Proposal id of new proposal
     */
    function proposeOnTimelockV1(
        NounsDAOTypes.Storage storage ds,
        ProposalTxs memory txs,
        string memory description,
        uint32 clientId
    ) internal returns (uint256) {
        uint256 newProposalId = propose(ds, txs, description, clientId);

        NounsDAOTypes.Proposal storage newProposal = ds._proposals[newProposalId];
        newProposal.executeOnTimelockV1 = true;

        emit NounsDAOEventsV3.ProposalCreatedOnTimelockV1(newProposalId);

        return newProposalId;
    }

    struct ProposalTemp {
        uint32 proposalId;
        uint256 adjustedTotalSupply;
        uint256 propThreshold;
    }

    /**
     * @notice Function used to propose a new proposal. Sender and signers must have delegates above the proposal threshold
     * @param proposerSignatures Array of signers who have signed the proposal and their signatures.
     * @dev The signatures follow EIP-712. See `PROPOSAL_TYPEHASH` in NounsDAOProposals.sol
     * @param txs Target addresses, eth values, function signatures and calldatas for proposal calls
     * @param description String description of the proposal
     * @param clientId The ID of the client that faciliated posting the proposal onchain
     * @return uint256 Proposal id of new proposal
     */
    function proposeBySigs(
        NounsDAOTypes.Storage storage ds,
        NounsDAOTypes.ProposerSignature[] memory proposerSignatures,
        ProposalTxs memory txs,
        string memory description,
        uint32 clientId
    ) external returns (uint256) {
        if (proposerSignatures.length == 0) revert MustProvideSignatures();
        checkProposalTxs(txs);

        ProposalTemp memory temp;
        ds.proposalCount = ds.proposalCount + 1;
        temp.proposalId = SafeCast.toUint32(ds.proposalCount);
        temp.adjustedTotalSupply = ds.adjustedTotalSupply();
        temp.propThreshold = proposalThreshold(ds, temp.adjustedTotalSupply);

        NounsDAOTypes.Proposal storage newProposal = createNewProposal(
            ds,
            temp.proposalId,
            temp.propThreshold,
            temp.adjustedTotalSupply,
            txs,
            clientId
        );

        // important that the proposal is created before the verification call in order to ensure
        // the same signer is not trying to sign this proposal more than once
        (uint256 votes, address[] memory signers) = verifySignersCanBackThisProposalAndCountTheirVotes(
            ds,
            proposerSignatures,
            txs,
            description,
            temp.proposalId
        );
        if (signers.length == 0) revert MustProvideSignatures();
        if (votes <= temp.propThreshold) revert VotesBelowProposalThreshold();

        newProposal.signers = signers;

        emitNewPropEvents(
            newProposal,
            signers,
            ds.minQuorumVotes(temp.adjustedTotalSupply),
            txs,
            description,
            clientId
        );

        return temp.proposalId;
    }

    /**
     * @notice Invalidates a signature that may be used for signing a proposal.
     * Once a signature is canceled, the sender can no longer use it again.
     * If the sender changes their mind and want to sign the proposal, they can change the expiry timestamp
     * in order to produce a new signature.
     * The signature will only be invalidated when used by the sender. If used by a different account, it will
     * not be invalidated.
     * @param sig The signature to cancel
     */
    function cancelSig(NounsDAOTypes.Storage storage ds, bytes calldata sig) external {
        bytes32 sigHash = keccak256(sig);
        ds.cancelledSigs[msg.sender][sigHash] = true;

        emit NounsDAOEventsV3.SignatureCancelled(msg.sender, sig);
    }

    /**
     * @notice Update a proposal transactions and description.
     * Only the proposer can update it, and only during the updateable period.
     * @param proposalId Proposal's id
     * @param targets Updated target addresses for proposal calls
     * @param values Updated eth values for proposal calls
     * @param signatures Updated function signatures for proposal calls
     * @param calldatas Updated calldatas for proposal calls
     * @param description Updated description of the proposal
     * @param updateMessage Short message to explain the update
     */
    function updateProposal(
        NounsDAOTypes.Storage storage ds,
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description,
        string memory updateMessage
    ) external {
        updateProposalTransactionsInternal(ds, proposalId, targets, values, signatures, calldatas);

        emit NounsDAOEventsV3.ProposalUpdated(
            proposalId,
            msg.sender,
            targets,
            values,
            signatures,
            calldatas,
            description,
            updateMessage
        );
    }

    /**
     * @notice Updates the proposal's transactions. Only the proposer can update it, and only during the updateable period.
     * @param proposalId Proposal's id
     * @param targets Updated target addresses for proposal calls
     * @param values Updated eth values for proposal calls
     * @param signatures Updated function signatures for proposal calls
     * @param calldatas Updated calldatas for proposal calls
     * @param updateMessage Short message to explain the update
     */
    function updateProposalTransactions(
        NounsDAOTypes.Storage storage ds,
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory updateMessage
    ) external {
        updateProposalTransactionsInternal(ds, proposalId, targets, values, signatures, calldatas);

        emit NounsDAOEventsV3.ProposalTransactionsUpdated(
            proposalId,
            msg.sender,
            targets,
            values,
            signatures,
            calldatas,
            updateMessage
        );
    }

    function updateProposalTransactionsInternal(
        NounsDAOTypes.Storage storage ds,
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas
    ) internal {
        checkProposalTxs(ProposalTxs(targets, values, signatures, calldatas));

        NounsDAOTypes.Proposal storage proposal = ds._proposals[proposalId];
        checkProposalUpdatable(ds, proposalId, proposal);

        proposal.targets = targets;
        proposal.values = values;
        proposal.signatures = signatures;
        proposal.calldatas = calldatas;
    }

    /**
     * @notice Updates the proposal's description. Only the proposer can update it, and only during the updateable period.
     * @param proposalId Proposal's id
     * @param description Updated description of the proposal
     * @param updateMessage Short message to explain the update
     */
    function updateProposalDescription(
        NounsDAOTypes.Storage storage ds,
        uint256 proposalId,
        string calldata description,
        string calldata updateMessage
    ) external {
        NounsDAOTypes.Proposal storage proposal = ds._proposals[proposalId];
        checkProposalUpdatable(ds, proposalId, proposal);

        emit NounsDAOEventsV3.ProposalDescriptionUpdated(proposalId, msg.sender, description, updateMessage);
    }

    /**
     * @notice Update a proposal's transactions and description that was created with proposeBySigs.
     * Only the proposer can update it, during the updateable period.
     * Requires the original signers to sign the update.
     * @param proposalId Proposal's id
     * @param proposerSignatures Array of signers who have signed the proposal and their signatures.
     * @dev The signatures follow EIP-712. See `UPDATE_PROPOSAL_TYPEHASH` in NounsDAOProposals.sol
     * @param txs Updated transactions for the proposal
     * @param description Updated description of the proposal
     * @param updateMessage Short message to explain the update
     */
    function updateProposalBySigs(
        NounsDAOTypes.Storage storage ds,
        uint256 proposalId,
        NounsDAOTypes.ProposerSignature[] memory proposerSignatures,
        ProposalTxs memory txs,
        string memory description,
        string memory updateMessage
    ) external {
        checkProposalTxs(txs);
        // without this check it's possible to run through this function and update a proposal without signatures
        // this problem doesn't exist in the propose function because we check for prop threshold there
        if (proposerSignatures.length == 0) revert MustProvideSignatures();

        NounsDAOTypes.Proposal storage proposal = ds._proposals[proposalId];
        if (stateInternal(ds, proposalId) != NounsDAOTypes.ProposalState.Updatable)
            revert CanOnlyEditUpdatableProposals();
        if (msg.sender != proposal.proposer) revert OnlyProposerCanEdit();

        address[] memory signers = proposal.signers;
        if (proposerSignatures.length != signers.length) revert SignerCountMismtach();

        bytes memory proposalEncodeData = abi.encodePacked(
            proposalId,
            calcProposalEncodeData(msg.sender, txs, description)
        );

        for (uint256 i = 0; i < proposerSignatures.length; ++i) {
            verifyProposalSignature(ds, proposalEncodeData, proposerSignatures[i], UPDATE_PROPOSAL_TYPEHASH);

            // To avoid the gas cost of having to search signers in proposal.signers, we're assuming the sigs we get
            // use the same amount of signers and the same order.
            if (signers[i] != proposerSignatures[i].signer) revert OnlyProposerCanEdit();
        }

        proposal.targets = txs.targets;
        proposal.values = txs.values;
        proposal.signatures = txs.signatures;
        proposal.calldatas = txs.calldatas;

        emit NounsDAOEventsV3.ProposalUpdated(
            proposalId,
            msg.sender,
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            description,
            updateMessage
        );
    }

    /**
     * @notice Queues a proposal of state succeeded
     * @param proposalId The id of the proposal to queue
     */
    function queue(NounsDAOTypes.Storage storage ds, uint256 proposalId) external {
        require(
            stateInternal(ds, proposalId) == NounsDAOTypes.ProposalState.Succeeded,
            'NounsDAO::queue: proposal can only be queued if it is succeeded'
        );
        NounsDAOTypes.Proposal storage proposal = ds._proposals[proposalId];
        INounsDAOExecutor timelock = getProposalTimelock(ds, proposal);
        uint256 eta = block.timestamp + timelock.delay();
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            queueOrRevertInternal(
                timelock,
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                eta
            );
        }
        proposal.eta = eta;
        emit NounsDAOEventsV3.ProposalQueued(proposalId, eta);
    }

    function queueOrRevertInternal(
        INounsDAOExecutor timelock,
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) internal {
        require(
            !timelock.queuedTransactions(keccak256(abi.encode(target, value, signature, data, eta))),
            'NounsDAO::queueOrRevertInternal: identical proposal action already queued at eta'
        );
        timelock.queueTransaction(target, value, signature, data, eta);
    }

    /**
     * @notice Executes a queued proposal if eta has passed
     * @param proposalId The id of the proposal to execute
     */
    function execute(NounsDAOTypes.Storage storage ds, uint256 proposalId) external {
        NounsDAOTypes.Proposal storage proposal = ds._proposals[proposalId];
        INounsDAOExecutor timelock = getProposalTimelock(ds, proposal);
        executeInternal(ds, proposal, timelock);
    }

    function executeInternal(
        NounsDAOTypes.Storage storage ds,
        NounsDAOTypes.Proposal storage proposal,
        INounsDAOExecutor timelock
    ) internal {
        require(
            stateInternal(ds, proposal.id) == NounsDAOTypes.ProposalState.Queued,
            'NounsDAO::execute: proposal can only be executed if it is queued'
        );
        if (ds.isForkPeriodActive()) revert CannotExecuteDuringForkingPeriod();

        proposal.executed = true;

        for (uint256 i = 0; i < proposal.targets.length; i++) {
            timelock.executeTransaction(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                proposal.eta
            );
        }
        emit NounsDAOEventsV3.ProposalExecuted(proposal.id);
    }

    function getProposalTimelock(
        NounsDAOTypes.Storage storage ds,
        NounsDAOTypes.Proposal storage proposal
    ) internal view returns (INounsDAOExecutor) {
        if (proposal.executeOnTimelockV1) {
            return ds.timelockV1;
        } else {
            return ds.timelock;
        }
    }

    /**
     * @notice Vetoes a proposal only if sender is the vetoer and the proposal has not been executed.
     * @param proposalId The id of the proposal to veto
     */
    function veto(NounsDAOTypes.Storage storage ds, uint256 proposalId) external {
        if (ds.vetoer == address(0)) {
            revert VetoerBurned();
        }

        if (msg.sender != ds.vetoer) {
            revert VetoerOnly();
        }

        if (stateInternal(ds, proposalId) == NounsDAOTypes.ProposalState.Executed) {
            revert CantVetoExecutedProposal();
        }

        NounsDAOTypes.Proposal storage proposal = ds._proposals[proposalId];

        proposal.vetoed = true;
        INounsDAOExecutor timelock = getProposalTimelock(ds, proposal);
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            timelock.cancelTransaction(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                proposal.eta
            );
        }

        emit NounsDAOEventsV3.ProposalVetoed(proposalId);
    }

    /**
     * @notice Cancels a proposal only if sender is the proposer or a signer, or proposer & signers voting power
     * dropped below proposal threshold
     * @param proposalId The id of the proposal to cancel
     */
    function cancel(NounsDAOTypes.Storage storage ds, uint256 proposalId) external {
        NounsDAOTypes.ProposalState proposalState = stateInternal(ds, proposalId);
        if (
            proposalState == NounsDAOTypes.ProposalState.Canceled ||
            proposalState == NounsDAOTypes.ProposalState.Defeated ||
            proposalState == NounsDAOTypes.ProposalState.Expired ||
            proposalState == NounsDAOTypes.ProposalState.Executed ||
            proposalState == NounsDAOTypes.ProposalState.Vetoed
        ) {
            revert CantCancelProposalAtFinalState();
        }

        NounsDAOTypes.Proposal storage proposal = ds._proposals[proposalId];
        address proposer = proposal.proposer;
        NounsTokenLike nouns = ds.nouns;

        uint256 votes = nouns.getPriorVotes(proposer, block.number - 1);
        bool msgSenderIsProposer = proposer == msg.sender;
        address[] memory signers = proposal.signers;
        for (uint256 i = 0; i < signers.length; ++i) {
            msgSenderIsProposer = msgSenderIsProposer || msg.sender == signers[i];
            votes += nouns.getPriorVotes(signers[i], block.number - 1);
        }

        require(
            msgSenderIsProposer || votes <= proposal.proposalThreshold,
            'NounsDAO::cancel: proposer above threshold'
        );

        proposal.canceled = true;
        INounsDAOExecutor timelock = getProposalTimelock(ds, proposal);
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            timelock.cancelTransaction(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                proposal.eta
            );
        }

        emit NounsDAOEventsV3.ProposalCanceled(proposalId);
    }

    /**
     * @notice Gets the state of a proposal
     * @param ds the DAO's state struct
     * @param proposalId The id of the proposal
     * @return Proposal state
     */
    function state(
        NounsDAOTypes.Storage storage ds,
        uint256 proposalId
    ) public view returns (NounsDAOTypes.ProposalState) {
        return stateInternal(ds, proposalId);
    }

    /**
     * @notice Gets the state of a proposal
     * @dev This internal function is used by other libraries to embed in compile time and save the runtime gas cost of a delegate call
     * @param ds the DAO's state struct
     * @param proposalId The id of the proposal
     * @return Proposal state
     */
    function stateInternal(
        NounsDAOTypes.Storage storage ds,
        uint256 proposalId
    ) internal view returns (NounsDAOTypes.ProposalState) {
        require(ds.proposalCount >= proposalId, 'NounsDAO::state: invalid proposal id');
        NounsDAOTypes.Proposal storage proposal = ds._proposals[proposalId];

        if (proposal.vetoed) {
            return NounsDAOTypes.ProposalState.Vetoed;
        } else if (proposal.canceled) {
            return NounsDAOTypes.ProposalState.Canceled;
        } else if (block.number <= proposal.updatePeriodEndBlock) {
            return NounsDAOTypes.ProposalState.Updatable;
        } else if (block.number <= proposal.startBlock) {
            return NounsDAOTypes.ProposalState.Pending;
        } else if (block.number <= proposal.endBlock) {
            return NounsDAOTypes.ProposalState.Active;
        } else if (block.number <= proposal.objectionPeriodEndBlock) {
            return NounsDAOTypes.ProposalState.ObjectionPeriod;
        } else if (isDefeated(ds, proposal)) {
            return NounsDAOTypes.ProposalState.Defeated;
        } else if (proposal.eta == 0) {
            return NounsDAOTypes.ProposalState.Succeeded;
        } else if (proposal.executed) {
            return NounsDAOTypes.ProposalState.Executed;
        } else if (block.timestamp >= proposal.eta + getProposalTimelock(ds, proposal).GRACE_PERIOD()) {
            return NounsDAOTypes.ProposalState.Expired;
        } else {
            return NounsDAOTypes.ProposalState.Queued;
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
    function getActions(
        NounsDAOTypes.Storage storage ds,
        uint256 proposalId
    )
        internal
        view
        returns (
            address[] memory targets,
            uint256[] memory values,
            string[] memory signatures,
            bytes[] memory calldatas
        )
    {
        NounsDAOTypes.Proposal storage p = ds._proposals[proposalId];
        return (p.targets, p.values, p.signatures, p.calldatas);
    }

    /**
     * @notice Gets the receipt for a voter on a given proposal
     * @param proposalId the id of proposal
     * @param voter The address of the voter
     * @return The voting receipt
     */
    function getReceipt(
        NounsDAOTypes.Storage storage ds,
        uint256 proposalId,
        address voter
    ) internal view returns (NounsDAOTypes.Receipt memory) {
        return ds._proposals[proposalId].receipts[voter];
    }

    /**
     * @notice Returns the proposal details given a proposal id.
     *     The `quorumVotes` member holds the *current* quorum, given the current votes.
     * @param proposalId the proposal id to get the data for
     * @return A `ProposalCondensed` struct with the proposal data
     */
    function proposals(
        NounsDAOTypes.Storage storage ds,
        uint256 proposalId
    ) external view returns (NounsDAOTypes.ProposalCondensedV2 memory) {
        NounsDAOTypes.Proposal storage proposal = ds._proposals[proposalId];
        return
            NounsDAOTypes.ProposalCondensedV2({
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
                creationBlock: proposal.creationBlock
            });
    }

    /**
     * @notice Returns the proposal details given a proposal id.
     *     The `quorumVotes` member holds the *current* quorum, given the current votes.
     * @param proposalId the proposal id to get the data for
     * @return A `ProposalCondensed` struct with the proposal data
     */
    function proposalsV3(
        NounsDAOTypes.Storage storage ds,
        uint256 proposalId
    ) external view returns (NounsDAOTypes.ProposalCondensedV3 memory) {
        NounsDAOTypes.Proposal storage proposal = ds._proposals[proposalId];
        return
            NounsDAOTypes.ProposalCondensedV3({
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
                signers: proposal.signers,
                updatePeriodEndBlock: proposal.updatePeriodEndBlock,
                objectionPeriodEndBlock: proposal.objectionPeriodEndBlock,
                executeOnTimelockV1: proposal.executeOnTimelockV1
            });
    }

    struct Temp {
        uint256 endBlock;
        uint256 objectionPeriodEndBlock;
    }

    function proposalDataForRewards(
        NounsDAOTypes.Storage storage ds,
        uint256 firstProposalId,
        uint256 lastProposalId,
        uint16 proposalEligibilityQuorumBps,
        bool excludeCanceled,
        bool requireVotingEnded,
        uint32[] calldata votingClientIds
    ) internal view returns (NounsDAOTypes.ProposalForRewards[] memory) {
        require(lastProposalId >= firstProposalId, 'lastProposalId >= firstProposalId');
        uint256 numProposals = lastProposalId - firstProposalId + 1;
        NounsDAOTypes.ProposalForRewards[] memory data = new NounsDAOTypes.ProposalForRewards[](numProposals);

        NounsDAOTypes.Proposal storage proposal;
        uint256 i;
        Temp memory t;
        for (uint256 pid = firstProposalId; pid <= lastProposalId; ++pid) {
            proposal = ds._proposals[pid];

            if (excludeCanceled && proposal.canceled) continue;

            t.endBlock = proposal.endBlock;
            t.objectionPeriodEndBlock = proposal.objectionPeriodEndBlock;
            if (requireVotingEnded) {
                uint256 votingEndBlock = max(t.endBlock, t.objectionPeriodEndBlock);
                require(block.number > votingEndBlock, 'all proposals must be done with voting');
            }

            uint256 forVotes = proposal.forVotes;
            uint256 totalSupply = proposal.totalSupply;
            if (forVotes < (totalSupply * proposalEligibilityQuorumBps) / 10_000) continue;

            NounsDAOTypes.ClientVoteData[] memory c = new NounsDAOTypes.ClientVoteData[](votingClientIds.length);
            for (uint256 j; j < votingClientIds.length; ++j) {
                c[j] = proposal.voteClients[votingClientIds[j]];
            }

            data[i++] = NounsDAOTypes.ProposalForRewards({
                endBlock: t.endBlock,
                objectionPeriodEndBlock: t.objectionPeriodEndBlock,
                forVotes: forVotes,
                againstVotes: proposal.againstVotes,
                abstainVotes: proposal.abstainVotes,
                totalSupply: totalSupply,
                creationTimestamp: proposal.creationTimestamp,
                clientId: proposal.clientId,
                voteData: c
            });
        }

        // change array size to the actually used size
        assembly {
            mstore(data, i)
        }

        return data;
    }

    /**
     * @notice Current proposal threshold using Noun Total Supply
     * Differs from `GovernerBravo` which uses fixed amount
     */
    function proposalThreshold(
        NounsDAOTypes.Storage storage ds,
        uint256 adjustedTotalSupply
    ) internal view returns (uint256) {
        return bps2Uint(ds.proposalThresholdBPS, adjustedTotalSupply);
    }

    function isDefeated(
        NounsDAOTypes.Storage storage ds,
        NounsDAOTypes.Proposal storage proposal
    ) internal view returns (bool) {
        uint256 forVotes = proposal.forVotes;
        return forVotes <= proposal.againstVotes || forVotes < ds.quorumVotes(proposal.id);
    }

    /**
     * @notice reverts if `proposer` is the proposer or signer of an active proposal.
     * This is a spam protection mechanism to limit the number of proposals each noun can back.
     */
    function checkNoActiveProp(NounsDAOTypes.Storage storage ds, address proposer) internal view {
        uint256 latestProposalId = ds.latestProposalIds[proposer];
        if (latestProposalId != 0) {
            NounsDAOTypes.ProposalState proposersLatestProposalState = stateInternal(ds, latestProposalId);
            if (
                proposersLatestProposalState == NounsDAOTypes.ProposalState.ObjectionPeriod ||
                proposersLatestProposalState == NounsDAOTypes.ProposalState.Active ||
                proposersLatestProposalState == NounsDAOTypes.ProposalState.Pending ||
                proposersLatestProposalState == NounsDAOTypes.ProposalState.Updatable
            ) revert ProposerAlreadyHasALiveProposal();
        }
    }

    /**
     * @dev Extracted this function to fix the `Stack too deep` error `proposeBySigs` hit.
     */
    function verifySignersCanBackThisProposalAndCountTheirVotes(
        NounsDAOTypes.Storage storage ds,
        NounsDAOTypes.ProposerSignature[] memory proposerSignatures,
        ProposalTxs memory txs,
        string memory description,
        uint256 proposalId
    ) internal returns (uint256 votes, address[] memory signers) {
        NounsTokenLike nouns = ds.nouns;
        bytes memory proposalEncodeData = calcProposalEncodeData(msg.sender, txs, description);

        signers = new address[](proposerSignatures.length);
        uint256 numSigners = 0;
        for (uint256 i = 0; i < proposerSignatures.length; ++i) {
            verifyProposalSignature(ds, proposalEncodeData, proposerSignatures[i], PROPOSAL_TYPEHASH);

            address signer = proposerSignatures[i].signer;
            checkNoActiveProp(ds, signer);

            uint256 signerVotes = nouns.getPriorVotes(signer, block.number - 1);
            if (signerVotes == 0) {
                continue;
            }

            signers[numSigners++] = signer;
            ds.latestProposalIds[signer] = proposalId;
            votes += signerVotes;
        }

        if (numSigners < proposerSignatures.length) {
            // this assembly trims the signer array, getting rid of unused cells
            assembly {
                mstore(signers, numSigners)
            }
        }

        checkNoActiveProp(ds, msg.sender);
        ds.latestProposalIds[msg.sender] = proposalId;
        votes += nouns.getPriorVotes(msg.sender, block.number - 1);
    }

    function calcProposalEncodeData(
        address proposer,
        ProposalTxs memory txs,
        string memory description
    ) internal pure returns (bytes memory) {
        bytes32[] memory signatureHashes = new bytes32[](txs.signatures.length);
        for (uint256 i = 0; i < txs.signatures.length; ++i) {
            signatureHashes[i] = keccak256(bytes(txs.signatures[i]));
        }

        bytes32[] memory calldatasHashes = new bytes32[](txs.calldatas.length);
        for (uint256 i = 0; i < txs.calldatas.length; ++i) {
            calldatasHashes[i] = keccak256(txs.calldatas[i]);
        }

        return
            abi.encode(
                proposer,
                keccak256(abi.encodePacked(txs.targets)),
                keccak256(abi.encodePacked(txs.values)),
                keccak256(abi.encodePacked(signatureHashes)),
                keccak256(abi.encodePacked(calldatasHashes)),
                keccak256(bytes(description))
            );
    }

    function checkProposalUpdatable(
        NounsDAOTypes.Storage storage ds,
        uint256 proposalId,
        NounsDAOTypes.Proposal storage proposal
    ) internal view {
        if (stateInternal(ds, proposalId) != NounsDAOTypes.ProposalState.Updatable)
            revert CanOnlyEditUpdatableProposals();
        if (msg.sender != proposal.proposer) revert OnlyProposerCanEdit();
        if (proposal.signers.length > 0) revert ProposerCannotUpdateProposalWithSigners();
    }

    function createNewProposal(
        NounsDAOTypes.Storage storage ds,
        uint32 proposalId,
        uint256 proposalThreshold_,
        uint256 adjustedTotalSupply,
        ProposalTxs memory txs,
        uint32 clientId
    ) internal returns (NounsDAOTypes.Proposal storage newProposal) {
        uint64 updatePeriodEndBlock = SafeCast.toUint64(block.number + ds.proposalUpdatablePeriodInBlocks);
        uint256 startBlock = updatePeriodEndBlock + ds.votingDelay;
        uint256 endBlock = startBlock + ds.votingPeriod;

        newProposal = ds._proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.clientId = clientId;
        newProposal.proposer = msg.sender;
        newProposal.proposalThreshold = proposalThreshold_;
        newProposal.targets = txs.targets;
        newProposal.values = txs.values;
        newProposal.signatures = txs.signatures;
        newProposal.calldatas = txs.calldatas;
        newProposal.startBlock = startBlock;
        newProposal.endBlock = endBlock;
        newProposal.totalSupply = adjustedTotalSupply;
        newProposal.creationBlock = SafeCast.toUint32(block.number);
        newProposal.creationTimestamp = SafeCast.toUint32(block.timestamp);
        newProposal.updatePeriodEndBlock = updatePeriodEndBlock;
    }

    function emitNewPropEvents(
        NounsDAOTypes.Proposal storage newProposal,
        address[] memory signers,
        uint256 minQuorumVotes,
        ProposalTxs memory txs,
        string memory description,
        uint32 clientId
    ) internal {
        /// @notice Maintains backwards compatibility with GovernorBravo events
        emit NounsDAOEventsV3.ProposalCreated(
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

        /// @notice V1: Updated event with `proposalThreshold` and `quorumVotes` `minQuorumVotes`
        /// @notice V2: `quorumVotes` changed to `minQuorumVotes`
        /// @notice V3: Added signers and updatePeriodEndBlock
        /// @notice V4: Removed data that's already emitted in `ProposalCreated`, added clientId
        emit NounsDAOEventsV3.ProposalCreatedWithRequirements(
            newProposal.id,
            signers,
            newProposal.updatePeriodEndBlock,
            newProposal.proposalThreshold,
            minQuorumVotes,
            clientId
        );
    }

    function checkPropThreshold(
        NounsDAOTypes.Storage storage ds,
        uint256 votes,
        uint256 adjustedTotalSupply
    ) internal view returns (uint256 propThreshold) {
        propThreshold = proposalThreshold(ds, adjustedTotalSupply);
        if (votes <= propThreshold) revert VotesBelowProposalThreshold();
    }

    function checkProposalTxs(ProposalTxs memory txs) internal pure {
        if (
            txs.targets.length != txs.values.length ||
            txs.targets.length != txs.signatures.length ||
            txs.targets.length != txs.calldatas.length
        ) revert ProposalInfoArityMismatch();
        if (txs.targets.length == 0) revert MustProvideActions();
        if (txs.targets.length > PROPOSAL_MAX_OPERATIONS) revert TooManyActions();
    }

    function verifyProposalSignature(
        NounsDAOTypes.Storage storage ds,
        bytes memory proposalEncodeData,
        NounsDAOTypes.ProposerSignature memory proposerSignature,
        bytes32 typehash
    ) internal view {
        bytes32 sigHash = keccak256(proposerSignature.sig);
        if (ds.cancelledSigs[proposerSignature.signer][sigHash]) revert SignatureIsCancelled();

        bytes32 digest = sigDigest(typehash, proposalEncodeData, proposerSignature.expirationTimestamp, address(this));
        if (!SignatureChecker.isValidSignatureNow(proposerSignature.signer, digest, proposerSignature.sig))
            revert InvalidSignature();

        if (block.timestamp > proposerSignature.expirationTimestamp) revert SignatureExpired();
    }

    /**
     * @notice Generate the digest (hash) used to verify proposal signatures.
     * @param typehash the EIP 712 type hash of the signed message, e.g. `PROPOSAL_TYPEHASH` or `UPDATE_PROPOSAL_TYPEHASH`.
     * @param proposalEncodeData the abi encoded proposal data, identical to the output of `calcProposalEncodeData`.
     * @param expirationTimestamp the signature's expiration timestamp.
     * @param verifyingContract the contract verifying the signature, e.g. the DAO proxy by default.
     * @return bytes32 the signature's typed data hash.
     */
    function sigDigest(
        bytes32 typehash,
        bytes memory proposalEncodeData,
        uint256 expirationTimestamp,
        address verifyingContract
    ) internal view returns (bytes32) {
        bytes32 structHash = keccak256(abi.encodePacked(typehash, proposalEncodeData, expirationTimestamp));

        bytes32 domainSeparator = keccak256(
            abi.encode(DOMAIN_TYPEHASH, keccak256(bytes('Nouns DAO')), block.chainid, verifyingContract)
        );

        return ECDSA.toTypedDataHash(domainSeparator, structHash);
    }

    function bps2Uint(uint256 bps, uint256 number) internal pure returns (uint256) {
        return (number * bps) / 10000;
    }

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }
}
