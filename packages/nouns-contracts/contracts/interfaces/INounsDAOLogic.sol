// SPDX-License-Identifier: GPL-3.0

/// @title Interface for Noun Auction Houses

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

import '../governance/NounsDAOInterfaces.sol';

interface INounsDAOLogic {
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
    ) external returns (uint256);

    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description,
        uint32 clientId
    ) external returns (uint256);

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
    ) external returns (uint256);

    function proposeBySigs(
        NounsDAOTypes.ProposerSignature[] memory proposerSignatures,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description,
        uint32 clientId
    ) external returns (uint256);

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
        NounsDAOTypes.ProposerSignature[] memory proposerSignatures,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256);

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
    function cancelSig(bytes calldata sig) external;

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
    ) external;

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
    ) external;

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
    ) external;

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
        NounsDAOTypes.ProposerSignature[] memory proposerSignatures,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description,
        string memory updateMessage
    ) external;

    /**
     * @notice Queues a proposal of state succeeded
     * @param proposalId The id of the proposal to queue
     */
    function queue(uint256 proposalId) external;

    /**
     * @notice Executes a queued proposal if eta has passed
     * @param proposalId The id of the proposal to execute
     */
    function execute(uint256 proposalId) external;

    /**
     * @notice Cancels a proposal only if sender is the proposer or a signer, or proposer & signers voting power
     * dropped below proposal threshold
     * @param proposalId The id of the proposal to cancel
     */
    function cancel(uint256 proposalId) external;

    /**
     * @notice Gets the state of a proposal
     * @param proposalId The id of the proposal
     * @return Proposal state
     */
    function state(uint256 proposalId) external view returns (NounsDAOTypes.ProposalState);

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
        );

    /**
     * @notice Gets the receipt for a voter on a given proposal
     * @param proposalId the id of proposal
     * @param voter The address of the voter
     * @return The voting receipt
     */
    function getReceipt(uint256 proposalId, address voter) external view returns (NounsDAOTypes.Receipt memory);

    /**
     * @notice Returns the proposal details given a proposal id.
     *     The `quorumVotes` member holds the *current* quorum, given the current votes.
     * @param proposalId the proposal id to get the data for
     * @return A `ProposalCondensed` struct with the proposal data, backwards compatible with V1 and V2
     */
    function proposals(uint256 proposalId) external view returns (NounsDAOTypes.ProposalCondensedV2 memory);

    /**
     * @notice Returns the proposal details given a proposal id.
     *     The `quorumVotes` member holds the *current* quorum, given the current votes.
     * @param proposalId the proposal id to get the data for
     * @return A `ProposalCondensed` struct with the proposal data, not backwards compatible as it contains additional values
     * like `objectionPeriodEndBlock` and `signers`
     */
    function proposalsV3(uint256 proposalId) external view returns (NounsDAOTypes.ProposalCondensedV3 memory);

    function proposalDataForRewards(
        uint256 firstProposalId,
        uint256 lastProposalId,
        uint16 proposalEligibilityQuorumBps,
        bool excludeCanceled,
        bool requireVotingEnded,
        uint32[] calldata votingClientIds
    ) external view returns (NounsDAOTypes.ProposalForRewards[] memory);

    /**
     * @notice Current proposal threshold using Noun Total Supply
     * Differs from `GovernerBravo` which uses fixed amount
     */
    function proposalThreshold() external view returns (uint256);

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   ADMIN
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Admin function for setting the voting delay. Best to set voting delay to at least a few days, to give
     * voters time to make sense of proposals, e.g. 21,600 blocks which should be at least 3 days.
     * @param newVotingDelay new voting delay, in blocks
     */
    function _setVotingDelay(uint256 newVotingDelay) external;

    /**
     * @notice Admin function for setting the voting period
     * @param newVotingPeriod new voting period, in blocks
     */
    function _setVotingPeriod(uint256 newVotingPeriod) external;

    /**
     * @notice Admin function for setting the proposal threshold basis points
     * @dev newProposalThresholdBPS must be in [`MIN_PROPOSAL_THRESHOLD_BPS`,`MAX_PROPOSAL_THRESHOLD_BPS`]
     * @param newProposalThresholdBPS new proposal threshold
     */
    function _setProposalThresholdBPS(uint256 newProposalThresholdBPS) external;

    /**
     * @notice Admin function for setting the objection period duration
     * @param newObjectionPeriodDurationInBlocks new objection period duration, in blocks
     */
    function _setObjectionPeriodDurationInBlocks(uint32 newObjectionPeriodDurationInBlocks) external;

    /**
     * @notice Admin function for setting the objection period last minute window
     * @param newLastMinuteWindowInBlocks new objection period last minute window, in blocks
     */
    function _setLastMinuteWindowInBlocks(uint32 newLastMinuteWindowInBlocks) external;

    /**
     * @notice Admin function for setting the proposal updatable period
     * @param newProposalUpdatablePeriodInBlocks the new proposal updatable period, in blocks
     */
    function _setProposalUpdatablePeriodInBlocks(uint32 newProposalUpdatablePeriodInBlocks) external;

    /**
     * @notice Begins transfer of admin rights. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.
     * @dev Admin function to begin change of admin. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.
     * @param newPendingAdmin New pending admin.
     */
    function _setPendingAdmin(address newPendingAdmin) external;

    /**
     * @notice Accepts transfer of admin rights. msg.sender must be pendingAdmin
     * @dev Admin function for pending admin to accept role and update admin
     */
    function _acceptAdmin() external;

    /**
     * @notice Begins transition of vetoer. The newPendingVetoer must call _acceptVetoer to finalize the transfer.
     * @param newPendingVetoer New Pending Vetoer
     */
    function _setPendingVetoer(address newPendingVetoer) external;

    /**
     * @notice Called by the pendingVetoer to accept role and update vetoer
     */
    function _acceptVetoer() external;

    /**
     * @notice Burns veto priviledges
     * @dev Vetoer function destroying veto power forever
     */
    function _burnVetoPower() external;

    /**
     * @notice Admin function for setting the minimum quorum votes bps
     * @param newMinQuorumVotesBPS minimum quorum votes bps
     *     Must be between `MIN_QUORUM_VOTES_BPS_LOWER_BOUND` and `MIN_QUORUM_VOTES_BPS_UPPER_BOUND`
     *     Must be lower than or equal to maxQuorumVotesBPS
     */
    function _setMinQuorumVotesBPS(uint16 newMinQuorumVotesBPS) external;

    /**
     * @notice Admin function for setting the maximum quorum votes bps
     * @param newMaxQuorumVotesBPS maximum quorum votes bps
     *     Must be lower than `MAX_QUORUM_VOTES_BPS_UPPER_BOUND`
     *     Must be higher than or equal to minQuorumVotesBPS
     */
    function _setMaxQuorumVotesBPS(uint16 newMaxQuorumVotesBPS) external;

    /**
     * @notice Admin function for setting the dynamic quorum coefficient
     * @param newQuorumCoefficient the new coefficient, as a fixed point integer with 6 decimals
     */
    function _setQuorumCoefficient(uint32 newQuorumCoefficient) external;

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
    ) external;

    /**
     * @notice Withdraws all the ETH in the contract. This is callable only by the admin (timelock).
     */
    function _withdraw() external returns (uint256, bool);

    /**
     * @notice Admin function for setting the fork period
     * @param newForkPeriod the new fork proposal period, in seconds
     */
    function _setForkPeriod(uint256 newForkPeriod) external;

    /**
     * @notice Admin function for setting the fork threshold
     * @param newForkThresholdBPS the new fork proposal threshold, in basis points
     */
    function _setForkThresholdBPS(uint256 newForkThresholdBPS) external;

    /**
     * @notice Admin function for setting the fork DAO deployer contract
     */
    function _setForkDAODeployer(address newForkDAODeployer) external;

    /**
     * @notice Admin function for setting the ERC20 tokens that are used when splitting funds to a fork
     */
    function _setErc20TokensToIncludeInFork(address[] calldata erc20tokens) external;

    /**
     * @notice Admin function for setting the fork escrow contract
     */
    function _setForkEscrow(address newForkEscrow) external;

    /**
     * @notice Admin function for setting the fork related parameters
     * @param forkEscrow_ the fork escrow contract
     * @param forkDAODeployer_ the fork dao deployer contract
     * @param erc20TokensToIncludeInFork_ the ERC20 tokens used when splitting funds to a fork
     * @param forkPeriod_ the period during which it's possible to join a fork after exeuction
     * @param forkThresholdBPS_ the threshold required of escrowed nouns in order to execute a fork
     */
    function _setForkParams(
        address forkEscrow_,
        address forkDAODeployer_,
        address[] calldata erc20TokensToIncludeInFork_,
        uint256 forkPeriod_,
        uint256 forkThresholdBPS_
    ) external;

    /**
     * @notice Admin function for setting the timelocks and admin
     * @param newTimelock the new timelock contract
     * @param newTimelockV1 the new timelockV1 contract
     * @param newAdmin the new admin address
     */
    function _setTimelocksAndAdmin(address newTimelock, address newTimelockV1, address newAdmin) external;

    /**
     * @notice Admin function for zeroing out the state variable `voteSnapshotBlockSwitchProposalId`
     * @dev We want to zero-out this state slot so we can remove this temporary variable from contract code and
     * be ready to reuse this slot.
     */
    function _zeroOutVoteSnapshotBlockSwitchProposalId() external;

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   DYNAMIC QUORUM
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */
    /**
     * @notice Quorum votes required for a specific proposal to succeed
     * Differs from `GovernerBravo` which uses fixed amount
     */
    function quorumVotes(uint256 proposalId) external view returns (uint256);

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
        NounsDAOTypes.DynamicQuorumParams memory params
    ) external pure returns (uint256);

    /**
     * @notice returns the dynamic quorum parameters values at a certain block number
     * @dev The checkpoints array must not be empty, and the block number must be higher than or equal to
     *     the block of the first checkpoint
     * @param blockNumber_ the block number to get the params at
     * @return The dynamic quorum parameters that were set at the given block number
     */
    function getDynamicQuorumParamsAt(
        uint256 blockNumber_
    ) external view returns (NounsDAOTypes.DynamicQuorumParams memory);

    /**
     * @notice Current min quorum votes using Nouns adjusted total supply
     */
    function minQuorumVotes() external view returns (uint256);

    /**
     * @notice Current max quorum votes using Nouns adjusted total supply
     */
    function maxQuorumVotes() external view returns (uint256);

    /**
     * @notice Get all quorum params checkpoints
     */
    function quorumParamsCheckpoints() external view returns (NounsDAOTypes.DynamicQuorumParamsCheckpoint[] memory);

    /**
     * @notice Get a quorum params checkpoint by its index
     */
    function quorumParamsCheckpoints(
        uint256 index
    ) external view returns (NounsDAOTypes.DynamicQuorumParamsCheckpoint memory);

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
    function escrowToFork(uint256[] calldata tokenIds, uint256[] calldata proposalIds, string calldata reason) external;

    /**
     * @notice Withdraw Nouns from the fork escrow. Only possible if the fork has not been executed.
     * Only allowed to withdraw tokens that the sender has escrowed.
     * @param tokenIds the tokenIds to withdraw
     */
    function withdrawFromForkEscrow(uint256[] calldata tokenIds) external;

    /**
     * @notice Execute the fork. Only possible if the fork threshold has been met.
     * This will deploy a new DAO and send part of the treasury to the new DAO's treasury.
     * This will also close the active escrow and all nouns in the escrow belong to the original DAO.
     * @return forkTreasury The address of the new DAO's treasury
     * @return forkToken The address of the new DAO's token
     */
    function executeFork() external returns (address forkTreasury, address forkToken);

    /**
     * @notice Joins a fork while a fork is active
     * @param tokenIds the tokenIds to send to the DAO in exchange for joining the fork
     * @param proposalIds array of proposal ids which are the reason for wanting to fork. This will only be used to emit event.
     * @param reason the reason for want to fork. This will only be used to emit event.
     */
    function joinFork(uint256[] calldata tokenIds, uint256[] calldata proposalIds, string calldata reason) external;

    /**
     * @notice Withdraws nouns from the fork escrow to the treasury after the fork has been executed
     * @dev Only the DAO can call this function
     * @param tokenIds the tokenIds to withdraw
     */
    function withdrawDAONounsFromEscrowToTreasury(uint256[] calldata tokenIds) external;

    /**
     * @notice Withdraws nouns from the fork escrow after the fork has been executed to an address other than the treasury
     * @dev Only the DAO can call this function
     * @param tokenIds the tokenIds to withdraw
     * @param to the address to send the nouns to
     */
    function withdrawDAONounsFromEscrowIncreasingTotalSupply(uint256[] calldata tokenIds, address to) external;

    /**
     * @notice Returns the number of nouns in supply minus nouns owned by the DAO, i.e. held in the treasury or in an
     * escrow after it has closed.
     * This is used when calculating proposal threshold, quorum, fork threshold & treasury split.
     */
    function adjustedTotalSupply() external view returns (uint256);

    /**
     * @notice returns the required number of tokens to escrow to trigger a fork
     */
    function forkThreshold() external view returns (uint256);

    /**
     * @notice Returns the number of tokens currently in escrow, contributing to the fork threshold
     */
    function numTokensInForkEscrow() external view returns (uint256);

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   VOTES
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Vetoes a proposal only if sender is the vetoer and the proposal has not been executed.
     * @param proposalId The id of the proposal to veto
     */
    function veto(uint256 proposalId) external;

    /**
     * @notice Cast a vote for a proposal
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote. 0=against, 1=for, 2=abstain
     */
    function castVote(uint256 proposalId, uint8 support) external;

    function castRefundableVote(uint256 proposalId, uint8 support, uint32 clientId) external;

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
    function castRefundableVote(uint256 proposalId, uint8 support) external;

    function castRefundableVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason,
        uint32 clientId
    ) external;

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
    function castRefundableVoteWithReason(uint256 proposalId, uint8 support, string calldata reason) external;

    /**
     * @notice Cast a vote for a proposal with a reason
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote. 0=against, 1=for, 2=abstain
     * @param reason The reason given for the vote by the voter
     */
    function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason) external;

    /**
     * @notice Cast a vote for a proposal by signature
     * @dev External function that accepts EIP-712 signatures for voting on proposals.
     */
    function castVoteBySig(uint256 proposalId, uint8 support, uint8 v, bytes32 r, bytes32 s) external;

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   STATE VARIABLE GETTERS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    function admin() external view returns (address);

    function implementation() external view returns (address);

    function vetoer() external view returns (address);

    function pendingVetoer() external view returns (address);

    function votingDelay() external view returns (uint256);

    function votingPeriod() external view returns (uint256);

    function proposalThresholdBPS() external view returns (uint256);

    function quorumVotesBPS() external view returns (uint256);

    function proposalCount() external view returns (uint256);

    function timelock() external view returns (INounsDAOExecutor);

    function nouns() external view returns (NounsTokenLike);

    function latestProposalIds(address account) external view returns (uint256);

    function lastMinuteWindowInBlocks() external view returns (uint256);

    function objectionPeriodDurationInBlocks() external view returns (uint256);

    function erc20TokensToIncludeInFork() external view returns (address[] memory);

    function forkEscrow() external view returns (INounsDAOForkEscrow);

    function forkDAODeployer() external view returns (IForkDAODeployer);

    function forkEndTimestamp() external view returns (uint256);

    function forkPeriod() external view returns (uint256);

    function forkThresholdBPS() external view returns (uint256);

    function proposalUpdatablePeriodInBlocks() external view returns (uint256);

    function timelockV1() external view returns (address);

    function voteSnapshotBlockSwitchProposalId() external view returns (uint256);
}
