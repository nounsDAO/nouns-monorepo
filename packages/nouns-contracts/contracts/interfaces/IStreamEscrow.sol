// SPDX-License-Identifier: GPL-3.0

/// @title Interface for Stream Escrow

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

interface IStreamEscrow {
    struct Stream {
        uint256 ethPerTick;
        bool active;
        // @dev This is the last tick for which this stream will be active
        uint256 lastTick;
    }

    function forwardAllAndCreateStream(uint256 nounId, uint16 streamLengthInTicks) external payable;

    function forwardAll() external;

    function getStream(uint256 nounId) external view returns (Stream memory);
}
