// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { DeployAuctionHouseV4Base } from './DeployAuctionHouseV4Base.s.sol';

contract DeployAuctionHouseV4Mainnet is DeployAuctionHouseV4Base {
    address constant AUCTION_HOUSE_PROXY_MAINNET = 0x830BD73E4184ceF73443C15111a1DF14e495C706;

    constructor() DeployAuctionHouseV4Base(AUCTION_HOUSE_PROXY_MAINNET) {}
}
