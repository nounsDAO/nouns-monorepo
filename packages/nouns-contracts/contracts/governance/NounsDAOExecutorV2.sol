// SPDX-License-Identifier: BSD-3-Clause

/// @title The Nouns DAO executor and treasury, supporting DAO split

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

 pragma solidity ^0.8.6;

import { NounsDAOExecutor } from './NounsDAOExecutor.sol';
import { INounsDAOExecutorV2 } from './NounsDAOInterfaces.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract NounsDAOExecutorV2 is NounsDAOExecutor {
    constructor(address admin, uint256 delay) NounsDAOExecutor(admin, delay) {}

    function sendETHToNewDAO(address newDAOTreasury, uint256 ethToSend) external returns (bool success) {
        require(msg.sender == admin, 'NounsDAOExecutor::executeTransaction: Call must come from admin.');

        (success, ) = newDAOTreasury.call{value: ethToSend}('');
    }

    function sendERC20ToNewDAO(
        address newDAOTreasury, 
        address erc20Token, 
        uint256 tokensToSend
    ) external returns (bool success){
        require(msg.sender == admin, 'NounsDAOExecutor::executeTransaction: Call must come from admin.');

        success = IERC20(erc20Token).transfer(newDAOTreasury, tokensToSend);
    }
}