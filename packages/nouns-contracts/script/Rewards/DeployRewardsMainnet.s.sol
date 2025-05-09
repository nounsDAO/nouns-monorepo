// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { DeployRewardsBase } from './DeployRewardsBase.s.sol';
import { Rewards } from '../../contracts/client-incentives/Rewards.sol';
import { INounsDAOLogic } from '../../contracts/interfaces/INounsDAOLogic.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';

contract DeployRewardsMainnet is DeployRewardsBase {
    address constant AUCTION_HOUSE_MAINNET = 0x830BD73E4184ceF73443C15111a1DF14e495C706;
    address constant DAO_PROXY_MAINNET = 0x6f3E6272A167e8AcCb32072d08E0957F9c79223d;
    address constant VERBS_SAFE_MAINNET = 0x1020E5b6dB4382A93dab447AE9a310D24404962b;
    address constant WETH_MAINNET = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    function run() public returns (Rewards rewards) {
        return
            super.runInternal({
                dao: INounsDAOLogic(DAO_PROXY_MAINNET),
                auctionHouse: INounsAuctionHouseV2(AUCTION_HOUSE_MAINNET),
                admin: VERBS_SAFE_MAINNET,
                ethToken: WETH_MAINNET
            });
    }
}
