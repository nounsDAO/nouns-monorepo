// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import '../governance/NounsBRDAOLogicV2.sol';

contract NounsBRDAOLogicV2Harness is NounsBRDAOLogicV2 {
    function initialize(
        address timelock_,
        address nounsbr_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        DynamicQuorumParams calldata dynamicQuorumParams_
    ) public override {
        require(msg.sender == admin, 'NounsBRDAO::initialize: admin only');
        require(address(timelock) == address(0), 'NounsBRDAO::initialize: can only initialize once');

        timelock = INounsBRDAOExecutor(timelock_);
        nounsbr = NounsBRTokenLike(nounsbr_);
        vetoer = vetoer_;
        votingPeriod = votingPeriod_;
        votingDelay = votingDelay_;
        proposalThresholdBPS = proposalThresholdBPS_;
        _setDynamicQuorumParams(
            dynamicQuorumParams_.minQuorumVotesBPS,
            dynamicQuorumParams_.maxQuorumVotesBPS,
            dynamicQuorumParams_.quorumCoefficient
        );
    }
}
