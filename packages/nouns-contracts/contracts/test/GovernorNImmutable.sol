// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../governance/GovernorNDelegate.sol";

contract GovernorNImmutable is GovernorNDelegate {

     constructor(
            address timelock_,
            address nouns_,
            address admin_,
            address vetoer_,
            uint votingPeriod_,
            uint votingDelay_,
            uint proposalThresholdBPS_,
            uint quorumVotesBPS_) {
        admin = msg.sender;
        initialize(timelock_, nouns_, vetoer_, votingPeriod_, votingDelay_, proposalThresholdBPS_, quorumVotesBPS_);

        admin = admin_;
    }


    function initialize(address timelock_, address nouns_, address vetoer_, uint votingPeriod_, uint votingDelay_, uint proposalThresholdBPS_, uint quorumVotesBPS_) override public {
        require(msg.sender == admin, "GovernorN::initialize: admin only");
        require(address(timelock) == address(0), "GovernorN::initialize: can only initialize once");
        
        timelock = TimelockInterface(timelock_);
        nouns = NounsInterface(nouns_);
        vetoer = vetoer_;
        votingPeriod = votingPeriod_;
        votingDelay = votingDelay_;
        proposalThresholdBPS = proposalThresholdBPS_;
        quorumVotesBPS = quorumVotesBPS_;
    }
}
