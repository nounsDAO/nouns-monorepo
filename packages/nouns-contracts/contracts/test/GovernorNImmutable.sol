// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../governance/GovernorNDelegate.sol";

contract GovernorNImmutable is GovernorNDelegate {

     constructor(
            address timelock_,
            address comp_,
            address admin_,
            uint votingPeriod_,
            uint votingDelay_,
            uint proposalThreshold_) {
        admin = msg.sender;
        initialize(timelock_, comp_, votingPeriod_, votingDelay_, proposalThreshold_);

        admin = admin_;
    }


    function initialize(address timelock_, address comp_, uint votingPeriod_, uint votingDelay_, uint proposalThreshold_) override public {
        require(msg.sender == admin, "GovernorN::initialize: admin only");
        require(address(timelock) == address(0), "GovernorN::initialize: can only initialize once");
        
        timelock = TimelockInterface(timelock_);
        comp = CompInterface(comp_);
        votingPeriod = votingPeriod_;
        votingDelay = votingDelay_;
        proposalThreshold = proposalThreshold_;
    }

    function _initiate() public {
        proposalCount = 1;
        initialProposalId = 1;
    }
}
