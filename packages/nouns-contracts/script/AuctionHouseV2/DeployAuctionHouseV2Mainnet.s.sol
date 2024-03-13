// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { DeployAuctionHouseV2Base } from './DeployAuctionHouseV2Base.s.sol';

contract DeployAuctionHouseV2Mainnet is DeployAuctionHouseV2Base {
    address constant AUCTION_HOUSE_PROXY_MAINNET = 0x830BD73E4184ceF73443C15111a1DF14e495C706;

    constructor() DeployAuctionHouseV2Base(AUCTION_HOUSE_PROXY_MAINNET) {}
}