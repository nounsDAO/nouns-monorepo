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
// See NounsDAOLogicV2 for additional modifications.

// NounsDAOLogicV3: TODO

pragma solidity ^0.8.6;

import './NounsDAOInterfaces.sol';
import { NounsDAODynamicQuorum } from './NounsDAODynamicQuorum.sol';
import { SignatureChecker } from '@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol';

contract NounsDAOLogicV3 is NounsDAOStorageV3, NounsDAOEventsV3 {
    /// @notice The name of this contract
    string public constant name = 'Nouns DAO';

    /// @notice The minimum setable proposal threshold
    uint256 public constant MIN_PROPOSAL_THRESHOLD_BPS = 1; // 1 basis point or 0.01%

    /// @notice The maximum setable proposal threshold
    uint256 public constant MAX_PROPOSAL_THRESHOLD_BPS = 1_000; // 1,000 basis points or 10%

    /// @notice The minimum setable voting period
    uint256 public constant MIN_VOTING_PERIOD = 5_760; // About 24 hours

    /// @notice The max setable voting period
    uint256 public constant MAX_VOTING_PERIOD = 80_640; // About 2 weeks

    /// @notice The min setable voting delay
    uint256 public constant MIN_VOTING_DELAY = 1;

    /// @notice The max setable voting delay
    uint256 public constant MAX_VOTING_DELAY = 40_320; // About 1 week

    /// @notice The lower bound of minimum quorum votes basis points
    uint256 public constant MIN_QUORUM_VOTES_BPS_LOWER_BOUND = 200; // 200 basis points or 2%

    /// @notice The upper bound of minimum quorum votes basis points
    uint256 public constant MIN_QUORUM_VOTES_BPS_UPPER_BOUND = 2_000; // 2,000 basis points or 20%

    /// @notice The upper bound of maximum quorum votes basis points
    uint256 public constant MAX_QUORUM_VOTES_BPS_UPPER_BOUND = 6_000; // 4,000 basis points or 60%

    /// @notice The maximum setable quorum votes basis points
    uint256 public constant MAX_QUORUM_VOTES_BPS = 2_000; // 2,000 basis points or 20%

    /// @notice The maximum number of actions that can be included in a proposal
    uint256 public constant proposalMaxOperations = 10; // 10 actions

    /// @notice The maximum priority fee used to cap gas refunds in `castRefundableVote`
    uint256 public constant MAX_REFUND_PRIORITY_FEE = 2 gwei;

    /// @notice The vote refund gas overhead, including 7K for ETH transfer and 29K for general transaction overhead
    uint256 public constant REFUND_BASE_GAS = 36000;

    /// @notice The maximum gas units the DAO will refund voters on; supports about 9,190 characters
    uint256 public constant MAX_REFUND_GAS_USED = 200_000;

    /// @notice The maximum basefee the DAO will refund voters on
    uint256 public constant MAX_REFUND_BASE_FEE = 200 gwei;

    /// @notice The EIP-712 typehash for the contract's domain
    bytes32 public constant DOMAIN_TYPEHASH =
        keccak256('EIP712Domain(string name,uint256 chainId,address verifyingContract)');

    /// @notice The EIP-712 typehash for the ballot struct used by the contract
    bytes32 public constant BALLOT_TYPEHASH = keccak256('Ballot(uint256 proposalId,uint8 support)');

    /// @dev Introduced these errors to reduce contract size, to avoid deployment failure
    error AdminOnly();
    error InvalidMinQuorumVotesBPS();
    error InvalidMaxQuorumVotesBPS();
    error MinQuorumBPSGreaterThanMaxQuorumBPS();
    error UnsafeUint16Cast();
    error VetoerOnly();
    error PendingVetoerOnly();
    error VetoerBurned();
    error CantVetoExecutedProposal();
    error CantCancelExecutedProposal();
    error OnlyProposerCanEdit();
    error CanOnlyEditPendingProposals();
    error ProposalInfoArityMismatch();
    error MustProvideActions();
    error TooManyActions();
    error InvalidSignature();
    error ProposerAlreadyHasALiveProposal();
    error ProposalSignatureNonceAlreadyUsed();

    /**
     * @notice Used to initialize the contract during delegator contructor
     * @param timelock_ The address of the NounsDAOExecutor
     * @param nouns_ The address of the NOUN tokens
     * @param vetoer_ The address allowed to unilaterally veto proposals
     * @param votingPeriod_ The initial voting period
     * @param votingDelay_ The initial voting delay
     * @param proposalThresholdBPS_ The initial proposal threshold in basis points
     * @param dynamicQuorumParams_ The initial dynamic quorum parameters
     * @param lastMinuteWindowInBlocks_ The last minute window that activates the objection period, in blocks
     * @param objectionPeriodDurationInBlocks_ The duration of the objection period, in blocks
     * @param extensionLogic_ The address of the extension contract
     */
    function initialize(
        address timelock_,
        address nouns_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        DynamicQuorumParams calldata dynamicQuorumParams_,
        uint256 lastMinuteWindowInBlocks_,
        uint256 objectionPeriodDurationInBlocks_,
        address extensionLogic_
    ) public virtual {
        require(address(timelock) == address(0), 'NounsDAO::initialize: can only initialize once');
        if (msg.sender != admin) {
            revert AdminOnly();
        }
        require(timelock_ != address(0), 'NounsDAO::initialize: invalid timelock address');
        require(nouns_ != address(0), 'NounsDAO::initialize: invalid nouns address');
        require(
            votingPeriod_ >= MIN_VOTING_PERIOD && votingPeriod_ <= MAX_VOTING_PERIOD,
            'NounsDAO::initialize: invalid voting period'
        );
        require(
            votingDelay_ >= MIN_VOTING_DELAY && votingDelay_ <= MAX_VOTING_DELAY,
            'NounsDAO::initialize: invalid voting delay'
        );
        require(
            proposalThresholdBPS_ >= MIN_PROPOSAL_THRESHOLD_BPS && proposalThresholdBPS_ <= MAX_PROPOSAL_THRESHOLD_BPS,
            'NounsDAO::initialize: invalid proposal threshold bps'
        );

        emit VotingPeriodSet(votingPeriod, votingPeriod_);
        emit VotingDelaySet(votingDelay, votingDelay_);
        emit ProposalThresholdBPSSet(proposalThresholdBPS, proposalThresholdBPS_);

        timelock = INounsDAOExecutor(timelock_);
        nouns = NounsTokenLike(nouns_);
        vetoer = vetoer_;
        votingPeriod = votingPeriod_;
        votingDelay = votingDelay_;
        proposalThresholdBPS = proposalThresholdBPS_;
        NounsDAODynamicQuorum._setDynamicQuorumParams(
            quorumParamsCheckpoints,
            quorumVotesBPS,
            dynamicQuorumParams_.minQuorumVotesBPS,
            dynamicQuorumParams_.maxQuorumVotesBPS,
            dynamicQuorumParams_.quorumCoefficient
        );

        lastMinuteWindowInBlocks = lastMinuteWindowInBlocks_; // e.g. 7200 blocks = 1 days
        objectionPeriodDurationInBlocks = objectionPeriodDurationInBlocks_; // e.g. 14400 blocks = 2 days
        extensionLogic = extensionLogic_;
    }

    fallback() external payable virtual {
        _fallback(extensionLogic);
    }

    /**
     * @dev Using this extra fallback function to avoid this compilation error:
     * Only local variables are supported. To access storage variables, use the ".slot" and ".offset" suffixes.
     * Code was copied from OpenZeppelin's Proxy.sol.
     */
    function _fallback(address extensionLogic_) internal virtual {
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.
            let result := delegatecall(gas(), extensionLogic_, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    struct ProposalTemp {
        uint256 totalSupply;
        uint256 proposalThreshold;
        uint256 latestProposalId;
        uint256 startBlock;
        uint256 endBlock;
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
    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) public returns (uint256) {
        ProposalTemp memory temp;
        temp.totalSupply = nouns.totalSupply();
        temp.startBlock = block.number + votingDelay;
        temp.proposalThreshold = bps2Uint(proposalThresholdBPS, temp.totalSupply);
        require(
            nouns.getPriorVotes(msg.sender, block.number - 1) > temp.proposalThreshold,
            'NounsDAO::propose: proposer votes below proposal threshold'
        );
        _checkProposalInputs(targets, values, signatures, calldatas);
        _checkNoActiveProp(msg.sender);

        proposalCount++;
        Proposal storage newProposal = _createNewProposal(
            proposalCount,
            temp.proposalThreshold,
            targets,
            values,
            signatures,
            calldatas,
            temp.startBlock
        );

        latestProposalIds[newProposal.proposer] = newProposal.id;

        _emitNewPropEvents(newProposal, targets, values, signatures, calldatas, description);

        return newProposal.id;
    }

    function proposeBySigs(
        ProposerSignature[] memory proposerSignatures,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256) {
        _checkProposalInputs(targets, values, signatures, calldatas);
        uint256 proposalId = proposalCount = proposalCount + 1;
        uint256 startBlock = block.number + votingDelay;
        bytes32 proposalHash = keccak256(abi.encode(targets, values, signatures, calldatas, description));

        uint256 votes;
        address[] memory proposers = new address[](proposerSignatures.length);
        for (uint256 i = 0; i < proposerSignatures.length; ++i) {
            _checkPropSig(proposalHash, proposerSignatures[i]);
            address signer = proposers[i] = proposerSignatures[i].signer;

            _checkNoActiveProp(signer);
            latestProposalIds[signer] = proposalId;

            votes += nouns.getPriorVotes(signer, block.number - 1);
        }

        Proposal storage newProposal = _createNewProposal(
            proposalId,
            _checkPropThreshold(votes),
            targets,
            values,
            signatures,
            calldatas,
            startBlock
        );
        newProposal.proposers = proposers;

        _emitNewPropEvents(newProposal, targets, values, signatures, calldatas, description);

        return proposalId;
    }

    function _createNewProposal(
        uint256 proposalId,
        uint256 proposalThreshold,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        uint256 startBlock
    ) internal returns (Proposal storage newProposal) {
        newProposal = _proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.proposer = msg.sender;
        newProposal.proposalThreshold = proposalThreshold;
        newProposal.eta = 0;
        newProposal.targets = targets;
        newProposal.values = values;
        newProposal.signatures = signatures;
        newProposal.calldatas = calldatas;
        newProposal.startBlock = startBlock;
        newProposal.endBlock = startBlock + votingPeriod;
        newProposal.forVotes = 0;
        newProposal.againstVotes = 0;
        newProposal.abstainVotes = 0;
        newProposal.canceled = false;
        newProposal.executed = false;
        newProposal.vetoed = false;
        newProposal.totalSupply = nouns.totalSupply();
        newProposal.creationBlock = block.number;
    }

    function _emitNewPropEvents(
        Proposal storage newProposal,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) internal {
        /// @notice Maintains backwards compatibility with GovernorBravo events
        emit ProposalCreated(
            newProposal.id,
            msg.sender,
            targets,
            values,
            signatures,
            calldatas,
            newProposal.startBlock,
            newProposal.endBlock,
            description
        );

        /// @notice Updated event with `proposalThreshold` and `minQuorumVotes`
        /// @notice `minQuorumVotes` is always zero since V2 introduces dynamic quorum with checkpoints
        emit ProposalCreatedWithRequirements(
            newProposal.id,
            msg.sender,
            targets,
            values,
            signatures,
            calldatas,
            newProposal.startBlock,
            newProposal.endBlock,
            newProposal.proposalThreshold,
            minQuorumVotes(),
            description
        );
    }

    function _checkNoActiveProp(address proposer) internal view {
        uint256 latestProposalId = latestProposalIds[proposer];
        if (latestProposalId != 0) {
            ProposalState proposersLatestProposalState = state(latestProposalId);
            if (
                proposersLatestProposalState == ProposalState.Active ||
                proposersLatestProposalState == ProposalState.Pending
            ) revert ProposerAlreadyHasALiveProposal();
        }
    }

    function _checkPropSig(bytes32 proposalHash, ProposerSignature memory propSig) internal {
        if (proposeBySigNonces[propSig.signer][propSig.nonce]) revert ProposalSignatureNonceAlreadyUsed();
        proposeBySigNonces[propSig.signer][propSig.nonce] = true;

        bytes32 proposalAndNonceHash = keccak256(abi.encodePacked(proposalHash, propSig.nonce));

        if (!SignatureChecker.isValidSignatureNow(propSig.signer, proposalAndNonceHash, propSig.sig))
            revert InvalidSignature();
    }

    function _propDigest(bytes32 proposalHash) internal view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    '\x19\x01',
                    keccak256(abi.encode(DOMAIN_TYPEHASH, keccak256(bytes(name)), getChainIdInternal(), address(this))),
                    proposalHash
                )
            );
    }

    function _checkPropThreshold(uint256 votes) internal view returns (uint256 propThreshold) {
        uint256 totalSupply = nouns.totalSupply();
        propThreshold = bps2Uint(proposalThresholdBPS, totalSupply);

        require(votes > propThreshold, 'NounsDAO::propose: proposer votes below proposal threshold');
    }

    function updateProposal(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external {
        _checkProposalInputs(targets, values, signatures, calldatas);
        Proposal storage proposal = _proposals[proposalId];
        if (state(proposalId) != ProposalState.Pending) revert CanOnlyEditPendingProposals();
        if (msg.sender != proposal.proposer) revert OnlyProposerCanEdit();

        proposal.targets = targets;
        proposal.values = values;
        proposal.signatures = signatures;
        proposal.calldatas = calldatas;

        emit ProposalUpdated(proposalId, msg.sender, targets, values, signatures, calldatas, description);
    }

    function updateProposalBySigs(
        uint256 proposalId,
        ProposerSignature[] memory proposerSignatures,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external {
        _checkProposalInputs(targets, values, signatures, calldatas);
        Proposal storage proposal = _proposals[proposalId];
        if (state(proposalId) != ProposalState.Pending) revert CanOnlyEditPendingProposals();

        address[] memory proposers = proposal.proposers;
        if (proposerSignatures.length != proposers.length) revert OnlyProposerCanEdit();

        bytes32 proposalHash = keccak256(abi.encode(targets, values, signatures, calldatas, description));
        for (uint256 i = 0; i < proposerSignatures.length; ++i) {
            _checkPropSig(proposalHash, proposerSignatures[i]);

            // To avoid the gas cost of having to search signers in proposers, we're assuming the sigs we get
            // use the same amount of signers and the same order.
            if (proposers[i] != proposerSignatures[i].signer) revert OnlyProposerCanEdit();
        }

        proposal.targets = targets;
        proposal.values = values;
        proposal.signatures = signatures;
        proposal.calldatas = calldatas;

        emit ProposalUpdated(proposalId, msg.sender, targets, values, signatures, calldatas, description);
    }

    function _checkProposalInputs(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas
    ) internal pure {
        if (
            targets.length != values.length || targets.length != signatures.length || targets.length != calldatas.length
        ) revert ProposalInfoArityMismatch();
        if (targets.length == 0) revert MustProvideActions();
        if (targets.length > proposalMaxOperations) revert TooManyActions();
    }

    /**
     * @notice Queues a proposal of state succeeded
     * @param proposalId The id of the proposal to queue
     */
    function queue(uint256 proposalId) external {
        require(
            state(proposalId) == ProposalState.Succeeded,
            'NounsDAO::queue: proposal can only be queued if it is succeeded'
        );
        Proposal storage proposal = _proposals[proposalId];
        uint256 eta = block.timestamp + timelock.delay();
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            queueOrRevertInternal(
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
    function execute(uint256 proposalId) external {
        require(
            state(proposalId) == ProposalState.Queued,
            'NounsDAO::execute: proposal can only be executed if it is queued'
        );
        Proposal storage proposal = _proposals[proposalId];
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
        emit ProposalExecuted(proposalId);
    }

    /**
     * @notice Cancels a proposal only if sender is the proposer, or proposer delegates dropped below proposal threshold
     * @param proposalId The id of the proposal to cancel
     */
    function cancel(uint256 proposalId) external {
        if (state(proposalId) == ProposalState.Executed) {
            revert CantCancelExecutedProposal();
        }

        Proposal storage proposal = _proposals[proposalId];
        address proposer = proposal.proposer;

        uint256 votes;
        bool msgSenderIsProposer = proposer == msg.sender;
        if (proposer != address(0)) {
            votes = nouns.getPriorVotes(proposer, block.number - 1);
        } else {
            address[] memory proposers = proposal.proposers;
            for (uint256 i = 0; i < proposers.length; ++i) {
                msgSenderIsProposer = msgSenderIsProposer || msg.sender == proposers[i];
                votes += nouns.getPriorVotes(proposers[i], block.number - 1);
            }
        }

        require(
            msgSenderIsProposer || votes <= proposal.proposalThreshold,
            'NounsDAO::cancel: proposer above threshold'
        );

        proposal.canceled = true;
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            timelock.cancelTransaction(
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
    function state(uint256 proposalId) public view returns (ProposalState) {
        require(proposalCount >= proposalId, 'NounsDAO::state: invalid proposal id');
        Proposal storage proposal = _proposals[proposalId];
        if (proposal.vetoed) {
            return ProposalState.Vetoed;
        } else if (proposal.canceled) {
            return ProposalState.Canceled;
        } else if (block.number <= proposal.startBlock) {
            return ProposalState.Pending;
        } else if (block.number <= proposal.endBlock) {
            return ProposalState.Active;
        } else if (block.number <= proposal.objectionPeriodEndBlock) {
            return ProposalState.ObjectionPeriod;
        } else if (isDefeated(proposal)) {
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
    function castVote(uint256 proposalId, uint8 support) external {
        emit VoteCast(msg.sender, proposalId, support, castVoteInternal(msg.sender, proposalId, support), '');
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
        castRefundableVoteInternal(proposalId, support, '');
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
        castRefundableVoteInternal(proposalId, support, reason);
    }

    /**
     * @notice Internal function that carries out refundable voting logic
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote. 0=against, 1=for, 2=abstain
     * @param reason The reason given for the vote by the voter
     * @dev Reentrancy is defended against in `castVoteInternal` at the `receipt.hasVoted == false` require statement.
     */
    function castRefundableVoteInternal(
        uint256 proposalId,
        uint8 support,
        string memory reason
    ) internal {
        uint256 startGas = gasleft();
        uint96 votes = castVoteInternal(msg.sender, proposalId, support);
        emit VoteCast(msg.sender, proposalId, support, votes, reason);
        if (votes > 0) {
            _refundGas(startGas);
        }
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
        emit VoteCast(msg.sender, proposalId, support, castVoteInternal(msg.sender, proposalId, support), reason);
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
        bytes32 domainSeparator = keccak256(
            abi.encode(DOMAIN_TYPEHASH, keccak256(bytes(name)), getChainIdInternal(), address(this))
        );
        bytes32 structHash = keccak256(abi.encode(BALLOT_TYPEHASH, proposalId, support));
        bytes32 digest = keccak256(abi.encodePacked('\x19\x01', domainSeparator, structHash));
        address signatory = ecrecover(digest, v, r, s);
        require(signatory != address(0), 'NounsDAO::castVoteBySig: invalid signature');
        emit VoteCast(signatory, proposalId, support, castVoteInternal(signatory, proposalId, support), '');
    }

    /**
     * @notice Internal function that caries out voting logic
     * @param voter The voter that is casting their vote
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote. 0=against, 1=for, 2=abstain
     * @return The number of votes cast
     */
    function castVoteInternal(
        address voter,
        uint256 proposalId,
        uint8 support
    ) internal returns (uint96) {
        ProposalState proposalState = state(proposalId);

        if (proposalState == ProposalState.Active) {
            return castVoteDuringVotingPeriodInternal(voter, proposalId, support);
        } else if (proposalState == ProposalState.ObjectionPeriod) {
            require(support == 0, 'can only object with an against vote');
            return castObjectionInternal(voter, proposalId);
        }

        revert('NounsDAO::castVoteInternal: voting is closed');
    }

    function castVoteDuringVotingPeriodInternal(
        address voter,
        uint256 proposalId,
        uint8 support
    ) internal returns (uint96) {
        require(state(proposalId) == ProposalState.Active, 'NounsDAO::castVoteInternal: voting is closed');
        require(support <= 2, 'NounsDAO::castVoteInternal: invalid vote type');
        Proposal storage proposal = _proposals[proposalId];
        Receipt storage receipt = proposal.receipts[voter];
        require(receipt.hasVoted == false, 'NounsDAO::castVoteInternal: voter already voted');

        /// @notice: Unlike GovernerBravo, votes are considered from the block the proposal was created in order to normalize quorumVotes and proposalThreshold metrics
        uint96 votes = nouns.getPriorVotes(voter, proposalCreationBlock(proposal));

        bool isDefeatedBefore = isDefeated(proposal);

        if (support == 0) {
            proposal.againstVotes = proposal.againstVotes + votes;
        } else if (support == 1) {
            proposal.forVotes = proposal.forVotes + votes;
        } else if (support == 2) {
            proposal.abstainVotes = proposal.abstainVotes + votes;
        }

        if (
            // haven't turn on objection yet
            proposal.objectionPeriodEndBlock == 0 &&
            // only for votes can trigger an objection period
            support == 1 &&
            // this vote flips the proposal
            isDefeatedBefore &&
            !isDefeated(proposal) &&
            // we're in the last minute window
            (proposal.endBlock - block.number < lastMinuteWindowInBlocks)
        ) {
            proposal.objectionPeriodEndBlock = proposal.endBlock + objectionPeriodDurationInBlocks;
        }

        receipt.hasVoted = true;
        receipt.support = support;
        receipt.votes = votes;

        return votes;
    }

    function castObjectionInternal(address voter, uint256 proposalId) internal returns (uint96) {
        require(state(proposalId) == ProposalState.ObjectionPeriod, 'not in objection period');
        Proposal storage proposal = _proposals[proposalId];
        Receipt storage receipt = proposal.receipts[voter];
        require(receipt.hasVoted == false, 'NounsDAO::castVoteInternal: voter already voted');

        uint96 votes = receipt.votes = nouns.getPriorVotes(voter, proposalCreationBlock(proposal));
        receipt.hasVoted = true;
        receipt.support = 0;
        proposal.againstVotes = proposal.againstVotes + votes;

        return votes;
    }

    function isDefeated(Proposal storage proposal) internal view returns (bool) {
        return proposal.forVotes <= proposal.againstVotes || proposal.forVotes < quorumVotes(proposal.id);
    }

    function proposalCreationBlock(Proposal storage proposal) internal view returns (uint256) {
        if (proposal.creationBlock == 0) {
            return proposal.startBlock - votingDelay;
        }
        return proposal.creationBlock;
    }

    /**
     * @notice Quorum votes required for a specific proposal to succeed
     * Differs from `GovernerBravo` which uses fixed amount
     * @dev used in `isDefeated()`, which is used in `state()`.
     */
    function quorumVotes(uint256 proposalId) public view returns (uint256) {
        Proposal storage proposal = _proposals[proposalId];
        return NounsDAODynamicQuorum.quorumVotes(proposal, quorumParamsCheckpoints, quorumVotesBPS);
    }

    function _refundGas(uint256 startGas) internal {
        unchecked {
            uint256 balance = address(this).balance;
            if (balance == 0) {
                return;
            }
            uint256 basefee = min(block.basefee, MAX_REFUND_BASE_FEE);
            uint256 gasPrice = min(tx.gasprice, basefee + MAX_REFUND_PRIORITY_FEE);
            uint256 gasUsed = min(startGas - gasleft() + REFUND_BASE_GAS, MAX_REFUND_GAS_USED);
            uint256 refundAmount = min(gasPrice * gasUsed, balance);
            (bool refundSent, ) = msg.sender.call{ value: refundAmount }('');
            emit RefundableVote(msg.sender, refundAmount, refundSent);
        }
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @notice Current min quorum votes using Noun total supply
     * @dev used in `propose`
     */
    function minQuorumVotes() public view returns (uint256) {
        return
            bps2Uint(
                NounsDAODynamicQuorum
                    .getDynamicQuorumParamsAt(quorumParamsCheckpoints, block.number, quorumVotesBPS)
                    .minQuorumVotesBPS,
                nouns.totalSupply()
            );
    }

    function bps2Uint(uint256 bps, uint256 number) internal pure returns (uint256) {
        return (number * bps) / 10000;
    }

    function getChainIdInternal() internal view returns (uint256) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        return chainId;
    }

    receive() external payable {}
}
