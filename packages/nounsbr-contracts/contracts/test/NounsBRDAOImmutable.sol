// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import '../governance/NounsBRDAOLogicV1.sol';

contract NounsBRDAOImmutable is NounsBRDAOLogicV1 {
    constructor(
        address timelock_,
        address nounsbr_,
        address admin_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        uint256 quorumVotesBPS_
    ) {
        admin = msg.sender;
        initialize(timelock_, nounsbr_, vetoer_, votingPeriod_, votingDelay_, proposalThresholdBPS_, quorumVotesBPS_);

        admin = admin_;
    }

    function initialize(
        address timelock_,
        address nounsbr_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        uint256 quorumVotesBPS_
    ) public override {
        require(msg.sender == admin, 'NounsBRDAO::initialize: admin only');
        require(address(timelock) == address(0), 'NounsBRDAO::initialize: can only initialize once');

        timelock = INounsBRDAOExecutor(timelock_);
        nounsbr = NounsBRTokenLike(nounsbr_);
        vetoer = vetoer_;
        votingPeriod = votingPeriod_;
        votingDelay = votingDelay_;
        proposalThresholdBPS = proposalThresholdBPS_;
        quorumVotesBPS = quorumVotesBPS_;
    }
}
