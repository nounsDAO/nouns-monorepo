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

    address public daoExecutor;
    address public ethRecipient;
    address public nounsRecipient;
    INounsToken public nounsToken; // TODO immutable?

    uint256 public ethStreamedPerTick;

    // @dev a mapping of how much ethPerTick will end at this tick
    mapping(uint256 tick => uint256 ethPerTick) public ethStreamEndingAtTick;
    mapping(uint256 streamId => Stream) internal streams;
    uint256 public ticks;
    uint256 public lastForwardTimestamp;

    constructor(address daoExecutor_, address ethRecipient_, address nounsRecipient_, address nounsToken_) {
        daoExecutor = daoExecutor_;
        ethRecipient = ethRecipient_;
        nounsRecipient = nounsRecipient_;
        nounsToken = INounsToken(nounsToken_);
    }

    function forwardAllAndCreateStream(uint256 nounId, uint16 streamLengthInTicks) external payable {
        forwardAll();

        createStream(nounId, streamLengthInTicks);
    }

    function createStream(uint256 nounId, uint16 streamLengthInTicks) public payable {
        // TODO limit streamLengthInTicks values range?
        require(nounsToken.ownerOf(nounId) == msg.sender, 'only noun owner');
        require(!streams[nounId].active || streams[nounId].lastTick < ticks, 'stream active');

        // register new stream
        uint256 ethPerTick = msg.value / streamLengthInTicks;
        uint256 streamLastTick = ticks + streamLengthInTicks; // streamLastTick is inclusive
        ethStreamEndingAtTick[streamLastTick] += ethPerTick;

        // the remainder is immediately streamed to the DAO
        uint256 remainder = msg.value % streamLengthInTicks;
        sendETHToTreasury(remainder);

        ethStreamedPerTick += ethPerTick;
        streams[nounId] = Stream({ ethPerTick: ethPerTick, active: true, lastTick: streamLastTick });
    }

    // used for example when there were no bids on a noun
    function forwardAll() public {
        // silently fail if at least a day hasn't passed. this is in order not to revert auction house.
        if (block.timestamp < lastForwardTimestamp + 24 hours) {
            return;
        }

        lastForwardTimestamp = block.timestamp;

        sendETHToTreasury(ethStreamedPerTick);

        increaseTicksAndFinishStreams();
    }

    function sendETHToTreasury(uint256 amount) internal {
        if (amount > 0) {
            (bool sent, ) = ethRecipient.call{ value: amount }('');
            require(sent, 'failed to send eth');
            emit ETHStreamedToDAO(amount);
        }
    }

    function cancelStreams(uint256[] calldata nounIds) external {
        for (uint256 i; i < nounIds.length; ++i) {
            cancelStream(nounIds[i]);
        }
    }

    function cancelStream(uint256 nounId) public {
        // transfer noun to treasury
        nounsToken.transferFrom(msg.sender, nounsRecipient, nounId);

        // cancel stream
        require(streams[nounId].active, 'already canceled');
        streams[nounId].active = false;
        ethStreamedPerTick -= streams[nounId].ethPerTick;
        ethStreamEndingAtTick[streams[nounId].lastTick] -= streams[nounId].ethPerTick;

        // calculate how much needs to be refunded
        require(streams[nounId].lastTick > ticks, 'stream finished');
        uint256 ticksLeft = streams[nounId].lastTick - ticks;
        uint256 amountToRefund = streams[nounId].ethPerTick * ticksLeft;
        (bool sent, ) = msg.sender.call{ value: amountToRefund }('');
        require(sent, 'failed to send eth');
    }

    function fastForward(uint256 nounId, uint256 ticksToForward) public {
        require(nounsToken.ownerOf(nounId) == msg.sender, 'not noun owner');
        uint256 lastTick = streams[nounId].lastTick;
        require(streams[nounId].active && lastTick > ticks, 'stream not active');

        // move last tick
        require(ticksToForward <= lastTick - ticks, 'ticksToFoward too large');
        uint256 newLastTick = lastTick - ticksToForward;

        streams[nounId].lastTick = newLastTick;
        ethStreamEndingAtTick[lastTick] -= streams[nounId].ethPerTick;

        if (newLastTick > ticks) {
            // stream is still active, so register the new end tick
            ethStreamEndingAtTick[newLastTick] += streams[nounId].ethPerTick;
        } else {
            // no more ticks left, so finished the stream
            ethStreamedPerTick -= streams[nounId].ethPerTick;
        }

        uint256 ethToStream = ticksToForward * streams[nounId].ethPerTick;
        sendETHToTreasury(ethToStream);
    }

    function setDAOExecutorAddress(address newAddress) external {
        require(msg.sender == daoExecutor);
        daoExecutor = newAddress;
    }

    function setETHRecipient(address newAddress) external {
        require(msg.sender == daoExecutor);
        ethRecipient = newAddress;
    }

    function setNounsRecipient(address newAddress) external {
        require(msg.sender == daoExecutor);
        nounsRecipient = newAddress;
    }

    function getStream(uint256 nounId) external view returns (Stream memory) {
        return streams[nounId];
    }

    function increaseTicksAndFinishStreams() internal {
        ticks++;
        uint256 ethPerTickEnding = ethStreamEndingAtTick[ticks];
        if (ethPerTickEnding > 0) {
            ethStreamedPerTick -= ethPerTickEnding;
        }
    }
}
