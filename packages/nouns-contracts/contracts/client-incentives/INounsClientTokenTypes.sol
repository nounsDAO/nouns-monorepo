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

interface INounsClientTokenTypes {
    struct ClientMetadata {
        /// @notice Whether the DAO has approved the client to withdraw their rewards.
        bool approved;
        /// @notice The amount of reward tokens this client has been rewarded.
        uint104 rewarded;
        /// @notice The amount of tokens this client has withdrawn.
        uint104 withdrawn;
        /// @dev A gap for future storage needs.
        uint40 __gap;
        /// @notice The client's display name.
        string name;
        /// @notice The client's description, e.g. its URL.
        string description;
    }
}
