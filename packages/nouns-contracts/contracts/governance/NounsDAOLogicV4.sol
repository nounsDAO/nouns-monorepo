// SPDX-License-Identifier: BSD-3-Clause

/// @title The Nouns DAO logic version 4

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

// LICENSE
// NounsDAOLogicV2.sol is a modified version of Compound Lab's GovernorBravoDelegate.sol:
// https://github.com/compound-finance/compound-protocol/blob/b9b14038612d846b83f8a009a82c38974ff2dcfe/contracts/Governance/GovernorBravoDelegate.sol
//
// GovernorBravoDelegate.sol source code Copyright 2020 Compound Labs, Inc. licensed under the BSD-3-Clause license.
// With modifications by Nounders DAO.
//
// Additional conditions of BSD-3-Clause can be found here: https://opensource.org/licenses/BSD-3-Clause
//
// MODIFICATIONS
// See NounsDAOLogicV1 for initial GovernorBravoDelegate modifications.
// See NounsDAOLogicV2 for additional modifications
//
// NounsDAOLogicV3 adds:
// - Contract has been broken down to use libraries because of contract size limitations
// - Proposal editing: allowing proposers to update their proposal’s transactions and text description,
// during the Updatable period only, which is the state upon proposal creation. Editing also works with signatures,
// assuming the proposer is able to accumulate signatures from the same signers.
// - Propose by signature: allowing Nouners and delegates to pool their voting power towards submitting a proposal,
// by submitting their signature, instead of the current approach where sponsors must delegate their votes to help
// a proposer achieve threshold.
// - Objection-only Period: a conditional voting period that gets activated upon a last-minute proposal swing
// from defeated to successful, affording against voters more reaction time.
// Only against votes are possible during the objection period.
// - Votes snapshot after voting delay: moving votes snapshot up, to provide Nouners with reaction time per proposal,
// to get their votes ready (e.g. some might want to move their delegations around).
// In NounsDAOLogicV2 the vote snapshot block is the proposal creation block.
// - Nouns fork: any token holder can signal to fork (exit) in response to a governance proposal.
// If a quorum of a configured threshold amount of tokens signals to exit, the fork will succeed.
// This will deploy a new DAO and send part of the treasury to the new DAO.
//
// 2 new states have been added to the proposal state machine: Updatable, ObjectionPeriod
//
// Updated state machine:
// Updatable -> Pending -> Active -> ObjectionPeriod (conditional) -> Succeeded -> Queued -> Executed
//                                                                 ┖> Defeated
//

pragma solidity ^0.8.19;

import './NounsDAOInterfaces.sol';
import { NounsDAOAdmin } from './NounsDAOAdmin.sol';
import { NounsDAODynamicQuorum } from './NounsDAODynamicQuorum.sol';
import { NounsDAOVotes } from './NounsDAOVotes.sol';
import { NounsDAOProposals } from './NounsDAOProposals.sol';
import { NounsDAOFork } from './fork/NounsDAOFork.sol';
import { Address } from '@openzeppelin/contracts/utils/Address.sol';

contract NounsDAOLogicV4 is NounsDAOStorage, NounsDAOEventsV3 {
    using NounsDAOAdmin for Storage;
    using NounsDAODynamicQuorum for Storage;
    using NounsDAOVotes for Storage;
    using NounsDAOProposals for Storage;
    using NounsDAOFork for Storage;

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   CONSTANTS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /// @notice The minimum setable proposal threshold
    function MIN_PROPOSAL_THRESHOLD_BPS() public pure returns (uint256) {
        return NounsDAOAdmin.MIN_PROPOSAL_THRESHOLD_BPS;
    }

    /// @notice The maximum setable proposal threshold
    function MAX_PROPOSAL_THRESHOLD_BPS() public pure returns (uint256) {
        return NounsDAOAdmin.MAX_PROPOSAL_THRESHOLD_BPS;
    }

    /// @notice The minimum setable voting period in blocks
    function MIN_VOTING_PERIOD() public pure returns (uint256) {
        return NounsDAOAdmin.MIN_VOTING_PERIOD_BLOCKS;
    }

    /// @notice The max setable voting period in blocks
    function MAX_VOTING_PERIOD() public pure returns (uint256) {
        return NounsDAOAdmin.MAX_VOTING_PERIOD_BLOCKS;
    }

    /// @notice The min setable voting delay in blocks
    function MIN_VOTING_DELAY() public pure returns (uint256) {
        return NounsDAOAdmin.MIN_VOTING_DELAY_BLOCKS;
    }

    /// @notice The max setable voting delay in blocks
    function MAX_VOTING_DELAY() public pure returns (uint256) {
        return NounsDAOAdmin.MAX_VOTING_DELAY_BLOCKS;
    }

    /// @notice The maximum number of actions that can be included in a proposal
    function proposalMaxOperations() public pure returns (uint256) {
        return NounsDAOProposals.PROPOSAL_MAX_OPERATIONS;
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   ERRORS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    error AdminOnly();
    error CanOnlyInitializeOnce();
    error InvalidTimelockAddress();
    error InvalidNounsAddress();

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   INITIALIZER
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Used to initialize the contract during delegator contructor
     * @dev This will only be called for a newly deployed DAO, not as part of an upgrade from V2 to V3
     * @param timelock_ The address of the NounsDAOExecutor
     * @param nouns_ The address of the NOUN tokens
     * @param forkEscrow_ The escrow contract used for creating forks
     * @param forkDAODeployer_ The contract used to deploy new forked DAOs
     * @param vetoer_ The address allowed to unilaterally veto proposals
     * @param daoParams_ Initial DAO parameters
     * @param dynamicQuorumParams_ The initial dynamic quorum parameters
     */
    function initialize(
        address timelock_,
        address nouns_,
        address forkEscrow_,
        address forkDAODeployer_,
        address vetoer_,
        NounsDAOParams calldata daoParams_,
        DynamicQuorumParams calldata dynamicQuorumParams_
    ) public virtual {
        if (address(ds.timelock) != address(0)) revert CanOnlyInitializeOnce();
        if (msg.sender != ds.admin) revert AdminOnly();
        if (timelock_ == address(0)) revert InvalidTimelockAddress();
        if (nouns_ == address(0)) revert InvalidNounsAddress();

        NounsDAOAdmin._setVotingPeriod(daoParams_.votingPeriod);
        NounsDAOAdmin._setVotingDelay(daoParams_.votingDelay);
        NounsDAOAdmin._setProposalThresholdBPS(daoParams_.proposalThresholdBPS);
        ds.timelock = INounsDAOExecutorV2(timelock_);
        ds.nouns = NounsTokenLike(nouns_);
        ds.forkEscrow = INounsDAOForkEscrow(forkEscrow_);
        ds.forkDAODeployer = IForkDAODeployer(forkDAODeployer_);
        ds.vetoer = vetoer_;
        NounsDAOAdmin._setDynamicQuorumParams(
            dynamicQuorumParams_.minQuorumVotesBPS,
            dynamicQuorumParams_.maxQuorumVotesBPS,
            dynamicQuorumParams_.quorumCoefficient
        );

        NounsDAOAdmin._setLastMinuteWindowInBlocks(daoParams_.lastMinuteWindowInBlocks);
        NounsDAOAdmin._setObjectionPeriodDurationInBlocks(daoParams_.objectionPeriodDurationInBlocks);
        NounsDAOAdmin._setProposalUpdatablePeriodInBlocks(daoParams_.proposalUpdatablePeriodInBlocks);
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   PROPOSALS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Function used to propose a new proposal. Sender must have delegates above the proposal threshold
     * @param targets Target addresses for proposal calls
     * @param values Eth values for proposal calls
     * @param signatures Function signatures for proposal calls
     * @param calldatas Calldatas for proposal calls
     * @param description String description of the proposal
     * @return uint256 Proposal id of new proposal
     */
    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256) {
        return propose(targets, values, signatures, calldatas, description, 0);
    }

    /**
     * @notice Function used to propose a new proposal. Sender must have delegates above the proposal threshold
     * @param targets Target addresses for proposal calls
     * @param values Eth values for proposal calls
     * @param signatures Function signatures for proposal calls
     * @param calldatas Calldatas for proposal calls
     * @param description String description of the proposal
     * @param clientId The ID of the client that faciliated posting the proposal onchain
     * @return uint256 Proposal id of new proposal
     */
    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description,
        uint32 clientId
    ) public returns (uint256) {
        return ds.propose(NounsDAOProposals.ProposalTxs(targets, values, signatures, calldatas), description, clientId);
    }

    /**
     * @notice Function used to propose a new proposal. Sender must have delegates above the proposal threshold.
     * This proposal would be executed via the timelockV1 contract. This is meant to be used in case timelockV1
     * is still holding funds or has special permissions to execute on certain contracts.
     * @param targets Target addresses for proposal calls
     * @param values Eth values for proposal calls
     * @param signatures Function signatures for proposal calls
     * @param calldatas Calldatas for proposal calls
     * @param description String description of the proposal
     * @return uint256 Proposal id of new proposal
     */
    function proposeOnTimelockV1(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) public returns (uint256) {
        return
            ds.proposeOnTimelockV1(
                NounsDAOProposals.ProposalTxs(targets, values, signatures, calldatas),
                description,
                0
            );
    }

    /**
     * @notice Function used to propose a new proposal. Sender must have delegates above the proposal threshold.
     * This proposal would be executed via the timelockV1 contract. This is meant to be used in case timelockV1
     * is still holding funds or has special permissions to execute on certain contracts.
     * @param targets Target addresses for proposal calls
     * @param values Eth values for proposal calls
     * @param signatures Function signatures for proposal calls
     * @param calldatas Calldatas for proposal calls
     * @param description String description of the proposal
     * @param clientId The ID of the client that faciliated posting the proposal onchain
     * @return uint256 Proposal id of new proposal
     */
    function proposeOnTimelockV1(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description,
        uint32 clientId
    ) public returns (uint256) {
        return
            ds.proposeOnTimelockV1(
                NounsDAOProposals.ProposalTxs(targets, values, signatures, calldatas),
                description,
                clientId
            );
    }

    /**
     * @notice Function used to propose a new proposal. Sender and signers must have delegates above the proposal threshold
     * Signers are regarded as co-proposers, and therefore have the ability to cancel the proposal at any time.
     * @param proposerSignatures Array of signers who have signed the proposal and their signatures.
     * @dev The signatures follow EIP-712. See `PROPOSAL_TYPEHASH` in NounsDAOProposals.sol
     * @param targets Target addresses for proposal calls
     * @param values Eth values for proposal calls
     * @param signatures Function signatures for proposal calls
     * @param calldatas Calldatas for proposal calls
     * @param description String description of the proposal
     * @return uint256 Proposal id of new proposal
     */
    function proposeBySigs(
        ProposerSignature[] memory proposerSignatures,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256) {
        return proposeBySigs(proposerSignatures, targets, values, signatures, calldatas, description, 0);
    }

    /**
     * @notice Function used to propose a new proposal. Sender and signers must have delegates above the proposal threshold
     * Signers are regarded as co-proposers, and therefore have the ability to cancel the proposal at any time.
     * @param proposerSignatures Array of signers who have signed the proposal and their signatures.
     * @dev The signatures follow EIP-712. See `PROPOSAL_TYPEHASH` in NounsDAOProposals.sol
     * @param targets Target addresses for proposal calls
     * @param values Eth values for proposal calls
     * @param signatures Function signatures for proposal calls
     * @param calldatas Calldatas for proposal calls
     * @param description String description of the proposal
     * @param clientId The ID of the client that faciliated posting the proposal onchain
     * @return uint256 Proposal id of new proposal
     */
    function proposeBySigs(
        ProposerSignature[] memory proposerSignatures,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description,
        uint32 clientId
    ) public returns (uint256) {
        return
            ds.proposeBySigs(
                proposerSignatures,
                NounsDAOProposals.ProposalTxs(targets, values, signatures, calldatas),
                description,
                clientId
            );
    }

    /**
     * @notice Invalidates a signature that may be used for signing a new proposal.
     * Once a signature is canceled, the sender can no longer use it again.
     * If the sender changes their mind and want to sign the proposal, they can change the expiry timestamp
     * in order to produce a new signature.
     * The signature will only be invalidated when used by the sender. If used by a different account, it will
     * not be invalidated.
     * Cancelling a signature for an existing proposal will have no effect. Signers have the ability to cancel
     * a proposal they signed if necessary.
     * @param sig The signature to cancel
     */
    function cancelSig(bytes calldata sig) external {
        ds.cancelSig(sig);
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
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description,
        string memory updateMessage
    ) external {
        ds.updateProposal(proposalId, targets, values, signatures, calldatas, description, updateMessage);
    }

    /**
     * @notice Updates the proposal's description. Only the proposer can update it, and only during the updateable period.
     * @param proposalId Proposal's id
     * @param description Updated description of the proposal
     * @param updateMessage Short message to explain the update
     */
    function updateProposalDescription(
        uint256 proposalId,
        string calldata description,
        string calldata updateMessage
    ) external {
        ds.updateProposalDescription(proposalId, description, updateMessage);
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
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory updateMessage
    ) external {
        ds.updateProposalTransactions(proposalId, targets, values, signatures, calldatas, updateMessage);
    }

    /**
     * @notice Update a proposal's transactions and description that was created with proposeBySigs.
     * Only the proposer can update it, during the updateable period.
     * Requires the original signers to sign the update.
     * @param proposalId Proposal's id
     * @param proposerSignatures Array of signers who have signed the proposal and their signatures.
     * @dev The signatures follow EIP-712. See `UPDATE_PROPOSAL_TYPEHASH` in NounsDAOProposals.sol
     * @param targets Updated target addresses for proposal calls
     * @param values Updated eth values for proposal calls
     * @param signatures Updated function signatures for proposal calls
     * @param calldatas Updated calldatas for proposal calls
     * @param description Updated description of the proposal
     * @param updateMessage Short message to explain the update
     */
    function updateProposalBySigs(
        uint256 proposalId,
        ProposerSignature[] memory proposerSignatures,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description,
        string memory updateMessage
    ) external {
        ds.updateProposalBySigs(
            proposalId,
            proposerSignatures,
            NounsDAOProposals.ProposalTxs(targets, values, signatures, calldatas),
            description,
            updateMessage
        );
    }

    /**
     * @notice Queues a proposal of state succeeded
     * @param proposalId The id of the proposal to queue
     */
    function queue(uint256 proposalId) external {
        ds.queue(proposalId);
    }

    /**
     * @notice Executes a queued proposal if eta has passed
     * @param proposalId The id of the proposal to execute
     */
    function execute(uint256 proposalId) external {
        ds.execute(proposalId);
    }

    /**
     * @notice Cancels a proposal only if sender is the proposer or a signer, or proposer & signers voting power
     * dropped below proposal threshold
     * @param proposalId The id of the proposal to cancel
     */
    function cancel(uint256 proposalId) external {
        ds.cancel(proposalId);
    }

    /**
     * @notice Gets the state of a proposal
     * @param proposalId The id of the proposal
     * @return Proposal state
     */
    function state(uint256 proposalId) public view returns (ProposalState) {
        return ds.state(proposalId);
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
        uint256 proposalId
    )
        external
        view
        returns (
            address[] memory targets,
            uint256[] memory values,
            string[] memory signatures,
            bytes[] memory calldatas
        )
    {
        return ds.getActions(proposalId);
    }

    /**
     * @notice Gets the receipt for a voter on a given proposal
     * @param proposalId the id of proposal
     * @param voter The address of the voter
     * @return The voting receipt
     */
    function getReceipt(uint256 proposalId, address voter) external view returns (Receipt memory) {
        return ds.getReceipt(proposalId, voter);
    }

    /**
     * @notice Returns the proposal details given a proposal id.
     *     The `quorumVotes` member holds the *current* quorum, given the current votes.
     * @param proposalId the proposal id to get the data for
     * @return A `ProposalCondensed` struct with the proposal data, backwards compatible with V1 and V2
     */
    function proposals(uint256 proposalId) external view returns (NounsDAOTypes.ProposalCondensedV2 memory) {
        return ds.proposals(proposalId);
    }

    /**
     * @notice Returns the proposal details given a proposal id.
     *     The `quorumVotes` member holds the *current* quorum, given the current votes.
     * @param proposalId the proposal id to get the data for
     * @return A `ProposalCondensed` struct with the proposal data, not backwards compatible as it contains additional values
     * like `objectionPeriodEndBlock` and `signers`
     */
    function proposalsV3(uint256 proposalId) external view returns (ProposalCondensedV3 memory) {
        return ds.proposalsV3(proposalId);
    }

    /**
     * @notice Get a range of proposals, in the format of a smaller struct tailored to client incentives rewards.
     * @param firstProposalId the id of the first proposal to get the data for
     * @param lastProposalId the id of the last proposal to get the data for
     * @param proposalEligibilityQuorumBps filters proposals with for-votes/total-supply higher than this quorum
     * @param excludeCanceled if true, excludes canceled proposals
     * @param requireVotingEnded if true, reverts if one of the proposals hasn't finished voting yet
     * @param votingClientIds the ids of the clients that facilitated votes on the proposals
     * @return An array of `ProposalForRewards` structs with the proposal data
     */
    function proposalDataForRewards(
        uint256 firstProposalId,
        uint256 lastProposalId,
        uint16 proposalEligibilityQuorumBps,
        bool excludeCanceled,
        bool requireVotingEnded,
        uint32[] calldata votingClientIds
    ) external view returns (ProposalForRewards[] memory) {
        return
            ds.proposalDataForRewards(
                firstProposalId,
                lastProposalId,
                proposalEligibilityQuorumBps,
                excludeCanceled,
                requireVotingEnded,
                votingClientIds
            );
    }

    /**
     * @notice Current proposal threshold using Noun Total Supply
     * Differs from `GovernerBravo` which uses fixed amount
     */
    function proposalThreshold() public view returns (uint256) {
        return ds.proposalThreshold(adjustedTotalSupply());
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   DAO FORK
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Escrow Nouns to contribute to the fork threshold
     * @dev Requires approving the tokenIds or the entire noun token to the DAO contract
     * @param tokenIds the tokenIds to escrow. They will be sent to the DAO once the fork threshold is reached and the escrow is closed.
     * @param proposalIds array of proposal ids which are the reason for wanting to fork. This will only be used to emit event.
     * @param reason the reason for want to fork. This will only be used to emit event.
     */
    function escrowToFork(
        uint256[] calldata tokenIds,
        uint256[] calldata proposalIds,
        string calldata reason
    ) external {
        ds.escrowToFork(tokenIds, proposalIds, reason);
    }

    /**
     * @notice Withdraw Nouns from the fork escrow. Only possible if the fork has not been executed.
     * Only allowed to withdraw tokens that the sender has escrowed.
     * @param tokenIds the tokenIds to withdraw
     */
    function withdrawFromForkEscrow(uint256[] calldata tokenIds) external {
        ds.withdrawFromForkEscrow(tokenIds);
    }

    /**
     * @notice Execute the fork. Only possible if the fork threshold has been met.
     * This will deploy a new DAO and send part of the treasury to the new DAO's treasury.
     * This will also close the active escrow and all nouns in the escrow belong to the original DAO.
     * @return forkTreasury The address of the new DAO's treasury
     * @return forkToken The address of the new DAO's token
     */
    function executeFork() external returns (address forkTreasury, address forkToken) {
        return ds.executeFork();
    }

    /**
     * @notice Joins a fork while a fork is active
     * @param tokenIds the tokenIds to send to the DAO in exchange for joining the fork
     * @param proposalIds array of proposal ids which are the reason for wanting to fork. This will only be used to emit event.
     * @param reason the reason for want to fork. This will only be used to emit event.
     */
    function joinFork(uint256[] calldata tokenIds, uint256[] calldata proposalIds, string calldata reason) external {
        ds.joinFork(tokenIds, proposalIds, reason);
    }

    /**
     * @notice Withdraws nouns from the fork escrow to the treasury after the fork has been executed
     * @dev Only the DAO can call this function
     * @param tokenIds the tokenIds to withdraw
     */
    function withdrawDAONounsFromEscrowToTreasury(uint256[] calldata tokenIds) external {
        ds.withdrawDAONounsFromEscrowToTreasury(tokenIds);
    }

    /**
     * @notice Withdraws nouns from the fork escrow after the fork has been executed to an address other than the treasury
     * @dev Only the DAO can call this function
     * @param tokenIds the tokenIds to withdraw
     * @param to the address to send the nouns to
     */
    function withdrawDAONounsFromEscrowIncreasingTotalSupply(uint256[] calldata tokenIds, address to) external {
        ds.withdrawDAONounsFromEscrowIncreasingTotalSupply(tokenIds, to);
    }

    /**
     * @notice Returns the number of nouns in supply minus nouns owned by the DAO, i.e. held in the treasury or in an
     * escrow after it has closed.
     * This is used when calculating proposal threshold, quorum, fork threshold & treasury split.
     */
    function adjustedTotalSupply() public view returns (uint256) {
        return ds.adjustedTotalSupply();
    }

    /**
     * @notice returns the required number of tokens to escrow to trigger a fork
     */
    function forkThreshold() external view returns (uint256) {
        return ds.forkThreshold();
    }

    /**
     * @notice Returns the number of tokens currently in escrow, contributing to the fork threshold
     */
    function numTokensInForkEscrow() external view returns (uint256) {
        return ds.numTokensInForkEscrow();
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   VOTES
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Vetoes a proposal only if sender is the vetoer and the proposal has not been executed.
     * @param proposalId The id of the proposal to veto
     */
    function veto(uint256 proposalId) external {
        ds.veto(proposalId);
    }

    /**
     * @notice Cast a vote for a proposal
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote. 0=against, 1=for, 2=abstain
     */
    function castVote(uint256 proposalId, uint8 support) external {
        ds.castVote(proposalId, support);
    }

    /**
     * @notice Cast a vote for a proposal, asking the DAO to refund gas costs.
     * Users with > 0 votes receive refunds. Refunds are partial when using a gas priority fee higher than the DAO's cap.
     * Refunds are partial when the DAO's balance is insufficient.
     * No refund is sent when the DAO's balance is empty. No refund is sent to users with no votes.
     * Voting takes place regardless of refund success.
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote. 0=against, 1=for, 2=abstain
     * @dev Reentrancy is defended against in `castVoteInternal` at the `receipt.hasVoted == false` require statement.
     */
    function castRefundableVote(uint256 proposalId, uint8 support) external {
        ds.castRefundableVote(proposalId, support, 0);
    }

    /**
     * @notice Cast a vote for a proposal, asking the DAO to refund gas costs.
     * Users with > 0 votes receive refunds. Refunds are partial when using a gas priority fee higher than the DAO's cap.
     * Refunds are partial when the DAO's balance is insufficient.
     * No refund is sent when the DAO's balance is empty. No refund is sent to users with no votes.
     * Voting takes place regardless of refund success.
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote. 0=against, 1=for, 2=abstain
     * @param clientId The ID of the client that faciliated posting the vote onchain
     * @dev Reentrancy is defended against in `castVoteInternal` at the `receipt.hasVoted == false` require statement.
     */
    function castRefundableVote(uint256 proposalId, uint8 support, uint32 clientId) external {
        ds.castRefundableVote(proposalId, support, clientId);
    }

    /**
     * @notice Cast a vote for a proposal, asking the DAO to refund gas costs.
     * Users with > 0 votes receive refunds. Refunds are partial when using a gas priority fee higher than the DAO's cap.
     * Refunds are partial when the DAO's balance is insufficient.
     * No refund is sent when the DAO's balance is empty. No refund is sent to users with no votes.
     * Voting takes place regardless of refund success.
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote. 0=against, 1=for, 2=abstain
     * @param reason The reason given for the vote by the voter
     * @dev Reentrancy is defended against in `castVoteInternal` at the `receipt.hasVoted == false` require statement.
     */
    function castRefundableVoteWithReason(uint256 proposalId, uint8 support, string calldata reason) public {
        ds.castRefundableVoteWithReason(proposalId, support, reason, 0);
    }

    /**
     * @notice Cast a vote for a proposal, asking the DAO to refund gas costs.
     * Users with > 0 votes receive refunds. Refunds are partial when using a gas priority fee higher than the DAO's cap.
     * Refunds are partial when the DAO's balance is insufficient.
     * No refund is sent when the DAO's balance is empty. No refund is sent to users with no votes.
     * Voting takes place regardless of refund success.
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote. 0=against, 1=for, 2=abstain
     * @param reason The reason given for the vote by the voter
     * @param clientId The ID of the client that faciliated posting the vote onchain
     * @dev Reentrancy is defended against in `castVoteInternal` at the `receipt.hasVoted == false` require statement.
     */
    function castRefundableVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason,
        uint32 clientId
    ) public {
        ds.castRefundableVoteWithReason(proposalId, support, reason, clientId);
    }

    /**
     * @notice Cast a vote for a proposal with a reason
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote. 0=against, 1=for, 2=abstain
     * @param reason The reason given for the vote by the voter
     */
    function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason) external {
        ds.castVoteWithReason(proposalId, support, reason);
    }

    /**
     * @notice Cast a vote for a proposal by signature
     * @dev External function that accepts EIP-712 signatures for voting on proposals.
     */
    function castVoteBySig(uint256 proposalId, uint8 support, uint8 v, bytes32 r, bytes32 s) external {
        ds.castVoteBySig(proposalId, support, v, r, s);
    }

    /**
     * @dev All other calls are called via NounsDAOAdmin
     */
    fallback(bytes calldata) external payable returns (bytes memory) {
        return Address.functionDelegateCall(address(NounsDAOAdmin), msg.data);
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   DYNAMIC QUORUM
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Quorum votes required for a specific proposal to succeed
     * Differs from `GovernerBravo` which uses fixed amount
     */
    function quorumVotes(uint256 proposalId) public view returns (uint256) {
        return ds.quorumVotes(proposalId);
    }

    /**
     * @notice Calculates the required quorum of for-votes based on the amount of against-votes
     *     The more against-votes there are for a proposal, the higher the required quorum is.
     *     The quorum BPS is between `params.minQuorumVotesBPS` and params.maxQuorumVotesBPS.
     *     The additional quorum is calculated as:
     *       quorumCoefficient * againstVotesBPS
     * @dev Note the coefficient is a fixed point integer with 6 decimals
     * @param againstVotes Number of against-votes in the proposal
     * @param adjustedTotalSupply_ The adjusted total supply of Nouns at the time of proposal creation
     * @param params Configurable parameters for calculating the quorum based on againstVotes. See `DynamicQuorumParams` definition for additional details.
     * @return quorumVotes The required quorum
     */
    function dynamicQuorumVotes(
        uint256 againstVotes,
        uint256 adjustedTotalSupply_,
        DynamicQuorumParams memory params
    ) public pure returns (uint256) {
        return NounsDAODynamicQuorum.dynamicQuorumVotes(againstVotes, adjustedTotalSupply_, params);
    }

    /**
     * @notice returns the dynamic quorum parameters values at a certain block number
     * @dev The checkpoints array must not be empty, and the block number must be higher than or equal to
     *     the block of the first checkpoint
     * @param blockNumber_ the block number to get the params at
     * @return The dynamic quorum parameters that were set at the given block number
     */
    function getDynamicQuorumParamsAt(uint256 blockNumber_) public view returns (DynamicQuorumParams memory) {
        return ds.getDynamicQuorumParamsAt(blockNumber_);
    }

    /**
     * @notice Current min quorum votes using Nouns adjusted total supply
     */
    function minQuorumVotes() public view returns (uint256) {
        return ds.minQuorumVotes(ds.adjustedTotalSupply());
    }

    /**
     * @notice Current max quorum votes using Nouns adjusted total supply
     */
    function maxQuorumVotes() public view returns (uint256) {
        return ds.maxQuorumVotes(ds.adjustedTotalSupply());
    }

    /**
     * @notice Get all quorum params checkpoints
     */
    function quorumParamsCheckpoints() public view returns (DynamicQuorumParamsCheckpoint[] memory) {
        return ds.quorumParamsCheckpoints;
    }

    /**
     * @notice Get a quorum params checkpoint by its index
     */
    function quorumParamsCheckpoints(uint256 index) public view returns (DynamicQuorumParamsCheckpoint memory) {
        return ds.quorumParamsCheckpoints[index];
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   STATE VARIABLE GETTERS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    function admin() public view returns (address) {
        return ds.admin;
    }

    function vetoer() public view returns (address) {
        return ds.vetoer;
    }

    function pendingVetoer() public view returns (address) {
        return ds.pendingVetoer;
    }

    function votingDelay() public view returns (uint256) {
        return ds.votingDelay;
    }

    function votingPeriod() public view returns (uint256) {
        return ds.votingPeriod;
    }

    function proposalThresholdBPS() public view returns (uint256) {
        return ds.proposalThresholdBPS;
    }

    function quorumVotesBPS() public view returns (uint256) {
        return ds.quorumVotesBPS;
    }

    function proposalCount() public view returns (uint256) {
        return ds.proposalCount;
    }

    function timelock() public view returns (INounsDAOExecutor) {
        return ds.timelock;
    }

    function nouns() public view returns (NounsTokenLike) {
        return ds.nouns;
    }

    function latestProposalIds(address account) public view returns (uint256) {
        return ds.latestProposalIds[account];
    }

    function lastMinuteWindowInBlocks() public view returns (uint256) {
        return ds.lastMinuteWindowInBlocks;
    }

    function objectionPeriodDurationInBlocks() public view returns (uint256) {
        return ds.objectionPeriodDurationInBlocks;
    }

    function erc20TokensToIncludeInFork() public view returns (address[] memory) {
        return ds.erc20TokensToIncludeInFork;
    }

    function forkEscrow() public view returns (INounsDAOForkEscrow) {
        return ds.forkEscrow;
    }

    function forkDAODeployer() public view returns (IForkDAODeployer) {
        return ds.forkDAODeployer;
    }

    function forkEndTimestamp() public view returns (uint256) {
        return ds.forkEndTimestamp;
    }

    function forkPeriod() public view returns (uint256) {
        return ds.forkPeriod;
    }

    function forkThresholdBPS() public view returns (uint256) {
        return ds.forkThresholdBPS;
    }

    function proposalUpdatablePeriodInBlocks() public view returns (uint256) {
        return ds.proposalUpdatablePeriodInBlocks;
    }

    function timelockV1() public view returns (address) {
        return address(ds.timelockV1);
    }

    function voteSnapshotBlockSwitchProposalId() public view returns (uint256) {
        return ds.voteSnapshotBlockSwitchProposalId;
    }

    receive() external payable {}
}
