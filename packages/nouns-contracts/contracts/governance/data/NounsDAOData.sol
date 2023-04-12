// SPDX-License-Identifier: GPL-3.0

/// @title Nouns DAO Data Contract

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

import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { NounsDAOV3Proposals } from '../NounsDAOV3Proposals.sol';
import { NounsTokenLike } from '../NounsDAOInterfaces.sol';

contract NounsDAOData is OwnableUpgradeable {
    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   ERRORS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    error MustBeNounerOrPaySufficientFee();
    error SlugAlreadyUsed();
    error SlugDoesNotExist();
    error MustBeNouner();

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   EVENTS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    event ProposalCandidateCreated(
        address indexed msgSender,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        string description,
        string slug,
        bytes32 encodedProposalHash
    );
    event ProposalCandidateUpdated(
        address indexed msgSender,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        string description,
        string slug,
        bytes32 encodedProposalHash
    );
    event ProposalCandidateCanceled(address indexed msgSender, string slug);
    event SignatureAdded(
        address indexed msgSender,
        address indexed signer,
        bytes sig,
        uint256 expirationTimestamp,
        address proposer,
        string slug,
        bytes32 encodedPropHash,
        string reason
    );
    event FeedbackSent(address indexed msgSender, uint256 proposalId, uint8 support, string reason);
    event CreateCandidateCostSet(uint256 oldCreateCandidateCost, uint256 newCreateCandidateCost);
    event UpdateCandidateCostSet(uint256 oldUpdateCandidateCost, uint256 newUpdateCandidateCost);

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   STATE
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /// @notice The cost non-Nouners must pay in ETH in order to emit a new proposal candidate event from this contract.
    uint256 public createCandidateCost;
    /// @notice The cost non-Nouners must pay in ETH in order to emit a proposal candidate update event from this contract.
    uint256 public updateCandidateCost;
    /// @notice The Nouns token contract.
    NounsTokenLike public nounsToken;
    /// @notice The state of which (proposer,slug) pairs have been used to create a proposal candidate.
    mapping(address => mapping(bytes32 => bool)) public propCandidates;

    /**
     * @notice Initialize this data availability contract.
     * @param admin the account that can set config state like `createCandidateCost` and `updateCandidateCost`
     * @param createCandidateCost_ the cost non-Nouners must pay in ETH in order to emit a new proposal candidate event from this contract.
     * @param updateCandidateCost_ the cost non-Nouners must pay in ETH in order to emit a proposal candidate update event from this contract.
     * @param nounsToken_ the Nouns token contract.
     */
    function initialize(
        address admin,
        uint256 createCandidateCost_,
        uint256 updateCandidateCost_,
        address nounsToken_
    ) external initializer {
        _transferOwnership(admin);

        createCandidateCost = createCandidateCost_;
        updateCandidateCost = updateCandidateCost_;

        nounsToken = NounsTokenLike(nounsToken_);
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   PUBLIC/EXTERNAL
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /**
     * @notice Create a new proposal candidate by emitting an event. Nouners can post for free, while non-Nouners must pay `createCandidateCost` in ETH.
     * @dev Reverts if the proposer (msg.sender) has already created a candidate with the same slug.
     * @param targets the candidate proposal targets.
     * @param values the candidate proposal values.
     * @param signatures the candidate proposal signatures.
     * @param calldatas the candidate proposal calldatas.
     * @param description the candidate proposal description.
     * @param slug the candidate proposal slug string, used alognside the proposer to uniquely identify candidates.
     */
    function createProposalCandidate(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description,
        string memory slug
    ) external payable {
        if (!isNouner(msg.sender) && msg.value < createCandidateCost) revert MustBeNounerOrPaySufficientFee();
        if (propCandidates[msg.sender][keccak256(bytes(slug))]) revert SlugAlreadyUsed();

        propCandidates[msg.sender][keccak256(bytes(slug))] = true;

        bytes memory encodedProp = NounsDAOV3Proposals.calcProposalEncodeData(
            msg.sender,
            NounsDAOV3Proposals.ProposalTxs(targets, values, signatures, calldatas),
            description
        );

        emit ProposalCandidateCreated(
            msg.sender,
            targets,
            values,
            signatures,
            calldatas,
            description,
            slug,
            keccak256(encodedProp)
        );
    }

    /**
     * @notice Update a proposal candidate by emitting an event. Nouners can update for free, while non-Nouners must pay `updateCandidateCost` in ETH.
     * @dev Reverts if the proposer (msg.sender) has not already created a candidate with the same slug.
     * @param targets the candidate proposal targets.
     * @param values the candidate proposal values.
     * @param signatures the candidate proposal signatures.
     * @param calldatas the candidate proposal calldatas.
     * @param description the candidate proposal description.
     * @param slug the candidate proposal slug string, used alognside the proposer to uniquely identify candidates.
     */
    function updateProposalCandidate(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description,
        string memory slug
    ) external payable {
        if (!isNouner(msg.sender) && msg.value < updateCandidateCost) revert MustBeNounerOrPaySufficientFee();
        if (!propCandidates[msg.sender][keccak256(bytes(slug))]) revert SlugDoesNotExist();

        bytes memory encodedProp = NounsDAOV3Proposals.calcProposalEncodeData(
            msg.sender,
            NounsDAOV3Proposals.ProposalTxs(targets, values, signatures, calldatas),
            description
        );

        emit ProposalCandidateUpdated(
            msg.sender,
            targets,
            values,
            signatures,
            calldatas,
            description,
            slug,
            keccak256(encodedProp)
        );
    }

    /**
     * @notice Cancel a proposal candidate by emitting an event.
     * @dev Reverts if the proposer (msg.sender) has not already created a candidate with the same slug.
     * @param slug the candidate proposal slug string, used alognside the proposer to uniquely identify candidates.
     */
    function cancelProposalCandidate(string memory slug) external {
        if (!propCandidates[msg.sender][keccak256(bytes(slug))]) revert SlugDoesNotExist();

        emit ProposalCandidateCanceled(msg.sender, slug);
    }

    /**
     * @notice Add a signature supporting a new candidate to be proposed to the DAO using `proposeBySigs`, by emitting an event with the signature data.
     * @param signer the signer's address.
     * @param sig the signature bytes.
     * @param expirationTimestamp the signature's expiration timestamp.
     * @param encodedPropHash the keccak256 hash of the candidate version signed; the hash is performed on the output of
     * the `NounsDAOV3Proposals.calcProposalEncodeData` function.
     */
    function addSignature(
        address signer,
        bytes memory sig,
        uint256 expirationTimestamp,
        address proposer,
        string memory slug,
        bytes32 encodedPropHash,
        string memory reason
    ) external {
        if (!propCandidates[proposer][keccak256(bytes(slug))]) revert SlugDoesNotExist();

        emit SignatureAdded(msg.sender, signer, sig, expirationTimestamp, proposer, slug, encodedPropHash, reason);
    }

    /**
     * @notice Send feedback on a proposal. Meant to be used during a proposal's Updatable period, to help proposers receive
     * valuable feedback and update their proposal in time.
     * @param proposalId the ID of the proposal.
     * @param support msg.sender's vote-like feedback: for, against or abstain.
     * @param reason their free text feedback.
     */
    function sendFeedback(
        uint256 proposalId,
        uint8 support,
        string memory reason
    ) external {
        if (!isNouner(msg.sender)) revert MustBeNouner();

        emit FeedbackSent(msg.sender, proposalId, support, reason);
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   ADMIN (OWNER) FUNCTIONS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    function setCreateCandidateCost(uint256 newCreateCandidateCost) external onlyOwner {
        uint256 oldCreateCandidateCost = createCandidateCost;
        createCandidateCost = newCreateCandidateCost;

        emit CreateCandidateCostSet(oldCreateCandidateCost, newCreateCandidateCost);
    }

    function setUpdateCandidateCost(uint256 newUpdateCandidateCost) external onlyOwner {
        uint256 oldUpdateCandidateCost = updateCandidateCost;
        updateCandidateCost = newUpdateCandidateCost;

        emit UpdateCandidateCostSet(oldUpdateCandidateCost, newUpdateCandidateCost);
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   INTERNAL
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    function isNouner(address account) internal view returns (bool) {
        return nounsToken.getPriorVotes(account, block.number - 1) > 0;
    }
}
