// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.6;

import { ITellerAuctionHouse } from '../interfaces/ITellerAuctionHouse.sol';

contract MaliciousBidder {
    function bid(ITellerAuctionHouse auctionHouse, uint256 tokenId) public payable {
        auctionHouse.createBid{ value: msg.value }(tokenId);
    }

    receive() external payable {
        assembly {
            invalid()
        }
    }
}
