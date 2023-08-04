// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { DeployDAOV3DataContractsBase } from './DeployDAOV3DataContractsBase.s.sol';

contract DeployDAOV3DataContractsGoerli is DeployDAOV3DataContractsBase {
    address public constant NOUNS_DAO_PROXY_GOERLI = 0x34b74B5c1996b37e5e3EDB756731A5812FF43F67;
    address public constant NOUNS_TIMELOCK_V2_PROXY_GOERLI = 0xc1A82A952d48E015beA401AC982AA3D019AAA91E;

    constructor() DeployDAOV3DataContractsBase(NOUNS_DAO_PROXY_GOERLI, NOUNS_TIMELOCK_V2_PROXY_GOERLI) {}
}
