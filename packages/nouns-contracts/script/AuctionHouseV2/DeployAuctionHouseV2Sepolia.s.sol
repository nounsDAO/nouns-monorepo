// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { DeployAuctionHouseV2Base } from './DeployAuctionHouseV2Base.s.sol';

contract DeployAuctionHouseV2Sepolia is DeployAuctionHouseV2Base {
    address constant AUCTION_HOUSE_SEPOLIA = 0xf459b7573a9c2B37eF21F2f7a1a96339E343CdD8;

    constructor() DeployAuctionHouseV2Base(AUCTION_HOUSE_SEPOLIA) {}
}