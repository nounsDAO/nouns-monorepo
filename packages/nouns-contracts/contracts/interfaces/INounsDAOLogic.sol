// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

import { INounsDAOExecutor, NounsDAOStorageV2, NounsDAOStorageV3 } from '../governance/NounsDAOInterfaces.sol';

interface INounsDAOLogic {
    function castVote(uint256 proposalId, uint8 support) external;

    function castVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason
    ) external;

    function castRefundableVote(uint256 proposalId, uint8 support) external;

    function castRefundableVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason
    ) external;

    function nouns() external view returns (address);

    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256);

    function votingDelay() external view returns (uint256);

    function votingPeriod() external view returns (uint256);

    function proposalThresholdBPS() external view returns (uint256);

    function proposalThreshold() external view returns (uint256);

    function timelock() external view returns (INounsDAOExecutor);

    function _setVotingPeriod(uint256 newVotingPeriod) external;

    function _setVotingDelay(uint256 newVotingDelay) external;

    function _setProposalThresholdBPS(uint256 newProposalThresholdBPS) external;

    function _setQuorumVotesBPS(uint256 newQuorumVotesBPS) external;

    function _setDynamicQuorumParams(
        uint16 newMinQuorumVotesBPS,
        uint16 newMaxQuorumVotesBPS,
        uint32 newQuorumCoefficient
    ) external;

    function state(uint256 proposalId) external view returns (uint256);

    function cancel(uint256 proposalId) external;

    function queue(uint256 proposalId) external;

    function execute(uint256 proposalId) external;

    // V2

    function getDynamicQuorumParamsAt(uint256 blockNumber_)
        external
        view
        returns (NounsDAOStorageV3.DynamicQuorumParams memory);

    function minQuorumVotes() external view returns (uint256);

    function proposals(uint256 proposalId) external view returns (NounsDAOStorageV2.ProposalCondensed memory);
}
