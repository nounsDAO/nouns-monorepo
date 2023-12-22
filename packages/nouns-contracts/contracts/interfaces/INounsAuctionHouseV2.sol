// SPDX-License-Identifier: GPL-3.0

/// @title Interface for Noun Auction Houses V2

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

import { INounsToken } from './INounsToken.sol';

interface INounsAuctionHouseV2 {
    struct AuctionV2 {
        // ID for the Noun (ERC721 token ID)
        uint128 nounId;
        // The current highest bid amount
        uint128 amount;
        // The time that the auction started
        uint40 startTime;
        // The time that the auction is scheduled to end
        uint40 endTime;
        // The address of the current highest bid
        address payable bidder;
        // Whether or not the auction has been settled
        bool settled;
    }

    struct SettlementState {
        // The block.timestamp when the auction was settled.
        uint32 blockTimestamp;
        // The winning bid amount, with 10 decimal places (reducing accuracy to save bits).
        uint64 amount;
        // The address of the auction winner.
        address winner;
    }

    struct Settlement {
        // The block.timestamp when the auction was settled.
        uint32 blockTimestamp;
        // The winning bid amount, converted from 10 decimal places to 18, for better client UX.
        uint256 amount;
        // The address of the auction winner.
        address winner;
        // ID for the Noun (ERC721 token ID).
        uint256 nounId;
    }

    event AuctionCreated(uint256 indexed nounId, uint256 startTime, uint256 endTime);

    event AuctionBid(uint256 indexed nounId, address sender, uint256 value, bool extended);

    event AuctionExtended(uint256 indexed nounId, uint256 endTime);

    event AuctionSettled(uint256 indexed nounId, address winner, uint256 amount);

    event AuctionTimeBufferUpdated(uint256 timeBuffer);

    event AuctionReservePriceUpdated(uint256 reservePrice);

    event AuctionMinBidIncrementPercentageUpdated(uint256 minBidIncrementPercentage);

    event HistoricPricesSet(uint256[] nounIds, uint256[] prices);

    function settleAuction() external;

    function settleCurrentAndCreateNewAuction() external;

    function createBid(uint256 nounId) external payable;

    function pause() external;

    function unpause() external;

    function setTimeBuffer(uint56 timeBuffer) external;

    function setReservePrice(uint192 reservePrice) external;

    function setMinBidIncrementPercentage(uint8 minBidIncrementPercentage) external;

    function auction() external view returns (AuctionV2 memory);

    function getSettlements(uint256 auctionCount) external view returns (Settlement[] memory settlements);

    function getPrices(uint256 auctionCount) external view returns (uint256[] memory prices);

    function getSettlements(uint256 startId, uint256 endId) external view returns (Settlement[] memory settlements);

    function getPrices(uint256 startId, uint256 endId) external view returns (uint256[] memory prices);

    function warmUpSettlementState(uint256[] calldata nounIds) external;

    function nouns() external view returns (INounsToken);
}
