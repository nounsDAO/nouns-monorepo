// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract ERC20Mock is ERC20 {
    bool public failNextTransfer;

    constructor() ERC20('Mock', 'MOCK') {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        super.transfer(recipient, amount);
        if (failNextTransfer) {
            failNextTransfer = false;
            return false;
        }
        return true;
    }

    function setFailNextTransfer(bool failNextTransfer_) external {
        failNextTransfer = failNextTransfer_;
    }
}
