// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import '../governance/NounsDAOLogicV2.sol';

contract NounsDAOLogicV2Harness is NounsDAOLogicV2 {
    function initialize(
        address timelock_,
        address nouns_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        uint256 minQuorumVotesBPS_,
        uint256 maxQuorumVotesBPS_,
        uint256[4] calldata quorumPolynomCoefs_
    ) public override {
        require(msg.sender == admin, 'NounsDAO::initialize: admin only');
        require(address(timelock) == address(0), 'NounsDAO::initialize: can only initialize once');

        timelock = INounsDAOExecutor(timelock_);
        nouns = NounsTokenLike(nouns_);
        vetoer = vetoer_;
        votingPeriod = votingPeriod_;
        votingDelay = votingDelay_;
        proposalThresholdBPS = proposalThresholdBPS_;
        minQuorumVotesBPS = minQuorumVotesBPS_;
        maxQuorumVotesBPS = maxQuorumVotesBPS_;
        quorumPolynomCoefs = quorumPolynomCoefs_;
    }
}
