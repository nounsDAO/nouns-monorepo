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
    event ETHStreamedToDAO(uint256 amount, uint256 totalStreamed);

    address public daoTreasury;
    INounsToken public nounsToken; // TODO immutable?

    uint256 public ethStreamedPerAuction;
    uint256 public ethStreamedToDAO;
    uint256 public ethWithdrawn;
    mapping(uint256 streamEndId => uint256[] streamIds) public streamEndIds;
    mapping(uint256 streamId => Stream) public streams;
    uint256 public auctionsCounter;
    uint256 public lastForwardTimestamp;

    constructor(address daoTreasury_, address nounsToken_) {
        daoTreasury = daoTreasury_;
        nounsToken = INounsToken(nounsToken_);
    }

    function forwardAllAndCreateStream(uint256 nounId, uint16 streamLengthInAuctions) external payable {
        forwardAll();

        createStream(nounId, streamLengthInAuctions);
    }

    function createStream(uint256 nounId, uint16 streamLengthInAuctions) public payable {
        // TODO limit streamLengthInAuctions values range?
        require(nounsToken.ownerOf(nounId) == msg.sender, 'only noun owner');
        require(!streams[nounId].active || streams[nounId].streamEndId > auctionsCounter, 'stream active');

        // register new stream
        uint256 streamEndId = auctionsCounter + streamLengthInAuctions; // streamEndId is inclusive
        streamEndIds[streamEndId].push(nounId);

        uint256 ethPerAuction = msg.value / streamLengthInAuctions;

        // the remainder is immediately streamed to the DAO
        uint256 remainder = msg.value % streamLengthInAuctions;
        if (remainder > 0) {
            ethStreamedToDAO += remainder;
            emit ETHStreamedToDAO(remainder, ethStreamedToDAO);
        }

        ethStreamedPerAuction += ethPerAuction;
        streams[nounId] = Stream({ ethPerAuction: ethPerAuction, active: true, streamEndId: streamEndId });
    }

    // used for example when there were no bids on a noun
    function forwardAll() public {
        // silently fail if at least a day hasn't passed. this is in order not to revert auction house.
        if (block.timestamp < lastForwardTimestamp + 24 hours) {
            return;
        }

        lastForwardTimestamp = block.timestamp;
        auctionsCounter++;
        ethStreamedToDAO += ethStreamedPerAuction;
        emit ETHStreamedToDAO(ethStreamedPerAuction, ethStreamedToDAO);
        finishStreams();
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
        ethStreamedPerAuction -= streams[nounId].ethPerAuction;

        // calculate how much needs to be refunded
        require(streams[nounId].streamEndId > auctionsCounter, 'stream finished');
        uint256 auctionsLeft = streams[nounId].streamEndId - auctionsCounter;
        uint256 amountToRefund = streams[nounId].ethPerAuction * auctionsLeft;
        (bool sent, ) = msg.sender.call{ value: amountToRefund }('');
        require(sent, 'failed to send eth');
    }

    function withdrawToTreasury(uint256 amount) external {
        require(msg.sender == daoTreasury);
        require(amount <= (ethStreamedToDAO - ethWithdrawn), 'not enough to withdraw');
        ethWithdrawn += amount;
        (bool sent, ) = daoTreasury.call{ value: amount }('');
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
        uint256[] storage endingStreams = streamEndIds[auctionsCounter];
        for (uint256 i; i < endingStreams.length; i++) {
            uint256 streamId = endingStreams[i];
            if (streams[streamId].active) {
                ethStreamedPerAuction -= streams[streamId].ethPerAuction;
            }
        }
    }
}
