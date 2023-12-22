// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract RocketETHTestnet is ERC20, Ownable {
    uint256 rate;

    constructor(address owner_) ERC20('Rocket ETH Testnet', 'rETH') {
        _transferOwnership(owner_);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function setRate(uint256 rate_) public onlyOwner {
        rate = rate_;
    }

    function getEthValue(uint256 _rethAmount) external view returns (uint256) {
        return _rethAmount * rate;
    }
}
