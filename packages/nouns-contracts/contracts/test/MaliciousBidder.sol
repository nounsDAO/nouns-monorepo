// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.6;

import { INounsAuctionHouse } from '../interfaces/INounsAuctionHouse.sol';

contract MaliciousBidder {
    function bid(INounsAuctionHouse auctionHouse, uint256 tokenId) public payable {
        auctionHouse.createBid{ value: msg.value }(0, tokenId);
    }

    receive() external payable {
        assembly {
            invalid()
        }
    }
}
