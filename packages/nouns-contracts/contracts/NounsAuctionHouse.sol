// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

import {ReentrancyGuard} from '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import {Initializable} from '@openzeppelin/contracts/proxy/utils/Initializable.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {INounsAuctionHouse} from './interfaces/INounsAuctionHouse.sol';
import {INounsERC721} from './interfaces/INounsERC721.sol';
import {IWETH} from './interfaces/IWETH.sol';

/**
 * @title The NounsDAO auction house
 */
contract NounsAuctionHouse is
    INounsAuctionHouse,
    ReentrancyGuard,
    Initializable
{
    // The Nouns ERC721 token contract
    INounsERC721 public immutable nouns;

    // The nounsDAO address (avatars org)
    address public immutable nounsDAO;

    // The noundersDAO address (creators org)
    address public immutable noundersDAO;

    // The address of the WETH contract
    address public immutable weth;

    // The minimum amount of time left in an auction after a new bid is created
    uint256 public constant timeBuffer = 15 * 60;

    // The minimum percentage difference between the last bid amount and the current bid
    uint8 public constant minBidIncrementPercentage = 5;

    // The duration of a single auction
    uint256 public constant auctionDuration = 24 hours;

    // The active auction
    INounsAuctionHouse.Auction auction;

    /**
     * @notice Require that the sender is the noundersDAO
     */
    modifier onlyNoundersDAO() {
        require(msg.sender == noundersDAO, 'Sender is not the noundersDAO');
        _;
    }

    /*
     * Constructor
     */
    constructor(
        INounsERC721 _nouns,
        address _nounsDAO,
        address _noundersDAO,
        address _weth
    ) {
        nouns = _nouns;
        nounsDAO = _nounsDAO;
        noundersDAO = _noundersDAO;
        weth = _weth;
    }

    /**
     * @notice Initialize the auction house by creating the first Noun auction.
     * @dev This function can only be called once by the noundersDAO.
     */
    function initialize()
        external
        override
        onlyNoundersDAO
        initializer
        returns (uint256)
    {
        return _createAuction();
    }

    /**
     * @notice End the current auction, mint a new Noun, and put it up for auction.
     */
    function endCurrentAndCreateNewAuction()
        external
        override
        nonReentrant
        returns (uint256)
    {
        _endAuction();
        return _createAuction();
    }

    /**
     * @notice Create a bid for a Noun, with a given amount.
     * @dev This contract only accepts payment in ETH.
     */
    function createBid(uint256 nounId, uint256 amount)
        external
        payable
        override
        nonReentrant
    {
        INounsAuctionHouse.Auction memory _auction = auction;

        require(_auction.nounId == nounId, 'Noun not up for auction');
        require(amount >= 1, 'Must send at least 1 wei');
        require(amount >= _auction.amount + ((_auction.amount * minBidIncrementPercentage) / 100),
            'Must send more than last bid by minBidIncrementPercentage amount'
        );
        require(
            msg.value == amount,
            'Sent ETH Value does not match specified bid amount'
        );

        address payable lastBidder = _auction.bidder;

        // Refund the last bidder, if applicable
        if (lastBidder != address(0)) {
            _safeTransferETHWithFallback(lastBidder, _auction.amount);
        }

        auction.amount = amount;
        auction.bidder = payable(msg.sender);

        bool extended = false;
        // At this point we know that the timestamp is less than start + duration (since the auction would be over, otherwise)
        // we want to know by how much the timestamp is less than start + duration
        // if the difference is less than the timeBuffer, increase the duration by the timeBuffer
        // prettier-ignore
        if (_auction.startTime + _auction.duration - block.timestamp < timeBuffer) {
            // Playing code golf for gas optimization:
            // uint256 expectedEnd = _auction.startTime + _auction.duration;
            // uint256 timeRemaining = expectedEnd - block.timestamp;
            // uint256 timeToAdd = timeBuffer - timeRemaining;
            // uint256 newDuration = _auction.duration + timeToAdd;
            uint256 oldDuration = _auction.duration;
            auction.duration = _auction.duration = oldDuration + (timeBuffer - _auction.startTime + oldDuration - block.timestamp);
            extended = true;
        }

        emit AuctionBid(
            _auction.nounId,
            msg.sender,
            amount,
            lastBidder == address(0), // firstBid boolean
            extended
        );

        if (extended) {
            emit AuctionDurationExtended(_auction.nounId, _auction.duration);
        }
    }

    /**
     * @notice Create an auction.
     * @dev Store the auction details in the `auction` state variable and emit an AuctionCreated event.
     */
    function _createAuction() internal returns (uint256) {
        uint256 nounId = nouns.createNoun();
        address profitRecipient = _getProfitRecipient(nounId);

        auction = Auction({
            nounId: nounId,
            amount: 0,
            duration: auctionDuration,
            startTime: block.timestamp,
            profitRecipient: profitRecipient,
            bidder: payable(0)
        });

        emit AuctionCreated(nounId, profitRecipient);

        return nounId;
    }

    /**
     * @notice End an auction, finalizing the bid and paying out to the DAO.
     */
    function _endAuction() internal {
        INounsAuctionHouse.Auction memory _auction = auction;

        require(
            block.timestamp >= _auction.startTime + _auction.duration,
            "Auction hasn't completed"
        );

        uint256 daoProfit = _auction.amount;

        // Transfer the Noun to the winner and transfer profit to the DAO
        nouns.transferFrom(address(this), _auction.bidder, _auction.nounId);

        _safeTransferETHWithFallback(_auction.profitRecipient, daoProfit);

        emit AuctionEnded(_auction.nounId, _auction.bidder, daoProfit);
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
