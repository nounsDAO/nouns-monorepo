// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import '../governance/NDAOLogicV1.sol';

contract NDAOImmutable is NDAOLogicV1 {
    constructor(
        address timelock_,
        address nouns_,
        address cryptopunksVote_,
        address admin_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        uint256 quorumVotesBPS_
    ) {
        admin = msg.sender;
        initialize(timelock_, nouns_, cryptopunksVote_, vetoer_, votingPeriod_, votingDelay_, proposalThresholdBPS_, quorumVotesBPS_);

        admin = admin_;
    }

    function initialize(
        address timelock_,
        address npunks_,
        address cryptopunksVote_,
        address vetoer_,
        uint256 votingPeriod_,
        uint256 votingDelay_,
        uint256 proposalThresholdBPS_,
        uint256 quorumVotesBPS_
    ) public override {
        require(msg.sender == admin, 'NounsDAO::initialize: admin only');
        require(address(timelock) == address(0), 'NounsDAO::initialize: can only initialize once');

        timelock = IDAOExecutor(timelock_);
        npunks = NTokenLike(npunks_);
        cryptopunksVote = CryptopunksVote(cryptopunksVote_);
        vetoer = vetoer_;
        votingPeriod = votingPeriod_;
        votingDelay = votingDelay_;
        proposalThresholdBPS = proposalThresholdBPS_;
        quorumVotesBPS = quorumVotesBPS_;
    }
}
