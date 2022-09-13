// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.6;

import { IAuctionHouse } from '../interfaces/IAuctionHouse.sol';

contract MaliciousBidder {
    function bid(IAuctionHouse auctionHouse, uint256 tokenId) public payable {
        auctionHouse.createBid{ value: msg.value }(tokenId);
    }

    receive() external payable {
        assembly {
            invalid()
        }
    }
}
