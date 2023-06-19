// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import '../governance/DAOLogicV1.sol';

contract DAOLogicV1Harness is DAOLogicV1 {
    function initialize(
        address timelock_,
        address vrbs_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        uint256 quorumVotesBPS_
    ) public override {
        require(msg.sender == admin, 'VrbsDAO::initialize: admin only');
        require(address(timelock) == address(0), 'VrbsDAO::initialize: can only initialize once');

        timelock = IDAOExecutor(timelock_);
        vrbs = VrbsTokenLike(vrbs_);
        vetoer = vetoer_;
        votingPeriod = votingPeriod_;
        votingDelay = votingDelay_;
        proposalThresholdBPS = proposalThresholdBPS_;
        quorumVotesBPS = quorumVotesBPS_;
    }
}
