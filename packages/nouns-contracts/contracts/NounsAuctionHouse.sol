// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.5;

import {PausableUpgradeable} from '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import {ReentrancyGuardUpgradeable} from '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {INounsAuctionHouse} from './interfaces/INounsAuctionHouse.sol';
import {INounsERC721} from './interfaces/INounsERC721.sol';
import {IWETH} from './interfaces/IWETH.sol';

/**
 * @title The NounsDAO auction house
 */
contract NounsAuctionHouse is
    INounsAuctionHouse,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    // The Nouns ERC721 token contract
    INounsERC721 public nouns;

    // The nounsDAO address (avatars org)
    address public nounsDAO;

    // The noundersDAO address (creators org)
    address public noundersDAO;

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
    INounsAuctionHouse.Auction public auction;

    /**
     * @notice Require that the sender is the noundersDAO
     */
    modifier onlyNoundersDAO() {
        require(msg.sender == noundersDAO, 'Sender is not the noundersDAO');
        _;
    }

    /**
     * @notice Initialize the auction house and base contracts,
     * populate configuration values, and pause the contract.
     * @dev This function can only be called once.
     */
    function initialize(
        INounsERC721 _nouns,
        address _nounsDAO,
        address _noundersDAO,
        address _weth,
        uint256 _timeBuffer,
        uint256 _reservePrice,
        uint8 _minBidIncrementPercentage,
        uint256 _duration
    ) external initializer {
        __Pausable_init();
        __ReentrancyGuard_init();

        _pause();

        nouns = _nouns;
        nounsDAO = _nounsDAO;
        noundersDAO = _noundersDAO;
        weth = _weth;
        timeBuffer = _timeBuffer;
        reservePrice = _reservePrice;
        minBidIncrementPercentage = _minBidIncrementPercentage;
        duration = _duration;
    }

    /**
     * @notice Settle the current auction, mint a new Noun, and put it up for auction.
     */
    function settleCurrentAndCreateNewAuction()
        external
        override
        nonReentrant
        whenNotPaused
    {
        _settleAuction();
        _createAuction();
    }

    /**
     * @notice Settle the current auction.
     * @dev This function can only be called when the contract is paused.
     */
    function settleAuction() external override whenPaused nonReentrant {
        _settleAuction();
    }

    /**
     * @notice Create a bid for a Noun, with a given amount.
     * @dev This contract only accepts payment in ETH.
     */
    function createBid(uint256 nounId) external payable override nonReentrant {
        INounsAuctionHouse.Auction memory _auction = auction;

        require(_auction.nounId == nounId, 'Noun not up for auction');
        require(block.timestamp < _auction.endTime, 'Auction expired');
        require(msg.value >= reservePrice, 'Must send at least reservePrice');
        require(msg.value >= _auction.amount + ((_auction.amount * minBidIncrementPercentage) / 100),
            'Must send more than last bid by minBidIncrementPercentage amount'
        );

        address payable lastBidder = _auction.bidder;

        // Refund the last bidder, if applicable
        if (lastBidder != address(0)) {
            _safeTransferETHWithFallback(lastBidder, _auction.amount);
        }

        auction.amount = msg.value;
        auction.bidder = payable(msg.sender);

        // Extend the auction if the bid was received within `timeBuffer` of the auction end time
        bool extended = _auction.endTime - block.timestamp < timeBuffer;
        if (extended) {
            auction.endTime = _auction.endTime = block.timestamp + timeBuffer;
        }

        emit AuctionBid(
            _auction.nounId,
            msg.sender,
            msg.value,
            lastBidder == address(0), // firstBid boolean
            extended
        );

        if (extended) {
            emit AuctionExtended(_auction.nounId, _auction.endTime);
        }
    }

    /**
     * @notice Pause the Nouns auction house.
     * @dev This function can only be called by the noundersDAO when the
     * contract is unpaused. While no new auctions can be started when paused,
     * anyone can settle an ongoing auction.
     */
    function pause() external override onlyNoundersDAO {
        _pause();
    }

    /**
     * @notice Unpause the Nouns auction house.
     * @dev This function can only be called by the noundersDAO when the
     * contract is paused. If required, this function will start a new auction.
     */
    function unpause() external override onlyNoundersDAO {
        _unpause();

        if (auction.startTime == 0 || auction.settled) {
            _createAuction();
        }
    }

    /**
     * @notice Set the auction time buffer.
     * @dev Only callable by the noundersDAO.
     */
    function setTimeBuffer(uint256 _timeBuffer)
        external
        override
        onlyNoundersDAO
    {
        timeBuffer = _timeBuffer;

        emit AuctionTimeBufferUpdated(_timeBuffer);
    }

    /**
     * @notice Set the auction reserve price.
     * @dev Only callable by the noundersDAO.
     */
    function setReservePrice(uint256 _reservePrice)
        external
        override
        onlyNoundersDAO
    {
        reservePrice = _reservePrice;

        emit AuctionReservePriceUpdated(_reservePrice);
    }

    /**
     * @notice Set the auction minimum bid increment percentage.
     * @dev Only callable by the noundersDAO.
     */
    function setMinBidIncrementPercentage(uint8 _minBidIncrementPercentage)
        external
        override
        onlyNoundersDAO
    {
        minBidIncrementPercentage = _minBidIncrementPercentage;

        emit AuctionMinBidIncrementPercentageUpdated(
            _minBidIncrementPercentage
        );
    }

    /**
     * @notice Set the auction duration.
     * @dev Only callable by the noundersDAO.
     */
    function setDuration(uint256 _duration) external override onlyNoundersDAO {
        duration = _duration;

        emit AuctionDurationUpdated(_duration);
    }

    /**
     * @notice Create an auction.
     * @dev Store the auction details in the `auction` state variable and emit an AuctionCreated event.
     */
    function _createAuction() internal returns (uint256) {
        uint256 nounId = nouns.mint();

        auction = Auction({
            nounId: nounId,
            amount: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            bidder: payable(0),
            settled: false
        });

        emit AuctionCreated(nounId);

        return nounId;
    }

    /**
     * @notice Settle an auction, finalizing the bid and paying out to the DAO.
     * @dev If there are no bids, the Noun is burned.
     */
    function _settleAuction() internal {
        INounsAuctionHouse.Auction memory _auction = auction;

        require(_auction.startTime != 0, "Auction hasn't begun");
        require(!_auction.settled, 'Auction has already been settled');
        require(
            block.timestamp >= _auction.endTime,
            "Auction hasn't completed"
        );

        auction.settled = true;

        address profitRecipient = _getProfitRecipient(_auction.nounId);

        if (_auction.bidder == address(0)) {
            nouns.burn(_auction.nounId);
        } else {
            nouns.transferFrom(address(this), _auction.bidder, _auction.nounId);
        }

        if (_auction.amount > 0) {
            _safeTransferETHWithFallback(profitRecipient, _auction.amount);
        }

        emit AuctionSettled(_auction.nounId, _auction.bidder, _auction.amount);
    }

    /**
     * @notice Transfer ETH. If the ETH transfer fails, wrap the ETH and try send it as WETH.
     */
    function _safeTransferETHWithFallback(address to, uint256 amount) internal {
        if (!_safeTransferETH(to, amount)) {
            IWETH(weth).deposit{value: amount}();
            IERC20(weth).transfer(to, amount);
        }
    }

    /**
     * @notice Transfer ETH and return the success status.
     */
    function _safeTransferETH(address to, uint256 value)
        internal
        returns (bool)
    {
        (bool success, ) = to.call{value: value}(new bytes(0));
        return success;
    }

    /**
     * @notice Get the profit recipient for a given `nounId`.
     * @dev Auction proceeds from inception to auction #365 will be donated to the NounsDAO,
     * while auction #366 - #730 proceeds will be sent to the NoudersDAO. After auction #730,
     * proceeds will be sent to the NounsDAO in perpetuity.
     */
    function _getProfitRecipient(uint256 nounId)
        internal
        view
        returns (address)
    {
        if (nounId <= 365 || nounId >= 731) {
            return nounsDAO;
        }
        return noundersDAO;
    }
}
