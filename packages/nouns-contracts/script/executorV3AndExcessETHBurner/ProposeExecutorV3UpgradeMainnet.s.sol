// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import { ProposeExecutorV3UpgradeBase } from './ProposeExecutorV3UpgradeBase.s.sol';

contract ProposeDAOV3UpgradeMainnet is ProposeExecutorV3UpgradeBase {
    address public constant NOUNS_DAO_PROXY_MAINNET = 0x6f3E6272A167e8AcCb32072d08E0957F9c79223d;
    address public constant EXECUTOR_PROXY_MAINNET = 0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71;
    address public constant EXECUTOR_V3_IMPL = address(0);

    constructor() {
        proposerKey = vm.envUint('PROPOSER_KEY');
        description = vm.readFile(vm.envString('PROPOSAL_DESCRIPTION_FILE'));
        daoProxy = NOUNS_DAO_PROXY_MAINNET;
        executorProxy = EXECUTOR_PROXY_MAINNET;
        executorV3Impl = EXECUTOR_V3_IMPL;
    }
}
