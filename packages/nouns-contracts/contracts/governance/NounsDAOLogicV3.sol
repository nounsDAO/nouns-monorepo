// SPDX-License-Identifier: BSD-3-Clause

/// @title The Nouns DAO logic version 3

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

// NounsDAOLogicV2 adds:
// - `quorumParamsCheckpoints`, which store dynamic quorum parameters checkpoints
// to be used when calculating the dynamic quorum.
// - `_setDynamicQuorumParams(DynamicQuorumParams memory params)`, which allows the
// DAO to update the dynamic quorum parameters' values.
// - `getDynamicQuorumParamsAt(uint256 blockNumber_)`
// - Individual setters of the DynamicQuorumParams members:
//    - `_setMinQuorumVotesBPS(uint16 newMinQuorumVotesBPS)`
//    - `_setMaxQuorumVotesBPS(uint16 newMaxQuorumVotesBPS)`
//    - `_setQuorumCoefficient(uint32 newQuorumCoefficient)`
// - `minQuorumVotes` and `maxQuorumVotes`, which returns the current min and
// max quorum votes using the current Noun supply.
// - New `Proposal` struct member:
//    - `totalSupply` used in dynamic quorum calculation.
//    - `creationBlock` used for retrieving checkpoints of votes and dynamic quorum params. This now
// allows changing `votingDelay` without affecting the checkpoints lookup.
// - `quorumVotes(uint256 proposalId)`, which calculates and returns the dynamic
// quorum for a specific proposal.
// - `proposals(uint256 proposalId)` instead of the implicit getter, to avoid stack-too-deep error
//
// NounsDAOLogicV2 removes:
// - `quorumVotes()` has been replaced by `quorumVotes(uint256 proposalId)`.

pragma solidity ^0.8.6;

import './NounsDAOInterfaces.sol';
import { NounsDAOV3Admin } from './NounsDAOV3Admin.sol';
import { NounsDAOV3DynamicQuorum } from './NounsDAOV3DynamicQuorum.sol';
import { NounsDAOV3Votes } from './NounsDAOV3Votes.sol';
import { NounsDAOV3Proposals } from './NounsDAOV3Proposals.sol';

contract NounsDAOLogicV3 is NounsDAOStorageV3 {
    using NounsDAOV3Admin for StorageV3;
    using NounsDAOV3DynamicQuorum for StorageV3;
    using NounsDAOV3Votes for StorageV3;
    using NounsDAOV3Proposals for StorageV3;

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   CONSTANTS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /// @notice The minimum setable proposal threshold
    function MIN_PROPOSAL_THRESHOLD_BPS() public pure returns (uint256) {
        return NounsDAOV3Admin.MIN_PROPOSAL_THRESHOLD_BPS;
    }

    /// @notice The maximum setable proposal threshold
    function MAX_PROPOSAL_THRESHOLD_BPS() public pure returns (uint256) {
        return NounsDAOV3Admin.MAX_PROPOSAL_THRESHOLD_BPS;
    }

    /// @notice The minimum setable voting period
    function MIN_VOTING_PERIOD() public pure returns (uint256) {
        return NounsDAOV3Admin.MIN_VOTING_PERIOD;
    }

    /// @notice The max setable voting period
    function MAX_VOTING_PERIOD() public pure returns (uint256) {
        return NounsDAOV3Admin.MAX_VOTING_PERIOD;
    }

    /// @notice The min setable voting delay
    function MIN_VOTING_DELAY() public pure returns (uint256) {
        return NounsDAOV3Admin.MIN_VOTING_DELAY;
    }

    /// @notice The max setable voting delay
    function MAX_VOTING_DELAY() public pure returns (uint256) {
        return NounsDAOV3Admin.MAX_VOTING_DELAY;
    }

    /// @notice The maximum number of actions that can be included in a proposal
    function proposalMaxOperations() public pure returns (uint256) {
        return NounsDAOV3Proposals.proposalMaxOperations;
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
     * @param timelock_ The address of the NounsDAOExecutor
     * @param nouns_ The address of the NOUN tokens
     * @param vetoer_ The address allowed to unilaterally veto proposals
     * @param votingPeriod_ The initial voting period
     * @param votingDelay_ The initial voting delay
     * @param proposalThresholdBPS_ The initial proposal threshold in basis points
     * @param dynamicQuorumParams_ The initial dynamic quorum parameters
     */
    function initialize(
        address timelock_,
        address nouns_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        DynamicQuorumParams calldata dynamicQuorumParams_
    ) public virtual {
        if (address(ds.timelock) != address(0)) revert CanOnlyInitializeOnce();
        if (msg.sender != ds.admin) revert AdminOnly();
        if (timelock_ == address(0)) revert InvalidTimelockAddress();
        if (nouns_ == address(0)) revert InvalidNounsAddress();

        ds._setVotingDelay(votingPeriod_);
        ds._setVotingDelay(votingDelay_);
        ds._setProposalThresholdBPS(proposalThresholdBPS_);
        ds.timelock = INounsDAOExecutor(timelock_);
        ds.nouns = NounsTokenLike(nouns_);
        ds.vetoer = vetoer_;
        _setDynamicQuorumParams(
            dynamicQuorumParams_.minQuorumVotesBPS,
            dynamicQuorumParams_.maxQuorumVotesBPS,
            dynamicQuorumParams_.quorumCoefficient
        );

        // TODO make this configurable
        ds.lastMinuteWindowInBlocks = 7200; // 7200 blocks = 1 days
        ds.objectionPeriodDurationInBlocks = 14400; // 14400 blocks = 2 days
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
    ) public returns (uint256) {
        return ds.propose(NounsDAOV3Proposals.ProposalTxs(targets, values, signatures, calldatas), description);
    }

    function proposeBySigs(
        ProposerSignature[] memory proposerSignatures,
        uint256 nonce,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256) {
        return
            ds.proposeBySigs(
                proposerSignatures,
                nonce,
                NounsDAOV3Proposals.ProposalTxs(targets, values, signatures, calldatas),
                description
            );
    }

    function updateProposal(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external {
        ds.updateProposal(proposalId, targets, values, signatures, calldatas, description);
    }

    function updateProposalBySigs(
        uint256 proposalId,
        ProposerSignature[] memory proposerSignatures,
        uint256 nonce,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external {
        ds.updateProposalBySigs(
            proposalId,
            proposerSignatures,
            nonce,
            targets,
            values,
            signatures,
            calldatas,
            description
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
     * @notice Cancels a proposal only if sender is the proposer, or proposer delegates dropped below proposal threshold
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
    function getActions(uint256 proposalId)
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
     * @return A `ProposalCondensed` struct with the proposal data
     */
    function proposals(uint256 proposalId) external view returns (ProposalCondensed memory) {
        return ds.proposals(proposalId);
    }

    /**
     * @notice Current proposal threshold using Noun Total Supply
     * Differs from `GovernerBravo` which uses fixed amount
     */
    function proposalThreshold() public view returns (uint256) {
        return ds.proposalThreshold();
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
        ds.castRefundableVote(proposalId, support);
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
    function castRefundableVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason
    ) external {
        ds.castRefundableVoteWithReason(proposalId, support, reason);
    }

    /**
     * @notice Cast a vote for a proposal with a reason
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote. 0=against, 1=for, 2=abstain
     * @param reason The reason given for the vote by the voter
     */
    function castVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason
    ) external {
        ds.castVoteWithReason(proposalId, support, reason);
    }

    /**
     * @notice Cast a vote for a proposal by signature
     * @dev External function that accepts EIP-712 signatures for voting on proposals.
     */
    function castVoteBySig(
        uint256 proposalId,
        uint8 support,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        ds.castVoteBySig(proposalId, support, v, r, s);
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   ADMIN
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Admin function for setting the voting delay
     * @param newVotingDelay new voting delay, in blocks
     */
    function _setVotingDelay(uint256 newVotingDelay) external {
        ds._setVotingDelay(newVotingDelay);
    }

    /**
     * @notice Admin function for setting the voting period
     * @param newVotingPeriod new voting period, in blocks
     */
    function _setVotingPeriod(uint256 newVotingPeriod) external {
        ds._setVotingPeriod(newVotingPeriod);
    }

    /**
     * @notice Admin function for setting the proposal threshold basis points
     * @dev newProposalThresholdBPS must be greater than the hardcoded min
     * @param newProposalThresholdBPS new proposal threshold
     */
    function _setProposalThresholdBPS(uint256 newProposalThresholdBPS) external {
        ds._setProposalThresholdBPS(newProposalThresholdBPS);
    }

    /**
     * @notice Begins transfer of admin rights. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.
     * @dev Admin function to begin change of admin. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.
     * @param newPendingAdmin New pending admin.
     */
    function _setPendingAdmin(address newPendingAdmin) external {
        ds._setPendingAdmin(newPendingAdmin);
    }

    /**
     * @notice Accepts transfer of admin rights. msg.sender must be pendingAdmin
     * @dev Admin function for pending admin to accept role and update admin
     */
    function _acceptAdmin() external {
        ds._acceptAdmin();
    }

    /**
     * @notice Begins transition of vetoer. The newPendingVetoer must call _acceptVetoer to finalize the transfer.
     * @param newPendingVetoer New Pending Vetoer
     */
    function _setPendingVetoer(address newPendingVetoer) public {
        ds._setPendingVetoer(newPendingVetoer);
    }

    function _acceptVetoer() external {
        ds._acceptVetoer();
    }

    /**
     * @notice Burns veto priviledges
     * @dev Vetoer function destroying veto power forever
     */
    function _burnVetoPower() public {
        ds._burnVetoPower();
    }

    /**
     * @notice Admin function for setting the minimum quorum votes bps
     * @param newMinQuorumVotesBPS minimum quorum votes bps
     *     Must be between `MIN_QUORUM_VOTES_BPS_LOWER_BOUND` and `MIN_QUORUM_VOTES_BPS_UPPER_BOUND`
     *     Must be lower than or equal to maxQuorumVotesBPS
     */
    function _setMinQuorumVotesBPS(uint16 newMinQuorumVotesBPS) external {
        ds._setMinQuorumVotesBPS(newMinQuorumVotesBPS);
    }

    /**
     * @notice Admin function for setting the maximum quorum votes bps
     * @param newMaxQuorumVotesBPS maximum quorum votes bps
     *     Must be lower than `MAX_QUORUM_VOTES_BPS_UPPER_BOUND`
     *     Must be higher than or equal to minQuorumVotesBPS
     */
    function _setMaxQuorumVotesBPS(uint16 newMaxQuorumVotesBPS) external {
        ds._setMaxQuorumVotesBPS(newMaxQuorumVotesBPS);
    }

    /**
     * @notice Admin function for setting the dynamic quorum coefficient
     * @param newQuorumCoefficient the new coefficient, as a fixed point integer with 6 decimals
     */
    function _setQuorumCoefficient(uint32 newQuorumCoefficient) external {
        ds._setQuorumCoefficient(newQuorumCoefficient);
    }

    /**
     * @notice Admin function for setting all the dynamic quorum parameters
     * @param newMinQuorumVotesBPS minimum quorum votes bps
     *     Must be between `MIN_QUORUM_VOTES_BPS_LOWER_BOUND` and `MIN_QUORUM_VOTES_BPS_UPPER_BOUND`
     *     Must be lower than or equal to maxQuorumVotesBPS
     * @param newMaxQuorumVotesBPS maximum quorum votes bps
     *     Must be lower than `MAX_QUORUM_VOTES_BPS_UPPER_BOUND`
     *     Must be higher than or equal to minQuorumVotesBPS
     * @param newQuorumCoefficient the new coefficient, as a fixed point integer with 6 decimals
     */
    function _setDynamicQuorumParams(
        uint16 newMinQuorumVotesBPS,
        uint16 newMaxQuorumVotesBPS,
        uint32 newQuorumCoefficient
    ) public {
        ds._setDynamicQuorumParams(newMinQuorumVotesBPS, newMaxQuorumVotesBPS, newQuorumCoefficient);
    }

    function _withdraw() external returns (uint256, bool) {
        return ds._withdraw();
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
     * @param totalSupply The total supply of Nouns at the time of proposal creation
     * @param params Configurable parameters for calculating the quorum based on againstVotes. See `DynamicQuorumParams` definition for additional details.
     * @return quorumVotes The required quorum
     */
    function dynamicQuorumVotes(
        uint256 againstVotes,
        uint256 totalSupply,
        DynamicQuorumParams memory params
    ) public pure returns (uint256) {
        return NounsDAOV3DynamicQuorum.dynamicQuorumVotes(againstVotes, totalSupply, params);
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
     * @notice Current min quorum votes using Noun total supply
     */
    function minQuorumVotes() public view returns (uint256) {
        return ds.minQuorumVotes();
    }

    /**
     * @notice Current max quorum votes using Noun total supply
     */
    function maxQuorumVotes() public view returns (uint256) {
        return ds.maxQuorumVotes();
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   STATE VARIABLE GETTERS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

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

    receive() external payable {}
}
