// SPDX-License-Identifier: GPL-3.0

/// @title An interim contract for storage migration between V1 and V2

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

import { PausableUpgradeable } from '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import { ReentrancyGuardUpgradeable } from '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { INounsAuctionHouse } from './interfaces/INounsAuctionHouse.sol';
import { INounsAuctionHouseV2 } from './interfaces/INounsAuctionHouseV2.sol';

contract NounsAuctionHousePreV2Migration is PausableUpgradeable, ReentrancyGuardUpgradeable, OwnableUpgradeable {
    struct OldLayout {
        address nouns;
        address weth;
        uint256 timeBuffer;
        uint256 reservePrice;
        uint8 minBidIncrementPercentage;
        uint256 duration;
        INounsAuctionHouse.Auction auction;
    }

    struct NewLayout {
        uint192 reservePrice;
        uint56 timeBuffer;
        uint8 minBidIncrementPercentage;
        INounsAuctionHouseV2.AuctionV2 auction;
    }

    uint256 private startSlot;

    constructor() {
        /// @dev Make sure startSlot points to the correct slot
        uint256 startSlotLocation;
        assembly {
            startSlotLocation := startSlot.slot
        }
        require(startSlotLocation == 0xc9);
    }

    function migrate() public onlyOwner {
        OldLayout storage oldLayout = _oldLayout();
        NewLayout storage newLayout = _newLayout();
        OldLayout memory oldLayoutCache = oldLayout;

        // Clear the old storage layout
        oldLayout.nouns = address(0);
        oldLayout.weth = address(0);
        oldLayout.timeBuffer = 0;
        oldLayout.reservePrice = 0;
        oldLayout.minBidIncrementPercentage = 0;
        oldLayout.duration = 0;
        oldLayout.auction = INounsAuctionHouse.Auction(0, 0, 0, 0, payable(0), false);

        // Populate the new layout from the cache
        newLayout.reservePrice = uint192(oldLayoutCache.reservePrice);
        newLayout.timeBuffer = uint56(oldLayoutCache.timeBuffer);
        newLayout.minBidIncrementPercentage = oldLayoutCache.minBidIncrementPercentage;
        newLayout.auction = INounsAuctionHouseV2.AuctionV2({
            nounId: uint96(oldLayoutCache.auction.nounId),
            clientId: 0,
            amount: uint128(oldLayoutCache.auction.amount),
            startTime: uint40(oldLayoutCache.auction.startTime),
            endTime: uint40(oldLayoutCache.auction.endTime),
            bidder: oldLayoutCache.auction.bidder,
            settled: oldLayoutCache.auction.settled
        });
    }

    function _oldLayout() internal pure returns (OldLayout storage layout) {
        assembly {
            layout.slot := startSlot.slot
        }
    }

    function _newLayout() internal pure returns (NewLayout storage layout) {
        assembly {
            layout.slot := startSlot.slot
        }
    }
}
