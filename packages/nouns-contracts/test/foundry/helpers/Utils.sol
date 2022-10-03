// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

contract Utils {
    bytes32 internal nextUser = keccak256(abi.encodePacked('user address'));

    function getNextUserAddress() external returns (address payable) {
        // bytes32 to address conversion
        address payable user = payable(address(uint160(uint256(nextUser))));
        nextUser = keccak256(abi.encodePacked(nextUser));
        return user;
    }
}
