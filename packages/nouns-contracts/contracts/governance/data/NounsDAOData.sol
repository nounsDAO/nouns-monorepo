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

pragma solidity ^0.8.19;

import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { NounsDAOV3Proposals } from '../NounsDAOV3Proposals.sol';
import { NounsTokenLike } from '../NounsDAOInterfaces.sol';
import { SignatureChecker } from '@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol';
import { UUPSUpgradeable } from '@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol';

contract NounsDAOData is OwnableUpgradeable, UUPSUpgradeable {
    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   ERRORS
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    error MustBeNounerOrPaySufficientFee();
    error SlugAlreadyUsed();
    error SlugDoesNotExist();
    error MustBeNouner();
    error AmountExceedsBalance();
    error FailedWithdrawingETH(bytes data);
    error InvalidSignature();
    error InvalidSupportValue();

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
        bytes32 encodedProposalHash,
        string reason
    );
    event ProposalCandidateCanceled(address indexed msgSender, string slug);
    event SignatureAdded(
        address indexed signer,
        bytes sig,
        uint256 expirationTimestamp,
        address proposer,
        string slug,
        bytes32 encodedPropHash,
        bytes32 sigDigest,
        string reason
    );
    event FeedbackSent(address indexed msgSender, uint256 proposalId, uint96 votes, uint8 support, string reason);
    event CreateCandidateCostSet(uint256 oldCreateCandidateCost, uint256 newCreateCandidateCost);
    event UpdateCandidateCostSet(uint256 oldUpdateCandidateCost, uint256 newUpdateCandidateCost);
    event ETHWithdrawn(address indexed to, uint256 amount);

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   STATE
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    /// @notice The number of blocks before the current block where account votes are counted.
    uint256 public constant PRIOR_VOTES_BLOCKS_AGO = 1;

    /// @notice The Nouns token contract.
    NounsTokenLike public immutable nounsToken;
    /// @notice The Nouns DAO contract.
    address public immutable nounsDao;
    /// @notice The cost non-Nouners must pay in ETH in order to emit a new proposal candidate event from this contract.
    uint256 public createCandidateCost;
    /// @notice The cost non-Nouners must pay in ETH in order to emit a proposal candidate update event from this contract.
    uint256 public updateCandidateCost;
    /// @notice The state of which (proposer,slug) pairs have been used to create a proposal candidate.
    mapping(address => mapping(bytes32 => bool)) public propCandidates;

    constructor(address nounsToken_, address nounsDao_) {
        nounsToken = NounsTokenLike(nounsToken_);
        nounsDao = nounsDao_;
    }

    /**
     * @notice Initialize this data availability contract.
     * @param admin the account that can set config state like `createCandidateCost` and `updateCandidateCost`
     * @param createCandidateCost_ the cost non-Nouners must pay in ETH in order to emit a new proposal candidate event from this contract.
     * @param updateCandidateCost_ the cost non-Nouners must pay in ETH in order to emit a proposal candidate update event from this contract.
     */
    function initialize(
        address admin,
        uint256 createCandidateCost_,
        uint256 updateCandidateCost_
    ) external initializer {
        _transferOwnership(admin);

        createCandidateCost = createCandidateCost_;
        updateCandidateCost = updateCandidateCost_;
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
     * @param reason the free text reason and context for the update.
     */
    function updateProposalCandidate(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description,
        string memory slug,
        string memory reason
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
            keccak256(encodedProp),
            reason
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
     * Only lets the signer account submit their signature, to minimize potential spam.
     * @param sig the signature bytes.
     * @param expirationTimestamp the signature's expiration timestamp.
     * @param proposer the proposer account that posted the candidate proposal with the provided slug.
     * @param slug the slug of the proposal candidate signer signed on.
     * @param encodedProp the abi encoding of the candidate version signed; should be identical to the output of
     * the `NounsDAOV3Proposals.calcProposalEncodeData` function.
     * @param reason signer's reason free text.
     */
    function addSignature(
        bytes memory sig,
        uint256 expirationTimestamp,
        address proposer,
        string memory slug,
        bytes memory encodedProp,
        string memory reason
    ) external {
        if (!propCandidates[proposer][keccak256(bytes(slug))]) revert SlugDoesNotExist();

        bytes32 sigDigest = NounsDAOV3Proposals.sigDigest(
            NounsDAOV3Proposals.PROPOSAL_TYPEHASH,
            encodedProp,
            expirationTimestamp,
            nounsDao
        );

        if (!SignatureChecker.isValidSignatureNow(msg.sender, sigDigest, sig)) revert InvalidSignature();

        emit SignatureAdded(
            msg.sender,
            sig,
            expirationTimestamp,
            proposer,
            slug,
            keccak256(encodedProp),
            sigDigest,
            reason
        );
    }

    /**
     * @notice Send feedback on a proposal. Meant to be used during a proposal's Updatable period, to help proposers receive
     * valuable feedback and update their proposal in time.
     * @param proposalId the ID of the proposal.
     * @param support msg.sender's vote-like feedback: 0 is against, 1 is for, 2 is abstain.
     * @param reason their free text feedback.
     */
    function sendFeedback(
        uint256 proposalId,
        uint8 support,
        string memory reason
    ) external {
        if (support > 2) revert InvalidSupportValue();
        uint96 votes = nounsToken.getPriorVotes(msg.sender, block.number - PRIOR_VOTES_BLOCKS_AGO);
        if (votes == 0) revert MustBeNouner();

        emit FeedbackSent(msg.sender, proposalId, votes, support, reason);
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
     * @notice Withdraw ETH from this contract's balance. Only owner can call this function.
     * @param to the recipient.
     * @param amount the ETH amount to send.
     */
    function withdrawETH(address to, uint256 amount) external onlyOwner {
        if (amount > address(this).balance) revert AmountExceedsBalance();

        (bool sent, bytes memory data) = to.call{ value: amount }('');
        if (!sent) {
            revert FailedWithdrawingETH(data);
        }

        emit ETHWithdrawn(to, amount);
    }

    /**
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *   INTERNAL
     * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     */

    function isNouner(address account) internal view returns (bool) {
        return nounsToken.getPriorVotes(account, block.number - PRIOR_VOTES_BLOCKS_AGO) > 0;
    }

    /**
     * @dev Function that should revert when `msg.sender` is not authorized to upgrade the contract. Called by
     * {upgradeTo} and {upgradeToAndCall}.
     *
     * Normally, this function will use an xref:access.adoc[access control] modifier such as {Ownable-onlyOwner}.
     *
     * ```solidity
     * function _authorizeUpgrade(address) internal override onlyOwner {}
     * ```
     */
    function _authorizeUpgrade(address) internal view override onlyOwner {}
}
