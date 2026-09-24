// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { NounsAuctionHouseV4 } from '../../contracts/NounsAuctionHouseV4.sol';
import { OptimizedScript } from '../OptimizedScript.s.sol';

abstract contract DeployAuctionHouseV4Base is OptimizedScript {
    INounsAuctionHouseV2 public immutable auctionV2;

    constructor(address _auctionHouseProxy) {
        auctionV2 = INounsAuctionHouseV2(payable(_auctionHouseProxy));
    }

    function run() public returns (NounsAuctionHouseV4 newLogic) {
        requireDefaultProfile();
        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');

        vm.startBroadcast(deployerKey);

        newLogic = new NounsAuctionHouseV4(auctionV2.nouns(), auctionV2.weth(), auctionV2.duration());

        vm.stopBroadcast();
    }
}
