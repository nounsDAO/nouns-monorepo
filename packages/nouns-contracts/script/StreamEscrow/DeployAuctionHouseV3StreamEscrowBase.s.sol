// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { OptimizedScript } from '../OptimizedScript.s.sol';
import { INounsDAOLogic } from '../../contracts/interfaces/INounsDAOLogic.sol';
import { StreamEscrow } from '../../contracts/StreamEscrow.sol';
import { NounsAuctionHouseV3 } from '../../contracts/NounsAuctionHouseV3.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';

abstract contract DeployAuctionHouseV3StreamEscrowBase is OptimizedScript {
    function runInternal(
        INounsDAOLogic dao,
        INounsAuctionHouseV2 auctionHouseProxy,
        uint32 minimumTickDuration
    ) internal returns (StreamEscrow streamEscrow, NounsAuctionHouseV3 auctionHouseV3) {
        requireDefaultProfile();

        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');

        vm.startBroadcast(deployerKey);

        address timelock = address(dao.timelock());
        address nounsToken = address(dao.nouns());

        auctionHouseV3 = new NounsAuctionHouseV3(
            auctionHouseProxy.nouns(),
            auctionHouseProxy.weth(),
            auctionHouseProxy.duration()
        );
        streamEscrow = new StreamEscrow({
            daoExecutor_: timelock,
            ethRecipient_: timelock,
            nounsRecipient_: timelock,
            nounsToken_: nounsToken,
            streamCreator_: address(auctionHouseProxy),
            minimumTickDuration_: minimumTickDuration
        });

        vm.stopBroadcast();
    }
}
