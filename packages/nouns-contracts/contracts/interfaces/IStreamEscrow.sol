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
    event StreamCreated(
        uint256 indexed nounId,
        uint256 totalAmount,
        uint16 streamLengthInTicks,
        uint256 ethPerTick,
        uint128 newEthStreamedPerTick,
        uint32 lastTick
    );
    event StreamsForwarded(
        uint256 currentTick,
        uint256 ethPerTickStreamEnded,
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
        uint32 lastTick;
    }

    function forwardAllAndCreateStream(uint256 nounId, uint16 streamLengthInTicks) external payable;

    function createStream(uint256 nounId, uint16 streamLengthInTicks) external payable;

    function forwardAll() external;

    function cancelStreams(uint256[] calldata nounIds) external;

    function cancelStream(uint256 nounId) external;

    function fastForwardStream(uint256 nounId, uint32 ticksToForward) external;

    function isStreamActive(uint256 nounId) external view returns (bool);

    function getStream(uint256 nounId) external view returns (Stream memory);

    function setAllowedToCreateStream(address address_, bool allowed) external;

    function setDAOExecutorAddress(address newAddress) external;

    function setETHRecipient(address newAddress) external;

    function setNounsRecipient(address newAddress) external;

    function currentTick() external view returns (uint32);
}
