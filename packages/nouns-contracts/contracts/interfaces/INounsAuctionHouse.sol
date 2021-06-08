// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

import {INounsERC721} from './INounsERC721.sol';

/**
 * @title Interface for Noun Auction Houses
 */
interface INounsAuctionHouse {
    struct Auction {
        // ID for the Noun (ERC721 token ID)
        uint256 nounId;
        // The current highest bid amount
        uint256 amount;
        // The time that the auction started
        uint256 startTime;
        // The time that the auction can be considered ended
        uint256 endTime;
        // The address of the current highest bid
        address payable bidder;
    }

    event AuctionCreated(uint256 indexed nounId, uint256 startTime, uint256 endTime);

    event AuctionBid(
        uint256 indexed nounId,
        address sender,
        uint256 value,
        bool firstBid,
        bool extended
    );

    event AuctionDurationExtended(uint256 indexed nounId, uint256 endTime);

    event AuctionEnded(uint256 indexed nounId, address winner, uint256 amount);

    event AuctionTimeBufferUpdated(uint256 timeBuffer);

    event AuctionReservePriceUpdated(uint256 reservePrice);

    event AuctionMinBidIncrementPercentageUpdated(
        uint256 minBidIncrementPercentage
    );

    event AuctionDurationUpdated(uint256 duration);

    function endCurrentAndCreateNewAuction() external returns (uint256);

    function createBid(uint256 nounId, uint256 amount) external payable;

    function setTimeBuffer(uint256 timeBuffer) external;

    function setReservePrice(uint256 reservePrice) external;

    function setMinBidIncrementPercentage(uint8 minBidIncrementPercentage)
        external;

    function setDuration(uint256 duration) external;
}
