// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../governance/GovernorNDelegate.sol";

contract GovernorNDelegateHarness is GovernorNDelegate {
	// @notice Harness initiate the GovenorBravo contract
	// @dev This function bypasses the need to initiate the GovernorN contract from an existing GovernorAlpha for testing.
	// Actual use will only use the _initiate(address) function
    function _initiate() external {
        proposalCount = 1;
        initialProposalId = 1;
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
}