// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

/**
 * @title Interface for Noun Auction Houses
 */
interface INounsAuctionHouse {
    struct Auction {
        // ID for the Noun (ERC721 token ID)
        uint256 nounId;
        // The current highest bid amount
        uint256 amount;
        // The length of time to run the auction for, after the first bid was made
        uint256 duration;
        // The time that the auction started
        uint256 startTime;
        // The address that should receive the funds once the Noun is sold
        address profitRecipient;
        // The address of the current highest bid
        address payable bidder;
    }

    event AuctionCreated(uint256 indexed nounId, address profitRecipient);

    event AuctionBid(
        uint256 indexed nounId,
        address sender,
        uint256 value,
        bool firstBid,
        bool extended
    );

    event AuctionDurationExtended(uint256 indexed nounId, uint256 duration);

    event AuctionEnded(uint256 indexed nounId, address winner, uint256 amount);

    function initialize() external returns (uint256);

    function endCurrentAndCreateNewAuction() external returns (uint256);

    function createBid(uint256 nounId, uint256 amount) external payable;
}
