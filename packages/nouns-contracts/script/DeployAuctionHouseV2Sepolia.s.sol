// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { NounsAuctionHouse } from '../contracts/NounsAuctionHouse.sol';
import { NounsAuctionHouseV2 } from '../contracts/NounsAuctionHouseV2.sol';
import { NounsAuctionHousePreV2Migration } from '../contracts/NounsAuctionHousePreV2Migration.sol';

import { DeployAuctionHouseV2Base } from './DeployAuctionHouseV2Base.s.sol';

contract DeployAuctionHouseV2Sepolia is DeployAuctionHouseV2Base {
    address constant AUCTION_HOUSE_SEPOLIA = 0x45ebbdb0E66aC2a8339D98aDB6934C89f166A754;

    constructor() DeployAuctionHouseV2Base(AUCTION_HOUSE_SEPOLIA) {}
}
