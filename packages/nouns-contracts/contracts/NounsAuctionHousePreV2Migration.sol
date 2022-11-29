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

pragma solidity ^0.8.6;

import { PausableUpgradeable } from '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import { ReentrancyGuardUpgradeable } from '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { INounsAuctionHouse } from './interfaces/INounsAuctionHouse.sol';

contract NounsAuctionHousePreV2Migration is PausableUpgradeable, ReentrancyGuardUpgradeable, OwnableUpgradeable {
    // See NounsAuctionHouse for docs on these state vars
    address public nouns;
    address public weth;
    uint256 public timeBuffer;
    uint256 public reservePrice;
    uint8 public minBidIncrementPercentage;
    uint256 public duration;
    INounsAuctionHouse.Auction public auction;

    function migrate() public onlyOwner {
        INounsAuctionHouse.Auction memory _auction = auction;

        // nullifying previous storage slots to avoid the risk of leftovers
        auction = INounsAuctionHouse.Auction(0, 0, 0, 0, payable(address(0)), false);

        INounsAuctionHouse.AuctionV2 storage auctionV2;
        assembly {
            auctionV2.slot := auction.slot
        }

        auctionV2.nounId = uint128(_auction.nounId);
        auctionV2.amount = uint128(_auction.amount);
        auctionV2.startTime = uint40(_auction.startTime);
        auctionV2.endTime = uint40(_auction.endTime);
        auctionV2.bidder = _auction.bidder;
        auctionV2.settled = _auction.settled;
    }
}
