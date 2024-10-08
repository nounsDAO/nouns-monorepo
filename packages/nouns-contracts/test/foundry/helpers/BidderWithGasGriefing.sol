// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import { INounsAuctionHouseV2 } from '../../../contracts/interfaces/INounsAuctionHouseV2.sol';

contract BidderWithGasGriefing {
    function bid(INounsAuctionHouseV2 auctionHouse, uint256 nounId) public payable {
        auctionHouse.createBid{ value: msg.value }(nounId);
    }

    receive() external payable {
        assembly {
            return(0, 107744)
        }
    }
}
