// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { DeployAuctionHouseV3StreamEscrowBase } from './DeployAuctionHouseV3StreamEscrowBase.s.sol';
import { INounsDAOLogic } from '../../contracts/interfaces/INounsDAOLogic.sol';
import { StreamEscrow } from '../../contracts/StreamEscrow.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { NounsAuctionHouseV3 } from '../../contracts/NounsAuctionHouseV3.sol';

contract DeployAuctionHouseV3StreamEscrowSepolia is DeployAuctionHouseV3StreamEscrowBase {
    address constant AUCTION_HOUSE_SEPOLIA = 0x949dBCcc3EE35f11014DB0E48f21900E245564Ad;
    address constant DAO_PROXY_SEPOLIA = 0x15873cb1B67b0E68c97B9113713F8F2051A1c01a;

    function run() public returns (StreamEscrow streamEscrow, NounsAuctionHouseV3 auctionHouseV3) {
        return
            super.runInternal({
                dao: INounsDAOLogic(DAO_PROXY_SEPOLIA),
                auctionHouseProxy: INounsAuctionHouseV2(AUCTION_HOUSE_SEPOLIA),
                minimumTickDuration: 2 minutes
            });
    }
}
