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

library InMemoryMapping {
    struct InMemoryMapping {
        uint32[] indexes;
        ClientBalance[] values;
        uint32 nextAvailableIndex;
    }

    struct ClientBalance {
        uint32 clientId;
        uint256 balance;
    }

    function initialize(uint32 maxSize) internal pure returns (InMemoryMapping memory m) {
        m.indexes = new uint32[](maxSize);
        m.values = new ClientBalance[](maxSize + 1);
        m.nextAvailableIndex = 1; // 0 is reserved to mean unindexed
    }

    function set(InMemoryMapping memory m, uint32 clientId, uint256 balance) internal pure {
        uint32 idx = m.indexes[clientId];
        if (idx == 0) {
            idx = m.nextAvailableIndex++;
            m.indexes[clientId] = idx;
            m.values[idx].clientId = clientId;
        }
        m.values[idx].balance = balance;
    }

    function get(InMemoryMapping memory m, uint32 clientId) internal pure returns (uint256 balance) {
        uint32 idx = m.indexes[clientId];
        if (idx == 0) return 0;
        return m.values[idx].balance;
    }
}
