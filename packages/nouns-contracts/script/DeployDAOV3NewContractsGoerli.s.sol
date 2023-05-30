// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { DeployDAOV3NewContractsBase } from './DeployDAOV3NewContractsBase.s.sol';

contract DeployDAOV3NewContractsGoerli is DeployDAOV3NewContractsBase {
    address public constant NOUNS_DAO_PROXY_GOERLI = 0x9e6D4B42b8Dc567AC4aeCAB369Eb9a3156dF095C;
    address public constant NOUNS_TIMELOCK_V1_GOERLI = 0xADa0F1A73D1df49477fa41C7F8476F9eA5aB115f;

    constructor() DeployDAOV3NewContractsBase(NOUNS_DAO_PROXY_GOERLI, NOUNS_TIMELOCK_V1_GOERLI, true) {}
}
