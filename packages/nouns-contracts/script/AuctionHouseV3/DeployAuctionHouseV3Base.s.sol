// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { NounsAuctionHouseV3 } from '../../contracts/NounsAuctionHouseV3.sol';
import { OptimizedScript } from '../OptimizedScript.s.sol';

abstract contract DeployAuctionHouseV3Base is OptimizedScript {
    INounsAuctionHouseV2 public immutable auctionV2;

    constructor(address _auctionHouseProxy) {
        auctionV2 = INounsAuctionHouseV2(payable(_auctionHouseProxy));
    }

    function run() public returns (NounsAuctionHouseV3 newLogic) {
        requireDefaultProfile();
        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');

        vm.startBroadcast(deployerKey);

        newLogic = new NounsAuctionHouseV3(auctionV2.nouns(), auctionV2.weth(), auctionV2.duration());

        vm.stopBroadcast();
    }
}
