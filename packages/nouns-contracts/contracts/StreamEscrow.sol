// SPDX-License-Identifier: GPL-3.0

/// @title Stream Escrow

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

import { IStreamEscrow } from './interfaces/IStreamEscrow.sol';
import { INounsToken } from './interfaces/INounsToken.sol';

contract StreamEscrow is IStreamEscrow {
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

    INounsToken public immutable nounsToken;

    address public daoExecutor;
    address public ethRecipient;
    address public nounsRecipient;

    uint128 public ethStreamedPerTick;
    uint32 public currentTick;
    uint48 public lastForwardTimestamp;

    // @dev a mapping of how much ethPerTick will end at this tick
    mapping(uint256 tick => uint128 ethPerTick) public ethStreamEndingAtTick;
    mapping(uint256 streamId => Stream) internal streams;
    mapping(address => bool) public allowedToCreateStream;

    constructor(
        address daoExecutor_,
        address ethRecipient_,
        address nounsRecipient_,
        address nounsToken_,
        address streamCreator_
    ) {
        daoExecutor = daoExecutor_;
        ethRecipient = ethRecipient_;
        nounsRecipient = nounsRecipient_;
        nounsToken = INounsToken(nounsToken_);
        allowedToCreateStream[streamCreator_] = true;
    }

    function forwardAllAndCreateStream(uint256 nounId, uint16 streamLengthInTicks) external payable {
        forwardAll();

        createStream(nounId, streamLengthInTicks);
    }

    function createStream(uint256 nounId, uint16 streamLengthInTicks) public payable {
        require(allowedToCreateStream[msg.sender], 'not allowed');
        require(isApprovedOrOwner(msg.sender, nounId), 'only noun owner or approved');
        require(!isStreamActive(nounId), 'stream active');

        // register new stream
        uint128 ethPerTick = toUint128(msg.value / streamLengthInTicks);
        uint32 streamLastTick = currentTick + streamLengthInTicks; // streamLastTick is inclusive
        ethStreamEndingAtTick[streamLastTick] += ethPerTick;

        // the remainder is immediately streamed to the DAO
        uint256 remainder = msg.value % streamLengthInTicks;
        sendETHToTreasury(remainder);

        ethStreamedPerTick += ethPerTick;
        streams[nounId] = Stream({ ethPerTick: ethPerTick, canceled: false, lastTick: streamLastTick });
        emit StreamCreated(nounId, msg.value, streamLengthInTicks, ethPerTick);
    }

    // used for example when there were no bids on a noun
    function forwardAll() public {
        // silently fail if at least a day hasn't passed. this is in order not to revert auction house.
        if (block.timestamp < lastForwardTimestamp + 24 hours) {
            return;
        }

        lastForwardTimestamp = toUint48(block.timestamp);

        uint256 ethStreamedPerTickBefore = ethStreamedPerTick;
        sendETHToTreasury(ethStreamedPerTickBefore);

        uint32 newTick = increaseTicksAndFinishStreams();

        emit StreamsForwarded(newTick, ethStreamedPerTickBefore, ethStreamedPerTick, lastForwardTimestamp);
    }

    function cancelStreams(uint256[] calldata nounIds) external {
        for (uint256 i; i < nounIds.length; ++i) {
            cancelStream(nounIds[i]);
        }
    }

    function cancelStream(uint256 nounId) public {
        require(isStreamActive(nounId), 'stream not active');

        // transfer noun to treasury
        nounsToken.transferFrom(msg.sender, nounsRecipient, nounId);

        // cancel stream
        streams[nounId].canceled = true;
        Stream memory stream = streams[nounId];
        ethStreamedPerTick -= stream.ethPerTick;
        ethStreamEndingAtTick[stream.lastTick] -= stream.ethPerTick;

        // calculate how much needs to be refunded
        uint256 ticksLeft = stream.lastTick - currentTick;
        uint256 amountToRefund = stream.ethPerTick * ticksLeft;
        (bool sent, ) = msg.sender.call{ value: amountToRefund }('');
        require(sent, 'failed to send eth');

        emit StreamCanceled(nounId, amountToRefund);
    }

    function fastForwardStream(uint256 nounId, uint32 ticksToForward) public {
        require(ticksToForward > 0, 'ticksToForward must be positive');
        require(nounsToken.ownerOf(nounId) == msg.sender, 'not noun owner');

        Stream memory stream = streams[nounId];
        uint32 currentTick_ = currentTick;
        require(isStreamActive(stream, currentTick_), 'stream not active');
        uint32 lastTick = stream.lastTick;

        // move last tick
        require(ticksToForward <= lastTick - currentTick_, 'ticksToFoward too large');
        uint32 newLastTick = lastTick - ticksToForward;

        streams[nounId].lastTick = newLastTick;
        ethStreamEndingAtTick[lastTick] -= stream.ethPerTick;

        if (newLastTick > currentTick_) {
            // stream is still active, so register the new end tick
            ethStreamEndingAtTick[newLastTick] += stream.ethPerTick;
        } else {
            // no more ticks left, so finished the stream
            ethStreamedPerTick -= stream.ethPerTick;
        }

        uint256 ethToStream = ticksToForward * stream.ethPerTick;
        sendETHToTreasury(ethToStream);

        emit StreamFastForwarded(nounId, ticksToForward, newLastTick);
    }

    function isStreamActive(uint256 nounId) public view returns (bool) {
        return !streams[nounId].canceled && streams[nounId].lastTick > currentTick;
    }

    function isStreamActive(Stream memory stream, uint32 tick) internal pure returns (bool) {
        return !stream.canceled && stream.lastTick > tick;
    }

    modifier onlyDAO() {
        require(msg.sender == daoExecutor, 'only dao');
        _;
    }

    function setAllowedToCreateStream(address address_, bool allowed) external onlyDAO {
        allowedToCreateStream[address_] = allowed;
        emit AllowedToCreateStreamChanged(address_, allowed);
    }

    function setDAOExecutorAddress(address newAddress) external onlyDAO {
        daoExecutor = newAddress;
        emit DAOExecutorAddressSet(newAddress);
    }

    function setETHRecipient(address newAddress) external onlyDAO {
        ethRecipient = newAddress;
        emit ETHRecipientSet(newAddress);
    }

    function setNounsRecipient(address newAddress) external onlyDAO {
        nounsRecipient = newAddress;
        emit NounsRecipientSet(newAddress);
    }

    function getStream(uint256 nounId) external view returns (Stream memory) {
        return streams[nounId];
    }

    function sendETHToTreasury(uint256 amount) internal {
        if (amount > 0) {
            (bool sent, ) = ethRecipient.call{ value: amount }('');
            require(sent, 'failed to send eth');
            emit ETHStreamedToDAO(amount);
        }
    }

    function increaseTicksAndFinishStreams() internal returns (uint32 newTick) {
        newTick = ++currentTick;
        uint128 ethPerTickEnding = ethStreamEndingAtTick[newTick];
        if (ethPerTickEnding > 0) {
            ethStreamedPerTick -= ethPerTickEnding;
        }
    }

    function isApprovedOrOwner(address caller, uint256 nounId) internal view returns (bool) {
        address owner = nounsToken.ownerOf(nounId);
        if (owner == caller) return true;
        if (nounsToken.isApprovedForAll(owner, caller)) return true;
        if (nounsToken.getApproved(nounId) == caller) return true;
        return false;
    }

    function toUint128(uint256 value) internal pure returns (uint128) {
        if (value > type(uint128).max) {
            revert('value too large');
        }
        return uint128(value);
    }

    function toUint48(uint256 value) internal pure returns (uint48) {
        if (value > type(uint48).max) {
            revert('value too large');
        }
        return uint48(value);
    }
}
