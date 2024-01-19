// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { NounsDAOStorageV3, NounsTokenLike } from '../../../contracts/governance/NounsDAOInterfaces.sol';

interface INounsDAOShared {
    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256);

    function queue(uint256 proposalId) external;

    function execute(uint256 proposalId) external;

    function cancel(uint256 proposalId) external;

    function castVote(uint256 proposalId, uint8 support) external;

    function castRefundableVote(uint256 proposalId, uint8 support) external;

    function castVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string memory reason
    ) external;

    function veto(uint256 proposalId) external;

    function state(uint256 proposalId) external view returns (NounsDAOStorageV3.ProposalState);

    function timelock() external view returns (address);

    function votingDelay() external view returns (uint256);

    function votingPeriod() external view returns (uint256);

    function proposalThresholdBPS() external view returns (uint256);

    function proposalThreshold() external view returns (uint256);

    function vetoer() external view returns (address);

    function _setVotingPeriod(uint256 votingPeriod_) external;

    function _setVotingDelay(uint256 votingDelay_) external;

    function _setProposalThresholdBPS(uint256 proposalThresholdBPS_) external;

    function _setQuorumVotesBPS(uint256 quorumVotesBPS_) external;

    function _burnVetoPower() external;

    function _setPendingVetoer(address pendingVetoer_) external;

    function pendingVetoer() external view returns (address);

    function _acceptVetoer() external;

    function proposalsV3(uint256 proposalId) external view returns (NounsDAOStorageV3.ProposalCondensed memory);

    function implementation() external view returns (address);

    function nouns() external view returns (NounsTokenLike);

    function proposeBySigs(
        NounsDAOStorageV3.ProposerSignature[] memory proposerSignatures,
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256);
}
