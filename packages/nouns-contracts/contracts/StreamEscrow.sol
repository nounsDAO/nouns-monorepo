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
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract StreamEscrow is IStreamEscrow {
    modifier onlyDAO() {
        require(msg.sender == daoExecutor, 'only dao');
        _;
    }

    /// @notice The address of the Nouns token contract
    INounsToken public immutable nounsToken;

    /// @notice The minimum duration of a tick in seconds
    uint32 public immutable minimumTickDuration;

    /// @notice The address of the DAO executor contract
    address public daoExecutor;

    /// @notice The address that will receive ETH payments
    address public ethRecipient;

    /// @notice The address that will receive Nouns tokens when streams are canceled
    address public nounsRecipient;

    /// @notice The amount of ETH streamed per tick
    uint128 public ethStreamedPerTick;

    /// @notice The current tick
    uint32 public currentTick;

    /// @notice The timestamp of the last forward
    uint48 public lastForwardTimestamp;

    // @dev a mapping of how much ethPerTick will end at this tick
    mapping(uint256 tick => uint128 ethPerTick) public ethStreamEndingAtTick;
    mapping(uint256 streamId => Stream) internal streams;
    mapping(address => bool) public allowedToCreateStream;

    /**
     * @notice Initializes the StreamEscrow contract
     * @param daoExecutor_ The address of the DAO executor contract
     * @param ethRecipient_ The address that will receive ETH payments
     * @param nounsRecipient_ The address that will receive Nouns tokens when streams are canceled
     * @param nounsToken_ The address of the Nouns ERC721 token contract
     * @param streamCreator_ The address that will be initially allowed to create streams
     * @param minimumTickDuration_ The minimum duration of a tick in seconds
     */
    constructor(
        address daoExecutor_,
        address ethRecipient_,
        address nounsRecipient_,
        address nounsToken_,
        address streamCreator_,
        uint32 minimumTickDuration_
    ) {
        daoExecutor = daoExecutor_;
        ethRecipient = ethRecipient_;
        nounsRecipient = nounsRecipient_;
        nounsToken = INounsToken(nounsToken_);
        allowedToCreateStream[streamCreator_] = true;
        minimumTickDuration = minimumTickDuration_;
    }

    /**
     * @notice Forwards all streams and creates a new stream for a Noun.
     * @notice ETH value must be sent with this function call.
     * @dev Combines forwardAll() and createStream() operations into a single transaction.
     * @param nounId The ID of the Noun token for which the stream is being created.
     * @param streamLengthInTicks The duration of the stream in ticks. `minimumTickDuration` must pass for a tick to increase.
     */
    function forwardAllAndCreateStream(uint256 nounId, uint16 streamLengthInTicks) external payable {
        forwardAll();

        createStream(nounId, streamLengthInTicks);
    }

    /**
     * @notice Creates a new ETH stream for a specific Noun token.
     * @dev Only allowed addresses that are also Noun owners/approved operators can create streams.
     * @param nounId The ID of the Noun token to create a stream for.
     * @param streamLengthInTicks The duration of the stream in ticks.
     * @custom:throws 'not allowed' if sender is not allowed to create streams.
     * @custom:throws 'only noun owner or approved' if sender is not owner/approved.
     * @custom:throws 'stream active' if a stream already exists for the Noun.
     * @notice ETH value must be sent with this function call.
     */
    function createStream(uint256 nounId, uint16 streamLengthInTicks) public payable {
        require(allowedToCreateStream[msg.sender], 'not allowed');
        require(isApprovedOrOwner(msg.sender, nounId), 'only noun owner or approved');
        require(!isStreamActive(nounId), 'stream active');

        // register new stream
        uint128 ethPerTick = toUint128(msg.value / streamLengthInTicks);
        uint32 streamLastTick = currentTick + streamLengthInTicks;
        ethStreamEndingAtTick[streamLastTick] += ethPerTick;

        // the remainder is immediately streamed to the DAO
        uint256 remainder = msg.value % streamLengthInTicks;
        sendETHToTreasury(remainder);

        uint128 newEthStreamedPerTick = ethStreamedPerTick + ethPerTick;
        ethStreamedPerTick = newEthStreamedPerTick;
        streams[nounId] = Stream({ ethPerTick: ethPerTick, canceled: false, lastTick: streamLastTick });
        emit StreamCreated(nounId, msg.value, streamLengthInTicks, ethPerTick, newEthStreamedPerTick, streamLastTick);
    }

    /**
     * @notice Forwards all pending ETH streams if at least `minimumTickDuration` seconds has passed since last forward.
     * @dev This function silently returns if called before `minimumTickDuration` have elapsed since last forward.
     */
    function forwardAll() public {
        // silently fail if at least a day hasn't passed. this is in order not to revert auction house.
        if (block.timestamp < lastForwardTimestamp + minimumTickDuration) {
            return;
        }

        lastForwardTimestamp = toUint48(block.timestamp);

        sendETHToTreasury(ethStreamedPerTick);

        (uint32 newTick, uint128 ethPerTickEnded) = increaseTicksAndFinishStreams();

        emit StreamsForwarded(newTick, ethPerTickEnded, ethStreamedPerTick, lastForwardTimestamp);
    }

    /**
     * @notice Cancels multiple streams at once.
     * @param nounIds The IDs of the Noun tokens to cancel streams for.
     */
    function cancelStreams(uint256[] calldata nounIds) external {
        for (uint256 i; i < nounIds.length; ++i) {
            cancelStream(nounIds[i]);
        }
    }

    /**
     * @notice Cancels a stream for a specific Noun token. Transfers the Noun to `nounRecipient`
     *  and refunds the remaining ETH back to the caller.
     * @notice The caller must be the Noun owner.
     * @param nounId The ID of the Noun token to cancel the stream for.
     */
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

    /**
     * @notice Fast-forwards a stream by a certain number of ticks.
     * @param nounId The ID of the Noun token to fast-forward the stream for.
     * @param ticksToForward The number of ticks to fast-forward the stream by.
     * @custom:throws 'ticksToForward must be positive' if `ticksToForward` is not positive.
     * @custom:throws 'ticksToFoward too large' if `ticksToForward` is larger than the remaining ticks.
     * @custom:throws 'not noun owner' if the caller is not the Noun owner.
     * @custom:throws 'stream not active' if the stream is not active.
     */
    function fastForwardStream(uint256 nounId, uint32 ticksToForward) public {
        require(ticksToForward > 0, 'ticksToForward must be positive');
        require(nounsToken.ownerOf(nounId) == msg.sender, 'not noun owner');

        Stream memory stream = streams[nounId];
        uint32 currentTick_ = currentTick;
        require(isStreamActive(stream, currentTick_), 'stream not active');

        // move last tick
        require(ticksToForward <= stream.lastTick - currentTick_, 'ticksToFoward too large');
        uint32 newLastTick = stream.lastTick - ticksToForward;

        ethStreamEndingAtTick[stream.lastTick] -= stream.ethPerTick;
        streams[nounId].lastTick = newLastTick;

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

    /**
     * @notice Checks if a stream is active (not canceled and not finished) for a specific Noun token.
     * @param nounId The ID of the Noun token to check the stream for.
     * @return `true` if the stream is active, `false` otherwise.
     */
    function isStreamActive(uint256 nounId) public view returns (bool) {
        return !streams[nounId].canceled && streams[nounId].lastTick > currentTick;
    }

    function isStreamActive(Stream memory stream, uint32 tick) internal pure returns (bool) {
        return !stream.canceled && stream.lastTick > tick;
    }

    /**
     * @notice Allows the DAO to set whether an address is allowed to create streams.
     * @param address_ The address to allow or disallow.
     * @param allowed Whether the address is allowed to create streams.
     */
    function setAllowedToCreateStream(address address_, bool allowed) external onlyDAO {
        allowedToCreateStream[address_] = allowed;
        emit AllowedToCreateStreamChanged(address_, allowed);
    }

    /**
     * @notice Allows the DAO to set the address of the DAO executor contract.
     */
    function setDAOExecutorAddress(address newAddress) external onlyDAO {
        daoExecutor = newAddress;
        emit DAOExecutorAddressSet(newAddress);
    }

    /**
     * @notice Allows the DAO to set the address that the ETH will stream to.
     */
    function setETHRecipient(address newAddress) external onlyDAO {
        ethRecipient = newAddress;
        emit ETHRecipientSet(newAddress);
    }

    /**
     * @notice Allows the DAO to set the address that the Nouns tokens will be sent to when streams are canceled.
     */
    function setNounsRecipient(address newAddress) external onlyDAO {
        nounsRecipient = newAddress;
        emit NounsRecipientSet(newAddress);
    }

    /**
     * @notice Allows the DAO to rescue ERC20 tokens that were accidentally sent to the contract.
     * @param token The address of the ERC20 token to rescue.
     * @param to The address to send the tokens to.
     * @param amount The amount of tokens to rescue.
     */
    function rescueToken(address token, address to, uint256 amount) external onlyDAO {
        IERC20(token).transfer(to, amount);
    }

    /**
     * @notice Returns the stream data for a specific Noun token.
     */
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

    function increaseTicksAndFinishStreams() internal returns (uint32 newTick, uint128 ethPerTickEnding) {
        newTick = ++currentTick;
        ethPerTickEnding = ethStreamEndingAtTick[newTick];
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
