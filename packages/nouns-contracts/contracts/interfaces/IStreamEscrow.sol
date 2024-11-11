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
    event ETHStreamedToDAO(uint256 amount);
    event StreamCreated(uint256 indexed nounId, uint256 totalAmount, uint16 streamLengthInTicks, uint256 ethPerTick);
    event StreamsForwarded(
        uint256 currentTick,
        uint256 previousEthStreamedPerTick,
        uint256 nextEthStreamedPerTick,
        uint256 lastForwardTimestamp
    );
    event StreamCanceled(uint256 indexed nounId, uint256 amountToRefund);
    event StreamFastForwarded(uint256 indexed nounId, uint256 ticksToForward, uint256 newLastTick);
    event AllowedToCreateStreamChanged(address address_, bool allowed);
    event DAOExecutorAddressSet(address newAddress);
    event ETHRecipientSet(address newAddress);
    event NounsRecipientSet(address newAddress);

    struct Stream {
        uint128 ethPerTick;
        bool canceled;
        // @dev This is the last tick for which this stream will be active
        uint32 lastTick;
    }

    function forwardAllAndCreateStream(uint256 nounId, uint16 streamLengthInTicks) external payable;

    function forwardAll() external;

    function getStream(uint256 nounId) external view returns (Stream memory);
}
