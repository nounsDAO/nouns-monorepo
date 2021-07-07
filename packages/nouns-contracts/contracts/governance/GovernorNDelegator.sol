// SPDX-License-Identifier: MIT

/**
 * Modified version of from [Compound Governance GovernorBravoDelegator](https://github.com/compound-finance/compound-protocol/blob/b9b14038612d846b83f8a009a82c38974ff2dcfe/contracts/Governance/GovernorBravoDelegator.sol)
 *
 * This Delegator uses parts of [Open Zeppelin's Proxy.sol] (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/5c8746f56b4bed8cc9e0e044f5f69ab2f9428ce1/contracts/proxy/Proxy.sol) to allow GovernorBravoDelegator to handle fallback() and receive() as per Solidity > 0.6.0
 */

pragma solidity ^0.8.4;

import "./GovernorNInterfaces.sol";

contract GovernorNDelegator is GovernorNDelegatorStorage, GovernorNEvents {
	constructor(
			address timelock_,
			address nouns_,
            address vetoer_,
			address admin_,
	        address implementation_,
	        uint votingPeriod_,
	        uint votingDelay_,
            uint proposalThresholdBPS_,
            uint quorumVotesBPS_) {

        // Admin set to msg.sender for initialization
        admin = msg.sender;

        delegateTo(implementation_, abi.encodeWithSignature("initialize(address,address,address,uint256,uint256,uint256,uint256)",
                                                            timelock_,
                                                            nouns_,
                                                            vetoer_,
                                                            votingPeriod_,
                                                            votingDelay_,
                                                            proposalThresholdBPS_,
                                                            quorumVotesBPS_));

        _setImplementation(implementation_);

		admin = admin_;
	}


	/**
     * @notice Called by the admin to update the implementation of the delegator
     * @param implementation_ The address of the new implementation for delegation
     */
    function _setImplementation(address implementation_) public {
        require(msg.sender == admin, "GovernorNDelegator::_setImplementation: admin only");
        require(implementation_ != address(0), "GovernorNDelegator::_setImplementation: invalid implementation address");

        address oldImplementation = implementation;
        implementation = implementation_;

        emit NewImplementation(oldImplementation, implementation);
    }

    /**
     * @notice Internal method to delegate execution to another contract
     * @dev It returns to the external caller whatever the implementation returns or forwards reverts
     * @param callee The contract to delegatecall
     * @param data The raw data to delegatecall
     */
    function delegateTo(address callee, bytes memory data) internal {
        (bool success, bytes memory returnData) = callee.delegatecall(data);
        assembly {
            if eq(success, 0) {
                revert(add(returnData, 0x20), returndatasize())
            }
        }
    }

	/**
     * @dev Delegates execution to an implementation contract.
     * It returns to the external caller whatever the implementation returns
     * or forwards reverts.
     */
    function _fallback() internal {
        // delegate all other functions to current implementation
        (bool success, ) = implementation.delegatecall(msg.data);

        assembly {
              let free_mem_ptr := mload(0x40)
              returndatacopy(free_mem_ptr, 0, returndatasize())

              switch success
              case 0 { revert(free_mem_ptr, returndatasize()) }
              default { return(free_mem_ptr, returndatasize()) }
        }
    }

    /**
     * @dev Fallback function that delegates calls to the `implementation`. Will run if no other
     * function in the contract matches the call data.
     */
    fallback() external payable {
        _fallback();
    }

    /**
     * @dev Fallback function that delegates calls to `implementation`. Will run if call data
     * is empty.
     */
    receive() external payable {
        _fallback();
    }
}