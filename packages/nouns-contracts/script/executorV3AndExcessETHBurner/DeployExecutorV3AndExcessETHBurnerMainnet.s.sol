// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { DeployExecutorV3AndExcessETHBurnerBase } from './DeployExecutorV3AndExcessETHBurnerBase.s.sol';

contract DeployExecutorV3AndExcessETHBurnerMainnet is DeployExecutorV3AndExcessETHBurnerBase {
    address payable constant EXECUTOR_PROXY = payable(0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71);
    address constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address constant STETH = 0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84;
    address constant RETH = 0xae78736Cd615f374D3085123A210448E74Fc6393;

    uint64 BURN_START_NOUN_ID = type(uint64).max;
    uint64 NOUNS_BETWEEN_BURNS = 0;
    uint16 BURN_WINDOW_SIZE = 3;
    uint16 MEAN_AUCTION_COUNT = 1;

    constructor()
        DeployExecutorV3AndExcessETHBurnerBase(
            EXECUTOR_PROXY,
            WETH,
            STETH,
            RETH,
            BURN_START_NOUN_ID,
            NOUNS_BETWEEN_BURNS,
            BURN_WINDOW_SIZE,
            MEAN_AUCTION_COUNT
        )
    {}
}
