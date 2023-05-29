// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { DeployDAOV3NewContractsBase } from './DeployDAOV3NewContractsBase.s.sol';

contract DeployDAOV3NewContractsMainnet is DeployDAOV3NewContractsBase {
    address public constant NOUNS_DAO_PROXY_MAINNET = 0x6f3E6272A167e8AcCb32072d08E0957F9c79223d;
    address public constant NOUNS_TIMELOCK_V1_MAINNET = 0x0BC3807Ec262cB779b38D65b38158acC3bfedE10;

    constructor() DeployDAOV3NewContractsBase(NOUNS_DAO_PROXY_MAINNET, NOUNS_TIMELOCK_V1_MAINNET, false) {}
}
