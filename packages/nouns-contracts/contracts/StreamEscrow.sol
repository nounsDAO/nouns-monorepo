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

    address public daoTreasury;
    INounsToken public nounsToken; // TODO immutable?

    uint256 public ethStreamedPerTick;
    uint256 public ethWithdrawn;
    mapping(uint256 streamEndId => uint256[] streamIds) public streamEndIds;
    mapping(uint256 streamId => Stream) public streams;
    uint256 public ticks;
    uint256 public lastForwardTimestamp;

    constructor(address daoTreasury_, address nounsToken_) {
        daoTreasury = daoTreasury_;
        nounsToken = INounsToken(nounsToken_);
    }

    function forwardAllAndCreateStream(uint256 nounId, uint16 streamLengthInTicks) external payable {
        forwardAll();

        createStream(nounId, streamLengthInTicks);
    }

    function createStream(uint256 nounId, uint16 streamLengthInTicks) public payable {
        // TODO limit streamLengthInTicks values range?
        require(nounsToken.ownerOf(nounId) == msg.sender, 'only noun owner');
        require(!streams[nounId].active || streams[nounId].streamEndId > ticks, 'stream active');

        // register new stream
        uint256 streamEndId = ticks + streamLengthInTicks; // streamEndId is inclusive
        streamEndIds[streamEndId].push(nounId);

        uint256 ethPerTick = msg.value / streamLengthInTicks;

        // the remainder is immediately streamed to the DAO
        uint256 remainder = msg.value % streamLengthInTicks;
        sendETHToTreasury(remainder);
        
        ethStreamedPerTick += ethPerTick;
        streams[nounId] = Stream({ ethPerTick: ethPerTick, active: true, streamEndId: streamEndId });
    }

    // used for example when there were no bids on a noun
    function forwardAll() public {
        // silently fail if at least a day hasn't passed. this is in order not to revert auction house.
        if (block.timestamp < lastForwardTimestamp + 24 hours) {
            return;
        }

        lastForwardTimestamp = block.timestamp;
        ticks++;
        
        sendETHToTreasury(ethStreamedPerTick);

        finishStreams();
    }

    function sendETHToTreasury(uint256 amount) internal {
        if (amount > 0) {
            (bool sent, ) = daoTreasury.call{ value: amount }('');
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
        nounsToken.transferFrom(msg.sender, daoTreasury, nounId);

        // cancel stream
        require(streams[nounId].active, 'already canceled');
        streams[nounId].active = false;
        ethStreamedPerTick -= streams[nounId].ethPerTick;

        // calculate how much needs to be refunded
        require(streams[nounId].streamEndId > ticks, 'stream finished');
        uint256 ticksLeft = streams[nounId].streamEndId - ticks;
        uint256 amountToRefund = streams[nounId].ethPerTick * ticksLeft;
        (bool sent, ) = msg.sender.call{ value: amountToRefund }('');
        require(sent, 'failed to send eth');
    }

    function setDAOTreasuryAddress(address newAddress) external {
        require(msg.sender == daoTreasury);
        daoTreasury = newAddress;
    }

    function getStream(uint256 nounId) external view returns (Stream memory) {
        return streams[nounId];
    }

    function finishStreams() internal {
        uint256[] storage endingStreams = streamEndIds[ticks];
        for (uint256 i; i < endingStreams.length; i++) {
            uint256 streamId = endingStreams[i];
            if (streams[streamId].active) {
                ethStreamedPerTick -= streams[streamId].ethPerTick;
            }
        }
    }
}
