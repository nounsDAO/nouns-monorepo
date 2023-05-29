// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { DeployDAOV3NewContractsBase } from './DeployDAOV3NewContractsBase.s.sol';

contract DeployDAOV3NewContractsGoerli is DeployDAOV3NewContractsBase {
    address public constant NOUNS_DAO_PROXY_GOERLI = 0x34b74B5c1996b37e5e3EDB756731A5812FF43F67;
    address public constant NOUNS_TIMELOCK_V1_GOERLI = 0x62e85a8dbc2799fB5D12BC59556bD3721D5E4CdE;

    constructor() DeployDAOV3NewContractsBase(NOUNS_DAO_PROXY_GOERLI, NOUNS_TIMELOCK_V1_GOERLI, true) {}
}
