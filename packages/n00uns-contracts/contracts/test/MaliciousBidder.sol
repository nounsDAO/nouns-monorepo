// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.6;

import { IN00unsAuctionHouse } from '../interfaces/IN00unsAuctionHouse.sol';

contract MaliciousBidder {
    function bid(IN00unsAuctionHouse auctionHouse, uint256 tokenId) public payable {
        auctionHouse.createBid{ value: msg.value }(tokenId);
    }

    receive() external payable {
        assembly {
            invalid()
        }
    }
}
