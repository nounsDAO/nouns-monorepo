// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Vm.sol';

contract Utils {
    bytes32 internal nextUser = keccak256(abi.encodePacked('user address'));

    Vm private constant vm = Vm(address(uint160(uint256(keccak256('hevm cheat code')))));

    function getNextUserAddress() external returns (address payable) {
        // bytes32 to address conversion
        address payable user = payable(address(uint160(uint256(nextUser))));
        nextUser = keccak256(abi.encodePacked(nextUser));
        return user;
    }

    function getAndLabelAddress(string memory name) public returns (address payable) {
        address a = address(uint160(uint256(keccak256(abi.encodePacked(name)))));
        vm.label(a, name);
        return payable(a);
    }
}
