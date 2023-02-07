// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract ERC20Mock is ERC20('Mock token', 'MOCK') {
    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}