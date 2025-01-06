// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { DeployDataContractsBase } from './DeployDataContractsBase.s.sol';

contract DeployDataContractsMainnet is DeployDataContractsBase {
    address public constant NOUNS_DAO_PROXY_MAINNET = 0x6f3E6272A167e8AcCb32072d08E0957F9c79223d;

    constructor() DeployDataContractsBase(NOUNS_DAO_PROXY_MAINNET) {}
}
