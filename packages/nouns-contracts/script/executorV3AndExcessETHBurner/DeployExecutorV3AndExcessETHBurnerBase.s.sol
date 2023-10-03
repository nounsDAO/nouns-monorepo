// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { NounsDAOExecutorV3 } from '../../contracts/governance/NounsDAOExecutorV3.sol';
import { ExcessETHBurner, INounsDAOV3 } from '../../contracts/governance/ExcessETHBurner.sol';
import { NounsDAOLogicV3 } from '../../contracts/governance/NounsDAOLogicV3.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { IERC20 } from '@openzeppelin/contracts/interfaces/IERC20.sol';

abstract contract DeployExecutorV3AndExcessETHBurnerBase is Script {
    address public immutable executorProxy;
    NounsDAOLogicV3 public immutable daoProxy;
    INounsAuctionHouseV2 public immutable auction;
    IERC20 wETH;
    IERC20 stETH;
    IERC20 rETH;
    uint128 burnStartNounID;
    uint128 minNewNounsBetweenBurns;
    uint16 numberOfPastAuctionsForMeanPrice;

    constructor(
        address payable executorProxy_,
        address wETH_,
        address stETH_,
        address rETH_,
        uint128 burnStartNounID_,
        uint128 minNewNounsBetweenBurns_,
        uint16 numberOfPastAuctionsForMeanPrice_
    ) {
        executorProxy = executorProxy_;

        daoProxy = NounsDAOLogicV3(payable(NounsDAOExecutorV3(executorProxy_).admin()));
        auction = INounsAuctionHouseV2(daoProxy.nouns().minter());

        wETH = IERC20(wETH_);
        stETH = IERC20(stETH_);
        rETH = IERC20(rETH_);

        burnStartNounID = burnStartNounID_;
        minNewNounsBetweenBurns = minNewNounsBetweenBurns_;
        numberOfPastAuctionsForMeanPrice = numberOfPastAuctionsForMeanPrice_;
    }

    function run() public returns (NounsDAOExecutorV3 executorV3, ExcessETHBurner burner) {
        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');

        vm.startBroadcast(deployerKey);

        executorV3 = new NounsDAOExecutorV3();
        burner = new ExcessETHBurner(
            executorProxy,
            INounsDAOV3(address(daoProxy)),
            auction,
            wETH,
            stETH,
            rETH,
            burnStartNounID,
            minNewNounsBetweenBurns,
            numberOfPastAuctionsForMeanPrice
        );

        vm.stopBroadcast();
    }
}
