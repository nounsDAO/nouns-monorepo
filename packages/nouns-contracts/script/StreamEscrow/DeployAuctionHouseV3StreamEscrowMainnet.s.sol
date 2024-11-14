// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { DeployAuctionHouseV3StreamEscrowBase } from './DeployAuctionHouseV3StreamEscrowBase.s.sol';
import { INounsDAOLogic } from '../../contracts/interfaces/INounsDAOLogic.sol';
import { StreamEscrow } from '../../contracts/StreamEscrow.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { NounsAuctionHouseV3 } from '../../contracts/NounsAuctionHouseV3.sol';

contract DeployAuctionHouseV3StreamEscrowMainnet is DeployAuctionHouseV3StreamEscrowBase {
    address constant AUCTION_HOUSE_MAINNET = 0x830BD73E4184ceF73443C15111a1DF14e495C706;
    address constant DAO_PROXY_MAINNET = 0x6f3E6272A167e8AcCb32072d08E0957F9c79223d;

    function run() public returns (StreamEscrow streamEscrow, NounsAuctionHouseV3 auctionHouseV3) {
        return
            super.runInternal({
                dao: INounsDAOLogic(DAO_PROXY_MAINNET),
                auctionHouseProxy: INounsAuctionHouseV2(AUCTION_HOUSE_MAINNET),
                minimumTickDuration: 24 hours
            });
    }
}
