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

/**
 * @notice A library for short lived in memory mappings.
 * This only works when the keys, in this case clientId, are of limited size so that they we can create
 * an array in memory for all the possible values
 */
library ClientRewardsMemoryMapping {
    struct Mapping {
        /// @dev indexes[clientId] returns the index in `values` array where the value for clientId is.
        /// zero means it hasn't been initialized yet.
        uint32[] indexes;
        /// @dev array of values. the first cell (index zero) is kept empty.
        ClientBalance[] values;
        /// @dev index of the next cell in `values` array which we can allocate for a new clientId
        uint32 nextAvailableIndex;
    }

    struct ClientBalance {
        uint32 clientId;
        uint256 balance;
    }

    /**
     * Returns a new in memory mapping.
     * @param maxClientId maximum value for a clientId key
     */
    function createMapping(uint32 maxClientId) internal pure returns (Mapping memory m) {
        m.indexes = new uint32[](maxClientId + 1);
        /// @dev index zero is reserved so allocated one extra cell
        m.values = new ClientBalance[](maxClientId + 2);
        m.nextAvailableIndex = 1; // 0 is reserved to mean unindexed
    }

    /**
     * Sets the value for client `clientId` to `balance`
     */
    function set(Mapping memory m, uint32 clientId, uint256 balance) internal pure {
        uint32 idx = m.indexes[clientId];
        if (idx == 0) {
            idx = m.nextAvailableIndex++;
            m.indexes[clientId] = idx;
            m.values[idx].clientId = clientId;
        }
        m.values[idx].balance = balance;
    }

    /**
     * Increases the value of client `clientId` by `balanceDiff`
     */
    function inc(Mapping memory m, uint32 clientId, uint256 balanceDiff) internal pure {
        uint32 idx = m.indexes[clientId];
        if (idx == 0) {
            idx = m.nextAvailableIndex++;
            m.indexes[clientId] = idx;
            m.values[idx].clientId = clientId;
        }
        m.values[idx].balance += balanceDiff;
    }

    /**
     * Returns the current value for client `clientId`
     */
    function get(Mapping memory m, uint32 clientId) internal pure returns (uint256 balance) {
        uint32 idx = m.indexes[clientId];
        if (idx == 0) return 0;
        return m.values[idx].balance;
    }

    /**
     * Returns the number of key/values stored
     */
    function numValues(Mapping memory m) internal pure returns (uint256) {
        return m.nextAvailableIndex - 1;
    }

    /**
     * Returns the idx-th value stored
     */
    function getValue(Mapping memory m, uint32 idx) internal pure returns (ClientBalance memory) {
        // zero index is unused
        return m.values[idx + 1];
    }
}
