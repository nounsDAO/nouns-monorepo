// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import '../governance/N00unsDAOLogicV1.sol';

contract N00unsDAOImmutable is N00unsDAOLogicV1 {
    constructor(
        address timelock_,
        address n00uns_,
        address admin_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        uint256 quorumVotesBPS_
    ) {
        admin = msg.sender;
        initialize(timelock_, n00uns_, vetoer_, votingPeriod_, votingDelay_, proposalThresholdBPS_, quorumVotesBPS_);

        admin = admin_;
    }

    function initialize(
        address timelock_,
        address n00uns_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        uint256 quorumVotesBPS_
    ) public override {
        require(msg.sender == admin, 'N00unsDAO::initialize: admin only');
        require(address(timelock) == address(0), 'N00unsDAO::initialize: can only initialize once');

        timelock = IN00unsDAOExecutor(timelock_);
        n00uns = N00unsTokenLike(n00uns_);
        vetoer = vetoer_;
        votingPeriod = votingPeriod_;
        votingDelay = votingDelay_;
        proposalThresholdBPS = proposalThresholdBPS_;
        quorumVotesBPS = quorumVotesBPS_;
    }
}
