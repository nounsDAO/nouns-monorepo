// SPDX-License-Identifier: BSD-3-Clause

/// @title Nouns DAO Logic V3 storage

pragma solidity ^0.8.6;

import { NounsDAOProxyStorage, INounsDAOExecutorV2, NounsTokenLike } from './NounsDAOInterfaces.sol';

contract NounsDAOStorageV3 is NounsDAOProxyStorage {
    /// @notice Vetoer who has the ability to veto any proposal
    address public vetoer;

    /// @notice The delay before voting on a proposal may take place, once proposed, in blocks
    uint256 public votingDelay;

    /// @notice The duration of voting on a proposal, in blocks
    uint256 public votingPeriod;

    /// @notice The basis point number of votes required in order for a voter to become a proposer. *DIFFERS from GovernerBravo
    uint256 public proposalThresholdBPS;

    /// @notice The basis point number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed. *DIFFERS from GovernerBravo
    uint256 public quorumVotesBPS;

    /// @notice The total number of proposals
    uint256 public proposalCount;

    /// @notice The address of the Nouns DAO Executor NounsDAOExecutor
    INounsDAOExecutorV2 public timelock;

    /// @notice The address of the Nouns tokens
    NounsTokenLike public nouns;

    /// @notice The official record of all proposals ever proposed
    mapping(uint256 => Proposal) internal _proposals;

    /// @notice The latest proposal for each proposer
    mapping(address => uint256) public latestProposalIds;

    DynamicQuorumParamsCheckpoint[] public quorumParamsCheckpoints;

    /// @notice Pending new vetoer
    address public pendingVetoer;

    uint256 public lastMinuteWindowInBlocks;
    uint256 public objectionPeriodDurationInBlocks;

    uint32 public ragequitPenaltyBPs;

    address[] public redeemableAssets;
}

/// @notice Ballot receipt record for a voter
struct Receipt {
    /// @notice Whether or not a vote has been cast
    bool hasVoted;
    /// @notice Whether or not the voter supports the proposal or abstains
    uint8 support;
    /// @notice The number of votes the voter had, which were cast
    uint96 votes;
}

struct Proposal {
    /// @notice Unique id for looking up a proposal
    uint256 id;
    /// @notice Creator of the proposal
    address proposer;
    /// @notice The number of votes needed to create a proposal at the time of proposal creation. *DIFFERS from GovernerBravo
    uint256 proposalThreshold;
    /// @notice The number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed at the time of proposal creation. *DIFFERS from GovernerBravo
    uint256 quorumVotes;
    /// @notice The timestamp that the proposal will be available for execution, set once the vote succeeds
    uint256 eta;
    /// @notice the ordered list of target addresses for calls to be made
    address[] targets;
    /// @notice The ordered list of values (i.e. msg.value) to be passed to the calls to be made
    uint256[] values;
    /// @notice The ordered list of function signatures to be called
    string[] signatures;
    /// @notice The ordered list of calldata to be passed to each call
    bytes[] calldatas;
    /// @notice The block at which voting begins: holders must delegate their votes prior to this block
    uint256 startBlock;
    /// @notice The block at which voting ends: votes must be cast prior to this block
    uint256 endBlock;
    /// @notice Current number of votes in favor of this proposal
    uint256 forVotes;
    /// @notice Current number of votes in opposition to this proposal
    uint256 againstVotes;
    /// @notice Current number of votes for abstaining for this proposal
    uint256 abstainVotes;
    /// @notice Flag marking whether the proposal has been canceled
    bool canceled;
    /// @notice Flag marking whether the proposal has been vetoed
    bool vetoed;
    /// @notice Flag marking whether the proposal has been executed
    bool executed;
    /// @notice Receipts of ballots for the entire set of voters
    mapping(address => Receipt) receipts;
    /// @notice The total supply at the time of proposal creation
    uint256 totalSupply;
    /// @notice The block at which this proposal was created
    uint256 creationBlock;
    uint256 objectionPeriodEndBlock;
}

/// @notice Possible states that a proposal may be in
enum ProposalState {
    Pending,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed,
    Vetoed,
    ObjectionPeriod
}

struct DynamicQuorumParams {
    /// @notice The minimum basis point number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed.
    uint16 minQuorumVotesBPS;
    /// @notice The maximum basis point number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed.
    uint16 maxQuorumVotesBPS;
    /// @notice The dynamic quorum coefficient
    /// @dev Assumed to be fixed point integer with 6 decimals, i.e 0.2 is represented as 0.2 * 1e6 = 200000
    uint32 quorumCoefficient;
}

/// @notice A checkpoint for storing dynamic quorum params from a given block
struct DynamicQuorumParamsCheckpoint {
    /// @notice The block at which the new values were set
    uint32 fromBlock;
    /// @notice The parameter values of this checkpoint
    DynamicQuorumParams params;
}

struct ProposalCondensed {
    /// @notice Unique id for looking up a proposal
    uint256 id;
    /// @notice Creator of the proposal
    address proposer;
    /// @notice The number of votes needed to create a proposal at the time of proposal creation. *DIFFERS from GovernerBravo
    uint256 proposalThreshold;
    /// @notice The minimum number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed at the time of proposal creation. *DIFFERS from GovernerBravo
    uint256 quorumVotes;
    /// @notice The timestamp that the proposal will be available for execution, set once the vote succeeds
    uint256 eta;
    /// @notice The block at which voting begins: holders must delegate their votes prior to this block
    uint256 startBlock;
    /// @notice The block at which voting ends: votes must be cast prior to this block
    uint256 endBlock;
    /// @notice Current number of votes in favor of this proposal
    uint256 forVotes;
    /// @notice Current number of votes in opposition to this proposal
    uint256 againstVotes;
    /// @notice Current number of votes for abstaining for this proposal
    uint256 abstainVotes;
    /// @notice Flag marking whether the proposal has been canceled
    bool canceled;
    /// @notice Flag marking whether the proposal has been vetoed
    bool vetoed;
    /// @notice Flag marking whether the proposal has been executed
    bool executed;
    /// @notice The total supply at the time of proposal creation
    uint256 totalSupply;
    /// @notice The block at which this proposal was created
    uint256 creationBlock;
}