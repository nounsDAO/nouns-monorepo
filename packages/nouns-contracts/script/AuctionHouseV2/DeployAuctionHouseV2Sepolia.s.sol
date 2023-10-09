// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { DeployAuctionHouseV2Base } from './DeployAuctionHouseV2Base.s.sol';

contract DeployAuctionHouseV2Sepolia is DeployAuctionHouseV2Base {
    address constant AUCTION_HOUSE_SEPOLIA = 0x45ebbdb0E66aC2a8339D98aDB6934C89f166A754;

    constructor() DeployAuctionHouseV2Base(AUCTION_HOUSE_SEPOLIA) {}
}
