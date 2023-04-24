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

pragma solidity ^0.8.6;

import { NounsTokenLike } from '../NounsDAOInterfaces.sol';

contract NounsDAOSplitEscrow {

    address public immutable dao;
    address public immutable tokenOwner;
    NounsTokenLike public immutable nounsToken;

    error OnlyDAO();

    constructor(address tokenOwner_, address nounsToken_) {
        dao = msg.sender;
        tokenOwner = tokenOwner_;
        nounsToken = NounsTokenLike(nounsToken_);
    }

    modifier onlyDAO() {
        if (msg.sender != dao) {
            revert OnlyDAO();
        }
        _;
    }

    function returnTokensToOwner(uint256[] calldata tokenIds) onlyDAO external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            nounsToken.transferFrom(address(this), tokenOwner, tokenIds[i]);
        }
    }
}