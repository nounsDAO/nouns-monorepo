// SPDX-License-Identifier: BSD-3-Clause

/// @title Nouns DAO Logic interfaces and events

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
// NounsDAOInterfaces.sol is a modified version of Compound Lab's GovernorBravoInterfaces.sol:
// https://github.com/compound-finance/compound-protocol/blob/b9b14038612d846b83f8a009a82c38974ff2dcfe/contracts/Governance/GovernorBravoInterfaces.sol
//
// GovernorBravoInterfaces.sol source code Copyright 2020 Compound Labs, Inc. licensed under the BSD-3-Clause license.
// With modifications by Nounders DAO.
//
// Additional conditions of BSD-3-Clause can be found here: https://opensource.org/licenses/BSD-3-Clause
//
// MODIFICATIONS
// NounsDAOEvents, NounsDAOProxyStorage, NounsDAOStorageV1 add support for changes made by Nouns DAO to GovernorBravo.sol
// See NounsDAOLogicV1.sol for more details.
// NounsDAOStorageV1Adjusted and NounsDAOStorageV2 add support for a dynamic vote quorum.
// See NounsDAOLogicV2.sol for more details.
// NounsDAOStorageV3
// See NounsDAOLogicV3.sol for more details.

pragma solidity ^0.8.19;

interface NounsDAOEventsV3 {
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

    /// @notice An event emitted when a vote has been cast on a proposal
    /// @param voter The address which casted a vote
    /// @param proposalId The proposal id which was voted on
    /// @param support Support value for the vote. 0=against, 1=for, 2=abstain
    /// @param votes Number of votes which were cast by the voter
    /// @param reason The reason given for the vote by the voter
    event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 votes, string reason);

    /// @notice An event emitted when a proposal has been canceled
    event ProposalCanceled(uint256 id);

    /// @notice An event emitted when a proposal has been queued in the NounsDAOExecutor
    event ProposalQueued(uint256 id, uint256 eta);

    /// @notice An event emitted when a proposal has been executed in the NounsDAOExecutor
    event ProposalExecuted(uint256 id);

    /// @notice An event emitted when a proposal has been vetoed by vetoAddress
    event ProposalVetoed(uint256 id);

    /// @notice An event emitted when the voting delay is set
    event VotingDelaySet(uint256 oldVotingDelay, uint256 newVotingDelay);

    /// @notice An event emitted when the voting period is set
    event VotingPeriodSet(uint256 oldVotingPeriod, uint256 newVotingPeriod);

    /// @notice Emitted when proposal threshold basis points is set
    event ProposalThresholdBPSSet(uint256 oldProposalThresholdBPS, uint256 newProposalThresholdBPS);

    /// @notice Emitted when quorum votes basis points is set
    event QuorumVotesBPSSet(uint256 oldQuorumVotesBPS, uint256 newQuorumVotesBPS);

    /// @notice Emitted when pendingAdmin is changed
    event NewPendingAdmin(address oldPendingAdmin, address newPendingAdmin);

    /// @notice Emitted when pendingAdmin is accepted, which means admin is updated
    event NewAdmin(address oldAdmin, address newAdmin);

    /// @notice Emitted when vetoer is changed
    event NewVetoer(address oldVetoer, address newVetoer);

    /// @notice Emitted when minQuorumVotesBPS is set
    event MinQuorumVotesBPSSet(uint16 oldMinQuorumVotesBPS, uint16 newMinQuorumVotesBPS);

    /// @notice Emitted when maxQuorumVotesBPS is set
    event MaxQuorumVotesBPSSet(uint16 oldMaxQuorumVotesBPS, uint16 newMaxQuorumVotesBPS);

    /// @notice Emitted when quorumCoefficient is set
    event QuorumCoefficientSet(uint32 oldQuorumCoefficient, uint32 newQuorumCoefficient);

    /// @notice Emitted when a voter cast a vote requesting a gas refund.
    event RefundableVote(address indexed voter, uint256 refundAmount, bool refundSent);

    /// @notice Emitted when admin withdraws the DAO's balance.
    event Withdraw(uint256 amount, bool sent);

    /// @notice Emitted when pendingVetoer is changed
    event NewPendingVetoer(address oldPendingVetoer, address newPendingVetoer);

    /// @notice An event emitted when a new proposal is created, which includes additional information
    /// @dev V3 adds `signers`, `updatePeriodEndBlock` compared to the V1/V2 event.
    /// @dev V4: Removed data that's already emitted in `ProposalCreated`, added clientId
    event ProposalCreatedWithRequirements(
        uint256 id,
        address[] signers,
        uint256 updatePeriodEndBlock,
        uint256 proposalThreshold,
        uint256 quorumVotes,
        uint32 indexed clientId
    );

    /// @notice Emitted when a proposal is created to be executed on timelockV1
    event ProposalCreatedOnTimelockV1(uint256 id);

    /// @notice Emitted when a proposal is updated
    event ProposalUpdated(
        uint256 indexed id,
        address indexed proposer,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        string description,
        string updateMessage
    );

    /// @notice Emitted when a proposal's transactions are updated
    event ProposalTransactionsUpdated(
        uint256 indexed id,
        address indexed proposer,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        string updateMessage
    );

    /// @notice Emitted when a proposal's description is updated
    event ProposalDescriptionUpdated(
        uint256 indexed id,
        address indexed proposer,
        string description,
        string updateMessage
    );

    /// @notice Emitted when a proposal is set to have an objection period
    event ProposalObjectionPeriodSet(uint256 indexed id, uint256 objectionPeriodEndBlock);

    /// @notice Emitted when someone cancels a signature
    event SignatureCancelled(address indexed signer, bytes sig);

    /// @notice An event emitted when the objection period duration is set
    event ObjectionPeriodDurationSet(
        uint32 oldObjectionPeriodDurationInBlocks,
        uint32 newObjectionPeriodDurationInBlocks
    );

    /// @notice An event emitted when the objection period last minute window is set
    event LastMinuteWindowSet(uint32 oldLastMinuteWindowInBlocks, uint32 newLastMinuteWindowInBlocks);

    /// @notice An event emitted when the proposal updatable period is set
    event ProposalUpdatablePeriodSet(
        uint32 oldProposalUpdatablePeriodInBlocks,
        uint32 newProposalUpdatablePeriodInBlocks
    );

    /// @notice Emitted when the erc20 tokens to include in a fork are set
    event ERC20TokensToIncludeInForkSet(address[] oldErc20Tokens, address[] newErc20tokens);

    /// @notice Emitted when the fork DAO deployer is set
    event ForkDAODeployerSet(address oldForkDAODeployer, address newForkDAODeployer);

    /// @notice Emitted when the during of the forking period is set
    event ForkPeriodSet(uint256 oldForkPeriod, uint256 newForkPeriod);

    /// @notice Emitted when the threshold for forking is set
    event ForkThresholdSet(uint256 oldForkThreshold, uint256 newForkThreshold);

    /// @notice Emitted when the main timelock, timelockV1 and admin are set
    event TimelocksAndAdminSet(address timelock, address timelockV1, address admin);

    /// @notice Emitted when someones adds nouns to the fork escrow
    event EscrowedToFork(
        uint32 indexed forkId,
        address indexed owner,
        uint256[] tokenIds,
        uint256[] proposalIds,
        string reason
    );

    /// @notice Emitted when the owner withdraws their nouns from the fork escrow
    event WithdrawFromForkEscrow(uint32 indexed forkId, address indexed owner, uint256[] tokenIds);

    /// @notice Emitted when the fork is executed and the forking period begins
    event ExecuteFork(
        uint32 indexed forkId,
        address forkTreasury,
        address forkToken,
        uint256 forkEndTimestamp,
        uint256 tokensInEscrow
    );

    /// @notice Emitted when someone joins a fork during the forking period
    event JoinFork(
        uint32 indexed forkId,
        address indexed owner,
        uint256[] tokenIds,
        uint256[] proposalIds,
        string reason
    );

    /// @notice Emitted when the DAO withdraws nouns from the fork escrow after a fork has been executed
    event DAOWithdrawNounsFromEscrow(uint256[] tokenIds, address to);

    /// @notice Emitted when withdrawing nouns from escrow increases adjusted total supply
    event DAONounsSupplyIncreasedFromEscrow(uint256 numTokens, address to);

    /// @notice An event emitted when a vote has been cast with a non-zero client Id.
    /// @dev Assumes the `VoteCast` event is emitted, and that indexers can use the voter address and propose ID to
    /// find the relevant vote and set its client ID.
    event VoteCastWithClientId(address indexed voter, uint256 indexed proposalId, uint32 indexed clientId);
}

interface INounsDAOExecutor {
    function delay() external view returns (uint256);

    function GRACE_PERIOD() external view returns (uint256);

    function acceptAdmin() external;

    function queuedTransactions(bytes32 hash) external view returns (bool);

    function queueTransaction(
        address target,
        uint256 value,
        string calldata signature,
        bytes calldata data,
        uint256 eta
    ) external returns (bytes32);

    function cancelTransaction(
        address target,
        uint256 value,
        string calldata signature,
        bytes calldata data,
        uint256 eta
    ) external;

    function executeTransaction(
        address target,
        uint256 value,
        string calldata signature,
        bytes calldata data,
        uint256 eta
    ) external payable returns (bytes memory);
}

interface NounsTokenLike {
    function getPriorVotes(address account, uint256 blockNumber) external view returns (uint96);

    function totalSupply() external view returns (uint256);

    function transferFrom(address from, address to, uint256 tokenId) external;

    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    function balanceOf(address owner) external view returns (uint256 balance);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function minter() external view returns (address);

    function mint() external returns (uint256);

    function setApprovalForAll(address operator, bool approved) external;
}

interface IForkDAODeployer {
    function deployForkDAO(
        uint256 forkingPeriodEndTimestamp,
        INounsDAOForkEscrow forkEscrowAddress
    ) external returns (address treasury, address token);

    function tokenImpl() external view returns (address);

    function auctionImpl() external view returns (address);

    function governorImpl() external view returns (address);

    function treasuryImpl() external view returns (address);
}

interface INounsDAOExecutorV2 is INounsDAOExecutor {
    function sendETH(address recipient, uint256 ethToSend) external;

    function sendERC20(address recipient, address erc20Token, uint256 tokensToSend) external;
}

interface INounsDAOForkEscrow {
    function markOwner(address owner, uint256[] calldata tokenIds) external;

    function returnTokensToOwner(address owner, uint256[] calldata tokenIds) external;

    function closeEscrow() external returns (uint32);

    function numTokensInEscrow() external view returns (uint256);

    function numTokensOwnedByDAO() external view returns (uint256);

    function withdrawTokens(uint256[] calldata tokenIds, address to) external;

    function forkId() external view returns (uint32);

    function nounsToken() external view returns (NounsTokenLike);

    function dao() external view returns (address);

    function ownerOfEscrowedToken(uint32 forkId_, uint256 tokenId) external view returns (address);
}

interface NounsDAOTypes {
    struct Storage {
        // ================ PROXY ================ //
        /// @notice Administrator for this contract
        address admin;
        /// @notice Pending administrator for this contract
        address pendingAdmin;
        /// @notice Active brains of Governor
        address implementation;
        // ================ V1 ================ //
        /// @notice Vetoer who has the ability to veto any proposal
        address vetoer;
        /// @notice The delay before voting on a proposal may take place, once proposed, in blocks
        uint256 votingDelay;
        /// @notice The duration of voting on a proposal, in blocks
        uint256 votingPeriod;
        /// @notice The basis point number of votes required in order for a voter to become a proposer. *DIFFERS from GovernerBravo
        uint256 proposalThresholdBPS;
        /// @notice The basis point number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed. *DIFFERS from GovernerBravo
        uint256 quorumVotesBPS;
        /// @notice The total number of proposals
        uint256 proposalCount;
        /// @notice The address of the Nouns DAO Executor NounsDAOExecutor
        INounsDAOExecutorV2 timelock;
        /// @notice The address of the Nouns tokens
        NounsTokenLike nouns;
        /// @notice The official record of all proposals ever proposed
        mapping(uint256 => Proposal) _proposals;
        /// @notice The latest proposal for each proposer
        mapping(address => uint256) latestProposalIds;
        // ================ V2 ================ //
        DynamicQuorumParamsCheckpoint[] quorumParamsCheckpoints;
        /// @notice Pending new vetoer
        address pendingVetoer;
        // ================ V3 ================ //
        /// @notice user => sig => isCancelled: signatures that have been cancelled by the signer and are no longer valid
        mapping(address => mapping(bytes32 => bool)) cancelledSigs;
        /// @notice The number of blocks before voting ends during which the objection period can be initiated
        uint32 lastMinuteWindowInBlocks;
        /// @notice Length of the objection period in blocks
        uint32 objectionPeriodDurationInBlocks;
        /// @notice Length of proposal updatable period in block
        uint32 proposalUpdatablePeriodInBlocks;
        /// @notice address of the DAO's fork escrow contract
        INounsDAOForkEscrow forkEscrow;
        /// @notice address of the DAO's fork deployer contract
        IForkDAODeployer forkDAODeployer;
        /// @notice ERC20 tokens to include when sending funds to a deployed fork
        address[] erc20TokensToIncludeInFork;
        /// @notice The treasury contract of the last deployed fork
        address forkDAOTreasury;
        /// @notice The token contract of the last deployed fork
        address forkDAOToken;
        /// @notice Timestamp at which the last fork period ends
        uint256 forkEndTimestamp;
        /// @notice Fork period in seconds
        uint256 forkPeriod;
        /// @notice Threshold defined in basis points (10,000 = 100%) required for forking
        uint256 forkThresholdBPS;
        /// @notice Address of the original timelock
        INounsDAOExecutor timelockV1;
        /// @dev Make sure this stays the last variable in this struct, so we can delete it in the next version
        /// @dev To be zeroed-out in the upcoming DAO upgrade.
        uint256 voteSnapshotBlockSwitchProposalId;
    }

    struct Proposal {
        /// @notice Unique id for looking up a proposal
        uint32 id;
        /// @notice client id for rewards
        uint32 clientId;
        /// @notice currently unused
        uint192 _gap;
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
        uint32 creationBlock;
        /// @notice The timestamp of the block at which this proposal was created
        uint32 creationTimestamp;
        /// @notice The last block which allows updating a proposal's description and transactions
        uint64 updatePeriodEndBlock;
        /// @notice Starts at 0 and is set to the block at which the objection period ends when the objection period is initiated
        uint64 objectionPeriodEndBlock;
        /// @dev unused for now
        uint64 placeholder;
        /// @notice The signers of a proposal, when using proposeBySigs
        address[] signers;
        /// @notice When true, a proposal would be executed on timelockV1 instead of the current timelock
        bool executeOnTimelockV1;
        /// @notice How many votes and vote transactions each clientId contributed to this proposal
        mapping(uint32 => ClientVoteData) voteClients;
    }

    struct ClientVoteData {
        /// @notice The number of votes the client facilitated on a proposal
        uint32 votes;
        /// @notice The number of vote transactions the client facilitated on a proposal
        uint32 txs;
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

    struct ProposerSignature {
        /// @notice Signature of a proposal
        bytes sig;
        /// @notice The address of the signer
        address signer;
        /// @notice The timestamp until which the signature is valid
        uint256 expirationTimestamp;
    }

    /// @notice A subset of Proposal data, used for client rewards calculation
    struct ProposalForRewards {
        /// @notice The proposal's voting period end block
        uint256 endBlock;
        /// @notice The proposal's objection period end block
        uint256 objectionPeriodEndBlock;
        /// @notice The proposal's For votes count
        uint256 forVotes;
        /// @notice The proposal's Against votes count
        uint256 againstVotes;
        /// @notice The proposal's Abstain votes count
        uint256 abstainVotes;
        /// @notice The proposal's snapshot of total supply
        uint256 totalSupply;
        /// @notice The timestamp of the block at which the proposal was created
        uint256 creationTimestamp;
        /// @notice The ID for the client that facilitated the proposal
        uint32 clientId;
        ClientVoteData[] voteData;
    }

    struct ProposalCondensedV3 {
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
        /// @notice The signers of a proposal, when using proposeBySigs
        address[] signers;
        /// @notice The last block which allows updating a proposal's description and transactions
        uint256 updatePeriodEndBlock;
        /// @notice Starts at 0 and is set to the block at which the objection period ends when the objection period is initiated
        uint256 objectionPeriodEndBlock;
        /// @notice When true, a proposal would be executed on timelockV1 instead of the current timelock
        bool executeOnTimelockV1;
    }

    struct ProposalCondensedV2 {
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

    struct DynamicQuorumParams {
        /// @notice The minimum basis point number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed.
        uint16 minQuorumVotesBPS;
        /// @notice The maximum basis point number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed.
        uint16 maxQuorumVotesBPS;
        /// @notice The dynamic quorum coefficient
        /// @dev Assumed to be fixed point integer with 6 decimals, i.e 0.2 is represented as 0.2 * 1e6 = 200000
        uint32 quorumCoefficient;
    }

    struct NounsDAOParams {
        uint256 votingPeriod;
        uint256 votingDelay;
        uint256 proposalThresholdBPS;
        uint32 lastMinuteWindowInBlocks;
        uint32 objectionPeriodDurationInBlocks;
        uint32 proposalUpdatablePeriodInBlocks;
    }

    /// @notice A checkpoint for storing dynamic quorum params from a given block
    struct DynamicQuorumParamsCheckpoint {
        /// @notice The block at which the new values were set
        uint32 fromBlock;
        /// @notice The parameter values of this checkpoint
        DynamicQuorumParams params;
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
        ObjectionPeriod,
        Updatable
    }
}

contract NounsDAOStorage is NounsDAOTypes {
    Storage ds;
}
