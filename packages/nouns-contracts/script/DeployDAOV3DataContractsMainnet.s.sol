// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { DeployDAOV3DataContractsBase } from './DeployDAOV3DataContractsBase.s.sol';

contract DeployDAOV3DataContractsMainnet is DeployDAOV3DataContractsBase {
    address public constant NOUNS_DAO_PROXY_MAINNET = 0x6f3E6272A167e8AcCb32072d08E0957F9c79223d;
    address public constant NOUNS_TIMELOCK_V2_PROXY_MAINNET = 0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71;

    constructor() DeployDAOV3DataContractsBase(NOUNS_DAO_PROXY_MAINNET, NOUNS_TIMELOCK_V2_PROXY_MAINNET) {}
}
