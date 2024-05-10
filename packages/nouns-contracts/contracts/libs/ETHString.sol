// SPDX-License-Identifier: GPL-3.0

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░██░░░████░░██░░░████░░░ *
 * ░░██████░░░████████░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 *********************************/

pragma solidity ^0.8.19;

import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';

library ETHString {
    using Strings for uint256;

    function toETHString(uint256 amount) internal pure returns (string memory result) {
        string memory integerPart = (amount / 1 ether).toString();
        uint256 decimalPart = (amount % 1 ether) / 10 ** 16; // 10^16 wei = 0.01 ETH

        if (decimalPart == 0) {
            result = string(abi.encodePacked(integerPart, '.00'));
        } else if (decimalPart < 10) {
            result = string(abi.encodePacked(integerPart, '.0', decimalPart.toString()));
        } else {
            result = string(abi.encodePacked(integerPart, '.', decimalPart.toString()));
        }
    }
}
