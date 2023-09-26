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

pragma solidity ^0.8.16;

import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/**
 * @notice Utility contract for transferring entire balance of an ERC20.
 * Useful for DAOs making proposals without knowing the exact amount at execution time.
 */
contract ERC20Transferer {
    /**
     * @notice Transfer the entire balance of the caller to `to`.
     * Assumes it is approved on transfer funds on its behalf.
     * @param token The token to transfer.
     * @param to The address to transfer to.
     * @return The amount transferred.
     */
    function transferEntireBalance(address token, address to) external returns (uint256) {
        uint256 balance = IERC20(token).balanceOf(msg.sender);
        IERC20(token).transferFrom(msg.sender, to, balance);
        return balance;
    }
}
