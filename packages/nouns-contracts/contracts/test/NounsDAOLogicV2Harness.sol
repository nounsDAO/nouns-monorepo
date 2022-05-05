// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import '../governance/NounsDAOLogicV2.sol';

contract NounsDAOLogicV2Harness is NounsDAOLogicV2 {
    function initialize(
        address timelock_,
        address nouns_,
        address vetoer_,
        uint32 votingPeriod_,
        uint32 votingDelay_,
        uint256 proposalThresholdBPS_,
        DynamicQuorumParams calldata dynamicQuorumParams_
    ) public override {
        require(msg.sender == admin, 'NounsDAO::initialize: admin only');
        require(address(timelock) == address(0), 'NounsDAO::initialize: can only initialize once');

        timelock = INounsDAOExecutor(timelock_);
        nouns = NounsTokenLike(nouns_);
        vetoer = vetoer_;
        proposalThresholdBPS = proposalThresholdBPS_;
        _setVotingPeriodInternal(votingPeriod_);
        _setVotingDelayInternal(votingDelay_);
        _setDynamicQuorumParams(dynamicQuorumParams_);
    }
}
