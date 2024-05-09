// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { NounsAuctionHouse } from '../../contracts/NounsAuctionHouse.sol';
import { NounsAuctionHouseV2 } from '../../contracts/NounsAuctionHouseV2.sol';
import { NounsAuctionHousePreV2Migration } from '../../contracts/NounsAuctionHousePreV2Migration.sol';
import { OptimizedScript } from '../OptimizedScript.s.sol';

abstract contract DeployAuctionHouseV2Base is OptimizedScript {
    NounsAuctionHouse public immutable auctionV1;

    constructor(address _auctionHouseProxy) {
        auctionV1 = NounsAuctionHouse(payable(_auctionHouseProxy));
    }

    function run() public returns (NounsAuctionHouseV2 newLogic, NounsAuctionHousePreV2Migration migratorLogic) {
        requireDefaultProfile();
        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');

        vm.startBroadcast(deployerKey);

        newLogic = new NounsAuctionHouseV2(auctionV1.nouns(), auctionV1.weth(), auctionV1.duration());
        migratorLogic = new NounsAuctionHousePreV2Migration();

        vm.stopBroadcast();
    }
}
