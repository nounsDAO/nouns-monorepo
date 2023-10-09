// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { DeployExecutorV3AndExcessETHBurnerBase } from './DeployExecutorV3AndExcessETHBurnerBase.s.sol';

contract DeployExecutorV3AndExcessETHBurnerSepolia is DeployExecutorV3AndExcessETHBurnerBase {
    address payable constant EXECUTOR_PROXY = payable(0x6c2dD53b8DbDD3af1209DeB9dA87D487EaE8E638);
    address constant WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14;
    address constant STETH = 0x7f96dAEF4A54F6A52613d6272560C2BD25e913B8;
    address constant RETH = 0xf07dafCC49a9F5E1E73Df6bD6616d0a5bA19e502;

    uint128 BURN_START_NOUN_ID = 10;
    uint128 MIN_NOUNS_BETWEEN_BURNS = 10;
    uint16 MEAN_AUCTION_COUNT = 10;

    constructor()
        DeployExecutorV3AndExcessETHBurnerBase(
            EXECUTOR_PROXY,
            WETH,
            STETH,
            RETH,
            BURN_START_NOUN_ID,
            MIN_NOUNS_BETWEEN_BURNS,
            MEAN_AUCTION_COUNT
        )
    {}
}
