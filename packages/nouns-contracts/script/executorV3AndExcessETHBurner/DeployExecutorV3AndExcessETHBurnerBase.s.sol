// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { NounsDAOExecutorV3 } from '../../contracts/governance/NounsDAOExecutorV3.sol';
import { NounsTokenLike } from '../../contracts/governance/NounsDAOInterfaces.sol';
import { ExcessETHBurner, INounsDAOV3 } from '../../contracts/governance/ExcessETHBurner.sol';
import { INounsAuctionHouseV2 } from '../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { IERC20 } from '@openzeppelin/contracts/interfaces/IERC20.sol';

interface INounsDAOLogicV3 {
    function nouns() external view returns (NounsTokenLike);
}

abstract contract DeployExecutorV3AndExcessETHBurnerBase is Script {
    address public immutable executorProxy;
    INounsDAOLogicV3 public immutable daoProxy;
    INounsAuctionHouseV2 public immutable auction;
    IERC20 public immutable wETH;
    IERC20 public immutable stETH;
    IERC20 public immutable rETH;
    uint128 public immutable burnStartNounID;
    uint128 public immutable minNewNounsBetweenBurns;
    uint16 public immutable numberOfPastAuctionsForMeanPrice;

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

        daoProxy = INounsDAOLogicV3(payable(NounsDAOExecutorV3(executorProxy_).admin()));
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
