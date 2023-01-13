// SPDX-License-Identifier: GPL-3.0

/// @title The Nouns DAO auction house

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

// LICENSE
// NounsAuctionHouse.sol is a modified version of Zora's AuctionHouse.sol:
// https://github.com/ourzora/auction-house/blob/54a12ec1a6cf562e49f0a4917990474b11350a2d/contracts/AuctionHouse.sol
//
// AuctionHouse.sol source code Copyright Zora licensed under the GPL-3.0 license.
// With modifications by Nounders DAO.

pragma solidity ^0.8.6;

import { PausableUpgradeable } from '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import { ReentrancyGuardUpgradeable } from '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { INounsAuctionHouse } from './interfaces/INounsAuctionHouse.sol';
import { INounsToken } from './interfaces/INounsToken.sol';
import { IWETH } from './interfaces/IWETH.sol';

contract NounsAuctionHouseV2 is
    INounsAuctionHouse,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    OwnableUpgradeable
{
    // The Nouns ERC721 token contract
    INounsToken public nouns;

    // The address of the WETH contract
    address public weth;

    // The minimum amount of time left in an auction after a new bid is created
    uint256 public timeBuffer;

    // The minimum price accepted in an auction
    uint256 public reservePrice;

    // The minimum percentage difference between the last bid amount and the current bid
    uint8 public minBidIncrementPercentage;

    // The duration of a single auction
    uint256 public duration;

    // The active auction
    INounsAuctionHouse.AuctionV2 public auction;

    // The Nouns price feed state
    mapping(uint256 => SettlementState) settlementHistory;

    /**
     * @notice Initialize the auction house and base contracts,
     * populate configuration values, and pause the contract.
     * @dev This function can only be called once.
     */
    function initialize(
        INounsToken _nouns,
        address _weth,
        uint256 _timeBuffer,
        uint256 _reservePrice,
        uint8 _minBidIncrementPercentage,
        uint256 _duration
    ) external initializer {
        __Pausable_init();
        __ReentrancyGuard_init();
        __Ownable_init();

        _pause();

        nouns = _nouns;
        weth = _weth;
        timeBuffer = _timeBuffer;
        reservePrice = _reservePrice;
        minBidIncrementPercentage = _minBidIncrementPercentage;
        duration = _duration;
    }

    /**
     * @notice Settle the current auction, mint a new Noun, and put it up for auction.
     */
    function settleCurrentAndCreateNewAuction() external override whenNotPaused {
        _settleAuction();
        _createAuction();
    }

    /**
     * @notice Settle the current auction.
     * @dev This function can only be called when the contract is paused.
     */
    function settleAuction() external override whenPaused {
        _settleAuction();
    }

    /**
     * @notice Create a bid for a Noun, with a given amount.
     * @dev This contract only accepts payment in ETH.
     */
    function createBid(uint256 nounId) external payable override {
        INounsAuctionHouse.AuctionV2 memory _auction = auction;

        if (_auction.nounId != nounId) revert NounNotUpForAuction();
        if (block.timestamp >= _auction.endTime) revert AuctionExpired();
        if (msg.value < reservePrice) revert MustSendAtLeastReservePrice();
        if (msg.value < _auction.amount + ((_auction.amount * minBidIncrementPercentage) / 100))
            revert BidDifferenceMustBeGreaterThanMinBidIncrement();

        auction.amount = uint128(msg.value);
        auction.bidder = payable(msg.sender);

        // Extend the auction if the bid was received within `timeBuffer` of the auction end time
        bool extended = _auction.endTime - block.timestamp < timeBuffer;

        emit AuctionBid(_auction.nounId, msg.sender, msg.value, extended);

        if (extended) {
            auction.endTime = _auction.endTime = uint40(block.timestamp + timeBuffer);
            emit AuctionExtended(_auction.nounId, _auction.endTime);
        }

        address payable lastBidder = _auction.bidder;

        // Refund the last bidder, if applicable
        if (lastBidder != address(0)) {
            _safeTransferETHWithFallback(lastBidder, _auction.amount);
        }
    }

    /**
     * @notice Pause the Nouns auction house.
     * @dev This function can only be called by the owner when the
     * contract is unpaused. While no new auctions can be started when paused,
     * anyone can settle an ongoing auction.
     */
    function pause() external override onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the Nouns auction house.
     * @dev This function can only be called by the owner when the
     * contract is paused. If required, this function will start a new auction.
     */
    function unpause() external override onlyOwner {
        _unpause();

        if (auction.startTime == 0 || auction.settled) {
            _createAuction();
        }
    }

    /**
     * @notice Set the auction time buffer.
     * @dev Only callable by the owner.
     */
    function setTimeBuffer(uint256 _timeBuffer) external override onlyOwner {
        timeBuffer = _timeBuffer;

        emit AuctionTimeBufferUpdated(_timeBuffer);
    }

    /**
     * @notice Set the auction reserve price.
     * @dev Only callable by the owner.
     */
    function setReservePrice(uint256 _reservePrice) external override onlyOwner {
        reservePrice = _reservePrice;

        emit AuctionReservePriceUpdated(_reservePrice);
    }

    /**
     * @notice Set the auction minimum bid increment percentage.
     * @dev Only callable by the owner.
     */
    function setMinBidIncrementPercentage(uint8 _minBidIncrementPercentage) external override onlyOwner {
        minBidIncrementPercentage = _minBidIncrementPercentage;

        emit AuctionMinBidIncrementPercentageUpdated(_minBidIncrementPercentage);
    }

    /**
     * @notice Create an auction.
     * @dev Store the auction details in the `auction` state variable and emit an AuctionCreated event.
     * If the mint reverts, the minter was updated without pausing this contract first. To remedy this,
     * catch the revert and pause this contract.
     */
    function _createAuction() internal {
        try nouns.mint() returns (uint256 nounId) {
            uint40 startTime = uint40(block.timestamp);
            uint40 endTime = startTime + uint40(duration);

            auction = AuctionV2({
                nounId: uint128(nounId),
                amount: 0,
                startTime: startTime,
                endTime: endTime,
                bidder: payable(0),
                settled: false
            });

            emit AuctionCreated(nounId, startTime, endTime);
        } catch Error(string memory) {
            _pause();
        }
    }

    /**
     * @notice Settle an auction, finalizing the bid and paying out to the owner.
     * @dev If there are no bids, the Noun is burned.
     */
    function _settleAuction() internal {
        INounsAuctionHouse.AuctionV2 memory _auction = auction;

        if (_auction.startTime == 0) revert AuctionHasntBegun();
        if (_auction.settled) revert AuctionAlreadySettled();
        if (block.timestamp < _auction.endTime) revert AuctionNotDone();

        auction.settled = true;

        if (_auction.bidder == address(0)) {
            nouns.burn(_auction.nounId);
        } else {
            nouns.transferFrom(address(this), _auction.bidder, _auction.nounId);
        }

        if (_auction.amount > 0) {
            _safeTransferETHWithFallback(owner(), _auction.amount);
        }

        settlementHistory[_auction.nounId] = SettlementState({
            blockTimestamp: uint32(block.timestamp),
            amount: ethPriceToUint64(_auction.amount),
            winner: _auction.bidder
        });

        emit AuctionSettled(_auction.nounId, _auction.bidder, _auction.amount);
    }

    /**
     * @notice Transfer ETH. If the ETH transfer fails, wrap the ETH and try send it as WETH.
     */
    function _safeTransferETHWithFallback(address to, uint256 amount) internal {
        if (!_safeTransferETH(to, amount)) {
            IWETH(weth).deposit{ value: amount }();
            IERC20(weth).transfer(to, amount);
        }
    }

    /**
     * @notice Transfer ETH and return the success status.
     * @dev This function only forwards 30,000 gas to the callee.
     */
    function _safeTransferETH(address to, uint256 value) internal returns (bool) {
        bool success;
        assembly {
            success := call(30000, to, value, 0, 0, 0, 0)
        }
        return success;
    }

    function setPrices(Settlement[] memory observations_) external onlyOwner {
        for (uint256 i = 0; i < observations_.length; ++i) {
            settlementHistory[observations_[i].nounId] = SettlementState({
                blockTimestamp: observations_[i].blockTimestamp,
                amount: observations_[i].amount,
                winner: observations_[i].winner
            });
        }

        // TODO emit event
    }

    function warmUpSettlementState(uint256[] memory nounIds) external {
        for (uint256 i = 0; i < nounIds.length; ++i) {
            if (settlementHistory[nounIds[i]].blockTimestamp == 0) {
                settlementHistory[nounIds[i]] = SettlementState({ blockTimestamp: 1, amount: 0, winner: address(0) });
            }
        }
    }

    /**
     * @notice Get past auction prices, up to `oracle.cardinality` observations.
     * There are times when cardinality is increased and not yet fully used, when a user might request more
     * observations than what's stored; in such cases users will get the maximum number of observations the
     * oracle has to offer.
     * For example, say cardinality was just increased from 3 to 10, a user can then ask for 10 observations.
     * Since the oracle only has 3 prices stored, the user will get 3 observations.
     * @dev Reverts with a `AuctionCountOutOfBounds` error if `auctionCount` is greater than `oracle.cardinality`.
     * @param auctionCount The number of price observations to get.
     * @return settlements An array of type `Settlement`, where each Settlement includes a timestamp,
     * the Noun ID of that auction, the winning bid amount, and the winner's addreess.
     */
    function prices(uint256 auctionCount) external view returns (Settlement[] memory settlements) {
        uint256 latestNounId = auction.nounId;
        if (!auction.settled && latestNounId > 0) {
            latestNounId -= 1;
        }

        settlements = new Settlement[](auctionCount);
        uint256 actualCount = 0;
        while (actualCount < auctionCount && latestNounId > 0) {
            // Skip Nouner reward Nouns, they have no price
            if (latestNounId <= 1820 && latestNounId % 10 == 0) {
                --latestNounId;
                continue;
            }

            settlements[actualCount] = Settlement({
                blockTimestamp: settlementHistory[latestNounId].blockTimestamp,
                amount: settlementHistory[latestNounId].amount,
                winner: settlementHistory[latestNounId].winner,
                nounId: latestNounId
            });
            ++actualCount;
            --latestNounId;
        }

        if (auctionCount > actualCount) {
            // this assembly trims the observations array, getting rid of unused cells
            assembly {
                mstore(settlements, actualCount)
            }
        }
    }

    function prices(uint256 latestId, uint256 oldestId) external view returns (Settlement[] memory settlements) {
        settlements = new Settlement[](latestId - oldestId);
        uint256 actualCount = 0;
        uint256 currentId = latestId;
        while (currentId > oldestId) {
            // Skip Nouner reward Nouns, they have no price
            if (currentId <= 1820 && currentId % 10 == 0) {
                --currentId;
                continue;
            }

            settlements[actualCount] = Settlement({
                blockTimestamp: settlementHistory[currentId].blockTimestamp,
                amount: settlementHistory[currentId].amount,
                winner: settlementHistory[currentId].winner,
                nounId: currentId
            });
            ++actualCount;
            --currentId;
        }

        if (settlements.length > actualCount) {
            // this assembly trims the observations array, getting rid of unused cells
            assembly {
                mstore(settlements, actualCount)
            }
        }
    }

    /**
     * @dev Convert an ETH price of 256 bits with 18 decimals, to 64 bits with 10 decimals.
     * Max supported value is 1844674407.3709551615 ETH.
     *
     */
    function ethPriceToUint64(uint256 ethPrice) internal pure returns (uint64) {
        return uint64(ethPrice / 1e8);
    }
}
