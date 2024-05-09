// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { OptimizedScript } from '../OptimizedScript.s.sol';
import { Rewards } from '../../contracts/client-incentives/Rewards.sol';
import { INounsDAOLogic } from '../../contracts/interfaces/INounsDAOLogic.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { NounsClientTokenDescriptor } from '../../contracts/client-incentives/NounsClientTokenDescriptor.sol';
import { RewardsDeployer } from './RewardsDeployer.sol';

abstract contract DeployRewardsBase is OptimizedScript {
    function runInternal(
        INounsDAOLogic dao,
        INounsAuctionHouseV2 auctionHouse,
        address admin,
        address ethToken
    ) internal returns (Rewards rewards) {
        requireDefaultProfile();

        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');

        vm.startBroadcast(deployerKey);

        rewards = RewardsDeployer.deployRewards({
            dao: dao,
            admin: admin,
            auctionHouse: address(auctionHouse),
            erc20: ethToken,
            descriptor: address(new NounsClientTokenDescriptor())
        });

        vm.stopBroadcast();
    }
}
