// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import { NounsAuctionHouseV3 } from '../../../contracts/NounsAuctionHouseV3.sol';

contract BidderWithGasGriefing {
    function bid(NounsAuctionHouseV3 auctionHouse, uint256 nounId) public payable {
        auctionHouse.createBid{ value: msg.value }(nounId);
    }

    receive() external payable {
        assembly {
            return(0, 107744)
        }
    }
}
