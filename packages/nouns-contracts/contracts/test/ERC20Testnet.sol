// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract ERC20Testnet is ERC20, Ownable {
    constructor(
        address owner_,
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {
        _transferOwnership(owner_);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
