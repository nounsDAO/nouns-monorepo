// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { DeployRewardsBase } from './DeployRewardsBase.s.sol';
import { Rewards } from '../../contracts/client-incentives/Rewards.sol';
import { INounsDAOLogic } from '../../contracts/interfaces/INounsDAOLogic.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';

contract DeployRewardsSepolia is DeployRewardsBase {
    address constant AUCTION_HOUSE_SEPOLIA = 0xf459b7573a9c2B37eF21F2f7a1a96339E343CdD8;
    address constant DAO_PROXY_SEPOLIA = 0xDefBf39D0E251fc058fF44B96D40Cf3347596EB9;
    address constant VERBS_SAFE_SEPOLIA = 0x6819e97114203100d38D3D7ec214Bc3EBa6d5a0B;
    address constant MOCK_ETH_TOKEN_SEPOLIA = 0x7f96dAEF4A54F6A52613d6272560C2BD25e913B8;

    function run() public returns (Rewards rewards) {
        return
            super.runInternal({
                dao: INounsDAOLogic(DAO_PROXY_SEPOLIA),
                auctionHouse: INounsAuctionHouseV2(AUCTION_HOUSE_SEPOLIA),
                admin: VERBS_SAFE_SEPOLIA,
                ethToken: MOCK_ETH_TOKEN_SEPOLIA
            });
    }
}
