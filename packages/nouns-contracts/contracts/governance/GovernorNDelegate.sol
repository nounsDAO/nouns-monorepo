// SPDX-License-Identifier: MIT

/**
 * GovernorN forks [Compound Governance GovernorBravo](https://github.com/compound-finance/compound-protocol/blob/b9b14038612d846b83f8a009a82c38974ff2dcfe/contracts/Governance/GovernorBravoDelegate.sol)
 *
 * GovernorN REMOVES:
 * - `initialProposalId` and `_initiate()` due to this being the
 *   first instance of the governance contract unlike
 *   GovernorBravo which upgrades GovernorAlpha
 *
 * - Value passed along using `timelock.executeTransaction{value: proposal.value}` in `execute(uint proposalId)`.
 *   This contract should not hold funds and to guarantee it doesn't, all funds sent are forwarded to
 *   timelock (see `receive()` and `fallback()`). Since timelock is the owner of the Nouns token, and proceeds of auctions
 *   are sent there, without this removal, execution of transactions would fail as this contract
 *   does not have the value to send along.
 *
 * GovernorN ADDS:
 * - Proposal Threshold basis points instead of fixed number
 *   due to the Noun token's increasing supply
 *
 * - Quorum Votes basis points instead of fixed number
 *   due to the Noun token's increasing supply
 *
 * - Per proposal storing of fixed `proposalThreshold`
 *   and `quorumVotes` calculated using the Noun token's total supply
 *   at the block the proposal was created and the basis point parameters
 *
 * - `ProposalCreatedWithRequirements` event that emits `ProposalCreated` parameters with
 *   the addition of `proposalThreshold` and `quorumVotes`
 *
 * - Votes are counted from the block a proposal is created instead of
 *   the proposal's voting start block to align with the parameters
 *   stored with the proposal
 *
 * - Veto ability which allows `veteor` to halt any proposal at any stage unless
 *   the proposal is executed.
 *   The `veto(uint proposalId)` logic is a modified version of `cancel(uint proposalId)`
 *   A `vetoed` flag was added to the `Proposal` struct to support this.
 *
 * - Fallback functions `receive()` and `fallback()` that forward value to timelock.
 *   This contract should not hold funds and to guarantee it doesn't, all funds sent are
 *   forwarded to timelock, which acts as treasury.
 */

pragma solidity ^0.8.4;

import "./GovernorNInterfaces.sol";

contract GovernorNDelegate is GovernorNDelegateStorageV1, GovernorNEvents {

    /// @notice The name of this contract
    string public constant name = "GovernorN";

    /// @notice The minimum setable proposal threshold
    uint public constant MIN_PROPOSAL_THRESHOLD_BPS = 1; // 1 basis point or 0.01%

    /// @notice The maximum setable proposal threshold
    uint public constant MAX_PROPOSAL_THRESHOLD_BPS = 1_000; // 1,000 basis points or 10%

    /// @notice The minimum setable voting period
    uint public constant MIN_VOTING_PERIOD = 5_760; // About 24 hours

    /// @notice The max setable voting period
    uint public constant MAX_VOTING_PERIOD = 80_640; // About 2 weeks

    /// @notice The min setable voting delay
    uint public constant MIN_VOTING_DELAY = 1;

    /// @notice The max setable voting delay
    uint public constant MAX_VOTING_DELAY = 40_320; // About 1 week

    /// @notice The minimum setable quorum votes basis points
    uint public constant MIN_QUORUM_VOTES_BPS = 200; // 200 basis points or 2%

    /// @notice The maximum setable quorum votes basis points
    uint public constant MAX_QUORUM_VOTES_BPS = 2_000; // 2,000 basis points or 20%

    /// @notice The maximum number of actions that can be included in a proposal
    uint public constant proposalMaxOperations = 10; // 10 actions

    /// @notice The EIP-712 typehash for the contract's domain
    bytes32 public constant DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,uint256 chainId,address verifyingContract)");

    /// @notice The EIP-712 typehash for the ballot struct used by the contract
    bytes32 public constant BALLOT_TYPEHASH = keccak256("Ballot(uint256 proposalId,uint8 support)");

    /**
      * @notice Used to initialize the contract during delegator contructor
      * @param timelock_ The address of the Timelock
      * @param nouns_ The address of the NOUN tokens
      * @param vetoer_ The address allowed to unilaterally veto proposals
      * @param votingPeriod_ The initial voting period
      * @param votingDelay_ The initial voting delay
      * @param proposalThresholdBPS_ The initial proposal threshold in basis points
      * * @param quorumVotesBPS_ The initial quorum votes threshold in basis points
      */
    function initialize(address timelock_, address nouns_, address vetoer_, uint votingPeriod_, uint votingDelay_, uint proposalThresholdBPS_, uint quorumVotesBPS_) virtual public {
        require(address(timelock) == address(0), "GovernorN::initialize: can only initialize once");
        require(msg.sender == admin, "GovernorN::initialize: admin only");
        require(timelock_ != address(0), "GovernorN::initialize: invalid timelock address");
        require(nouns_ != address(0), "GovernorN::initialize: invalid nouns address");
        require(votingPeriod_ >= MIN_VOTING_PERIOD && votingPeriod_ <= MAX_VOTING_PERIOD, "GovernorN::initialize: invalid voting period");
        require(votingDelay_ >= MIN_VOTING_DELAY && votingDelay_ <= MAX_VOTING_DELAY, "GovernorN::initialize: invalid voting delay");
        require(proposalThresholdBPS_ >= MIN_PROPOSAL_THRESHOLD_BPS && proposalThresholdBPS_ <= MAX_PROPOSAL_THRESHOLD_BPS, "GovernorN::initialize: invalid proposal threshold");
        require(quorumVotesBPS_ >= MIN_QUORUM_VOTES_BPS && quorumVotesBPS_ <= MAX_QUORUM_VOTES_BPS, "GovernorN::initialize: invalid proposal threshold");

        emit VotingPeriodSet(votingPeriod, votingPeriod_);
        emit VotingDelaySet(votingDelay, votingDelay_);
        emit ProposalThresholdBPSSet(proposalThresholdBPS, proposalThresholdBPS_);
        emit QuorumVotesBPSSet(quorumVotesBPS, quorumVotesBPS_);

        timelock = TimelockInterface(timelock_);
        nouns = NounsInterface(nouns_);
        vetoer = vetoer_;
        votingPeriod = votingPeriod_;
        votingDelay = votingDelay_;
        proposalThresholdBPS = proposalThresholdBPS_;
        quorumVotesBPS = quorumVotesBPS_;
    }

    struct ProposalTemp {
        uint totalSupply;
        uint proposalThreshold;
        uint latestProposalId;
        uint startBlock;
        uint endBlock;
    }

    /**
      * @notice Function used to propose a new proposal. Sender must have delegates above the proposal threshold
      * @param targets Target addresses for proposal calls
      * @param values Eth values for proposal calls
      * @param signatures Function signatures for proposal calls
      * @param calldatas Calldatas for proposal calls
      * @param description String description of the proposal
      * @return Proposal id of new proposal
      */
    function propose(address[] memory targets, uint[] memory values, string[] memory signatures, bytes[] memory calldatas, string memory description) public returns (uint) {

        ProposalTemp memory temp;

        temp.totalSupply = nouns.totalSupply();

        temp.proposalThreshold = bps2Uint(proposalThresholdBPS, temp.totalSupply);

        require(nouns.getPriorVotes(msg.sender, block.number-1) > temp.proposalThreshold, "GovernorN::propose: proposer votes below proposal threshold");
        require(targets.length == values.length && targets.length == signatures.length && targets.length == calldatas.length, "GovernorN::propose: proposal function information arity mismatch");
        require(targets.length != 0, "GovernorN::propose: must provide actions");
        require(targets.length <= proposalMaxOperations, "GovernorN::propose: too many actions");

        temp.latestProposalId = latestProposalIds[msg.sender];
        if (temp.latestProposalId != 0) {
          ProposalState proposersLatestProposalState = state(temp.latestProposalId);
          require(proposersLatestProposalState != ProposalState.Active, "GovernorN::propose: one live proposal per proposer, found an already active proposal");
          require(proposersLatestProposalState != ProposalState.Pending, "GovernorN::propose: one live proposal per proposer, found an already pending proposal");
        }

        temp.startBlock = block.number + votingDelay;
        temp.endBlock = temp.startBlock + votingPeriod;

        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];

        newProposal.id = proposalCount;
        newProposal.proposer = msg.sender;
        newProposal.proposalThreshold = temp.proposalThreshold;
        newProposal.quorumVotes = bps2Uint(quorumVotesBPS, temp.totalSupply);
        newProposal.eta = 0;
        newProposal.targets = targets;
        newProposal.values = values;
        newProposal.signatures = signatures;
        newProposal.calldatas = calldatas;
        newProposal.startBlock = temp.startBlock;
        newProposal.endBlock = temp.endBlock;
        newProposal.forVotes = 0;
        newProposal.againstVotes = 0;
        newProposal.abstainVotes = 0;
        newProposal.canceled = false;
        newProposal.executed = false;
        newProposal.vetoed = false;

        latestProposalIds[newProposal.proposer] = newProposal.id;

        /// @notice Maintains backwards compatibility with GovernorBravo events
        emit ProposalCreated(newProposal.id, msg.sender, targets, values, signatures, calldatas, newProposal.startBlock, newProposal.endBlock, description);

        /// @notice Updated event with `proposalThreshold` and `quorumVotes`
        emit ProposalCreatedWithRequirements(newProposal.id, msg.sender, targets, values, signatures, calldatas, newProposal.startBlock, newProposal.endBlock, newProposal.proposalThreshold, newProposal.quorumVotes, description);

        return newProposal.id;
    }

    /**
      * @notice Queues a proposal of state succeeded
      * @param proposalId The id of the proposal to queue
      */
    function queue(uint proposalId) external {
        require(state(proposalId) == ProposalState.Succeeded, "GovernorN::queue: proposal can only be queued if it is succeeded");
        Proposal storage proposal = proposals[proposalId];
        uint eta = block.timestamp + timelock.delay();
        for (uint i = 0; i < proposal.targets.length; i++) {
            queueOrRevertInternal(proposal.targets[i], proposal.values[i], proposal.signatures[i], proposal.calldatas[i], eta);
        }
        proposal.eta = eta;
        emit ProposalQueued(proposalId, eta);
    }

    function queueOrRevertInternal(address target, uint value, string memory signature, bytes memory data, uint eta) internal {
        require(!timelock.queuedTransactions(keccak256(abi.encode(target, value, signature, data, eta))), "GovernorN::queueOrRevertInternal: identical proposal action already queued at eta");
        timelock.queueTransaction(target, value, signature, data, eta);
    }

    /**
      * @notice Executes a queued proposal if eta has passed
      * @param proposalId The id of the proposal to execute
      */
    function execute(uint proposalId) external {
        require(state(proposalId) == ProposalState.Queued, "GovernorN::execute: proposal can only be executed if it is queued");
        Proposal storage proposal = proposals[proposalId];
        proposal.executed = true;
        for (uint i = 0; i < proposal.targets.length; i++) {
            timelock.executeTransaction(proposal.targets[i], proposal.values[i], proposal.signatures[i], proposal.calldatas[i], proposal.eta);
        }
        emit ProposalExecuted(proposalId);
    }

    /**
      * @notice Cancels a proposal only if sender is the proposer, or proposer delegates dropped below proposal threshold
      * @param proposalId The id of the proposal to cancel
      */
    function cancel(uint proposalId) external {
        require(state(proposalId) != ProposalState.Executed, "GovernorN::cancel: cannot cancel executed proposal");

        Proposal storage proposal = proposals[proposalId];
        require(msg.sender == proposal.proposer || nouns.getPriorVotes(proposal.proposer, block.number-1) < proposal.proposalThreshold, "GovernorN::cancel: proposer above threshold");

        proposal.canceled = true;
        for (uint i = 0; i < proposal.targets.length; i++) {
            timelock.cancelTransaction(proposal.targets[i], proposal.values[i], proposal.signatures[i], proposal.calldatas[i], proposal.eta);
        }

        emit ProposalCanceled(proposalId);
    }

    /**
      * @notice Vetoes a proposal only if sender is the vetoer and the proposal has not been executed.
      * @param proposalId The id of the proposal to veto
      */
    function veto(uint proposalId) external {
        require(vetoer != address(0), "GovernorN::veto: veto power burned");
        require(msg.sender == vetoer, "GovernorN::veto: only vetoer");
        require(state(proposalId) != ProposalState.Executed, "GovernorN::veto: cannot veto executed proposal");

        Proposal storage proposal = proposals[proposalId];

        proposal.vetoed = true;
        for (uint i = 0; i < proposal.targets.length; i++) {
            timelock.cancelTransaction(proposal.targets[i], proposal.values[i], proposal.signatures[i], proposal.calldatas[i], proposal.eta);
        }

        emit ProposalVetoed(proposalId);
    }

    /**
      * @notice Gets actions of a proposal
      * @param proposalId the id of the proposal
      * @return targets
      * @return values
      * @return signatures
      * @return calldatas
      */
    function getActions(uint proposalId) external view returns (address[] memory targets, uint[] memory values, string[] memory signatures, bytes[] memory calldatas) {
        Proposal storage p = proposals[proposalId];
        return (p.targets, p.values, p.signatures, p.calldatas);
    }

    /**
      * @notice Gets the receipt for a voter on a given proposal
      * @param proposalId the id of proposal
      * @param voter The address of the voter
      * @return The voting receipt
      */
    function getReceipt(uint proposalId, address voter) external view returns (Receipt memory) {
        return proposals[proposalId].receipts[voter];
    }

    /**
      * @notice Gets the state of a proposal
      * @param proposalId The id of the proposal
      * @return Proposal state
      */
    function state(uint proposalId) public view returns (ProposalState) {
        require(proposalCount >= proposalId, "GovernorN::state: invalid proposal id");
        Proposal storage proposal = proposals[proposalId];
        if (proposal.vetoed) {
            return ProposalState.Vetoed;
        } else if (proposal.canceled) {
            return ProposalState.Canceled;
        } else if (block.number <= proposal.startBlock) {
            return ProposalState.Pending;
        } else if (block.number <= proposal.endBlock) {
            return ProposalState.Active;
        } else if (proposal.forVotes <= proposal.againstVotes || proposal.forVotes < proposal.quorumVotes) {
            return ProposalState.Defeated;
        } else if (proposal.eta == 0) {
            return ProposalState.Succeeded;
        } else if (proposal.executed) {
            return ProposalState.Executed;
        } else if (block.timestamp >= proposal.eta + timelock.GRACE_PERIOD()) {
            return ProposalState.Expired;
        } else {
            return ProposalState.Queued;
        }
    }

    /**
      * @notice Cast a vote for a proposal
      * @param proposalId The id of the proposal to vote on
      * @param support The support value for the vote. 0=against, 1=for, 2=abstain
      */
    function castVote(uint proposalId, uint8 support) external {
        emit VoteCast(msg.sender, proposalId, support, castVoteInternal(msg.sender, proposalId, support), "");
    }

    /**
      * @notice Cast a vote for a proposal with a reason
      * @param proposalId The id of the proposal to vote on
      * @param support The support value for the vote. 0=against, 1=for, 2=abstain
      * @param reason The reason given for the vote by the voter
      */
    function castVoteWithReason(uint proposalId, uint8 support, string calldata reason) external {
        emit VoteCast(msg.sender, proposalId, support, castVoteInternal(msg.sender, proposalId, support), reason);
    }

    /**
      * @notice Cast a vote for a proposal by signature
      * @dev External function that accepts EIP-712 signatures for voting on proposals.
      */
    function castVoteBySig(uint proposalId, uint8 support, uint8 v, bytes32 r, bytes32 s) external {
        bytes32 domainSeparator = keccak256(abi.encode(DOMAIN_TYPEHASH, keccak256(bytes(name)), getChainIdInternal(), address(this)));
        bytes32 structHash = keccak256(abi.encode(BALLOT_TYPEHASH, proposalId, support));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        address signatory = ecrecover(digest, v, r, s);
        require(signatory != address(0), "GovernorN::castVoteBySig: invalid signature");
        emit VoteCast(signatory, proposalId, support, castVoteInternal(signatory, proposalId, support), "");
    }

    /**
      * @notice Internal function that caries out voting logic
      * @param voter The voter that is casting their vote
      * @param proposalId The id of the proposal to vote on
      * @param support The support value for the vote. 0=against, 1=for, 2=abstain
      * @return The number of votes cast
      */
    function castVoteInternal(address voter, uint proposalId, uint8 support) internal returns (uint96) {
        require(state(proposalId) == ProposalState.Active, "GovernorN::castVoteInternal: voting is closed");
        require(support <= 2, "GovernorN::castVoteInternal: invalid vote type");
        Proposal storage proposal = proposals[proposalId];
        Receipt storage receipt = proposal.receipts[voter];
        require(receipt.hasVoted == false, "GovernorN::castVoteInternal: voter already voted");

        /// @notice: Unlike GovernerBravo, votes are considered from the block the proposal was created in order to normalize quorumVotes and proposalThreshold metrics
        uint96 votes = nouns.getPriorVotes(voter, proposal.startBlock-votingDelay);

        if (support == 0) {
            proposal.againstVotes = proposal.againstVotes + votes;
        } else if (support == 1) {
            proposal.forVotes = proposal.forVotes + votes;
        } else if (support == 2) {
            proposal.abstainVotes = proposal.abstainVotes + votes;
        }

        receipt.hasVoted = true;
        receipt.support = support;
        receipt.votes = votes;

        return votes;
    }

    /**
      * @notice Admin function for setting the voting delay
      * @param newVotingDelay new voting delay, in blocks
      */
    function _setVotingDelay(uint newVotingDelay) external {
        require(msg.sender == admin, "GovernorN::_setVotingDelay: admin only");
        require(newVotingDelay >= MIN_VOTING_DELAY && newVotingDelay <= MAX_VOTING_DELAY, "GovernorN::_setVotingDelay: invalid voting delay");
        uint oldVotingDelay = votingDelay;
        votingDelay = newVotingDelay;

        emit VotingDelaySet(oldVotingDelay,votingDelay);
    }

    /**
      * @notice Admin function for setting the voting period
      * @param newVotingPeriod new voting period, in blocks
      */
    function _setVotingPeriod(uint newVotingPeriod) external {
        require(msg.sender == admin, "GovernorN::_setVotingPeriod: admin only");
        require(newVotingPeriod >= MIN_VOTING_PERIOD && newVotingPeriod <= MAX_VOTING_PERIOD, "GovernorN::_setVotingPeriod: invalid voting period");
        uint oldVotingPeriod = votingPeriod;
        votingPeriod = newVotingPeriod;

        emit VotingPeriodSet(oldVotingPeriod, votingPeriod);
    }

    /**
      * @notice Admin function for setting the proposal threshold basis points
      * @dev newProposalThresholdBPS must be greater than the hardcoded min
      * @param newProposalThresholdBPS new proposal threshold
      */
    function _setProposalThresholdBPS(uint newProposalThresholdBPS) external {
        require(msg.sender == admin, "GovernorN::_setProposalThresholdBPS: admin only");
        require(newProposalThresholdBPS >= MIN_PROPOSAL_THRESHOLD_BPS && newProposalThresholdBPS <= MAX_PROPOSAL_THRESHOLD_BPS, "GovernorN::_setProposalThreshold: invalid proposal threshold");
        uint oldProposalThresholdBPS = proposalThresholdBPS;
        proposalThresholdBPS = newProposalThresholdBPS;

        emit ProposalThresholdBPSSet(oldProposalThresholdBPS, proposalThresholdBPS);
    }

    /**
      * @notice Admin function for setting the quorum votes basis points
      * @dev newQuorumVotesBPS must be greater than the hardcoded min
      * @param newQuorumVotesBPS new proposal threshold
      */
    function _setQuorumVotesBPS(uint newQuorumVotesBPS) external {
        require(msg.sender == admin, "GovernorN::_setQuorumVotesBPS: admin only");
        require(newQuorumVotesBPS >= MIN_QUORUM_VOTES_BPS && newQuorumVotesBPS <= MAX_QUORUM_VOTES_BPS, "GovernorN::_setProposalThreshold: invalid proposal threshold");
        uint oldQuorumVotesBPS = quorumVotesBPS;
        quorumVotesBPS = newQuorumVotesBPS;

        emit QuorumVotesBPSSet(oldQuorumVotesBPS, quorumVotesBPS);
    }

    /**
      * @notice Begins transfer of admin rights. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.
      * @dev Admin function to begin change of admin. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.
      * @param newPendingAdmin New pending admin.
      */
    function _setPendingAdmin(address newPendingAdmin) external {
        // Check caller = admin
        require(msg.sender == admin, "GovernorN::_setPendingAdmin: admin only");

        // Save current value, if any, for inclusion in log
        address oldPendingAdmin = pendingAdmin;

        // Store pendingAdmin with value newPendingAdmin
        pendingAdmin = newPendingAdmin;

        // Emit NewPendingAdmin(oldPendingAdmin, newPendingAdmin)
        emit NewPendingAdmin(oldPendingAdmin, newPendingAdmin);
    }

    /**
      * @notice Accepts transfer of admin rights. msg.sender must be pendingAdmin
      * @dev Admin function for pending admin to accept role and update admin
      */
    function _acceptAdmin() external {
        // Check caller is pendingAdmin and pendingAdmin ≠ address(0)
        require(msg.sender == pendingAdmin && msg.sender != address(0), "GovernorN::_acceptAdmin: pending admin only");

        // Save current values for inclusion in log
        address oldAdmin = admin;
        address oldPendingAdmin = pendingAdmin;

        // Store admin with value pendingAdmin
        admin = pendingAdmin;

        // Clear the pending value
        pendingAdmin = address(0);

        emit NewAdmin(oldAdmin, admin);
        emit NewPendingAdmin(oldPendingAdmin, pendingAdmin);
    }

    /**
      * @notice Changes vetoer address
      * @dev Vetoer function for updating vetoer address
      */
    function _setVetoer(address newVetoer) public {
        require(msg.sender == vetoer, "GovernorN::_setVetoer: vetoer only");

        emit NewVetoer(vetoer, newVetoer);

        vetoer = newVetoer;
    }

    /**
      * @notice Burns veto priviledges
      * @dev Vetoer function destroying veto power forever
      */
    function _burnVetoPower() public {
        // Check caller is pendingAdmin and pendingAdmin ≠ address(0)
        require(msg.sender == vetoer, "GovernorN::_burnVetoPower: vetoer only");

        _setVetoer(address(0));
    }

    /**
      * @notice Current proposal threshold using Noun Total Supply
      * Differs from `GovernerBravo` which uses fixed amount
      */
    function proposalThreshold() public view returns (uint){
        return bps2Uint(proposalThresholdBPS, nouns.totalSupply());
    }

    /**
      * @notice Current quorum votes using Noun Total Supply
      * Differs from `GovernerBravo` which uses fixed amount
      */
    function quorumVotes() public view returns (uint){
        return bps2Uint(quorumVotesBPS, nouns.totalSupply());
    }

    receive() external payable {
        _fallback();
    }

    fallback() external payable {
        _fallback();
    }

    /**
     * @notice Forwards any value sent to this contract to timelock
     */
    function _fallback() internal{
        (bool success, ) = address(timelock).call{value: msg.value}("");
        require(success, "GovernorN::_fallback: Transaction execution reverted.");
    }

    function bps2Uint(uint bps, uint number) internal pure returns (uint) {
        return number * bps / 10000;
    }

    function getChainIdInternal() internal view returns (uint) {
        uint chainId;
        assembly { chainId := chainid() }
        return chainId;
    }
}