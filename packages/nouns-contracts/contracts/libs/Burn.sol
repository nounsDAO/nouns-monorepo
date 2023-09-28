// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/**
 * @title Burn
 * @notice Utilities for burning stuff.
 * @dev Based on https://github.com/ethereum-optimism/optimism/blob/eb68d8395971bc4a125cd0fd07567547f5bc0c49/packages/contracts-bedrock/contracts/libraries/Burn.sol
 */
library Burn {
    /**
     * Burns a given amount of ETH.
     *
     * @param _amount Amount of ETH to burn.
     */
    function eth(uint256 _amount) internal {
        new Burner{ value: _amount }();
    }
}

/**
 * @title Burner
 * @notice Burner self-destructs on creation and sends all ETH to itself, removing all ETH given to
 *         the contract from the circulating supply. Self-destructing is the only way to remove ETH
 *         from the circulating supply.
 */
contract Burner {
    constructor() payable {
        selfdestruct(payable(address(this)));
    }
}
