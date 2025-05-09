// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { DeployDAOV3DataContractsBase } from './DeployDAOV3DataContractsBase.s.sol';

contract DeployDAOV3DataContractsSepolia is DeployDAOV3DataContractsBase {
    address public constant NOUNS_DAO_PROXY_SEPOLIA = 0x35d2670d7C8931AACdd37C89Ddcb0638c3c44A57;
    address public constant NOUNS_TIMELOCK_V2_PROXY_SEPOLIA = 0x07e5D6a1550aD5E597A9b0698A474AA080A2fB28;

    constructor() DeployDAOV3DataContractsBase(NOUNS_DAO_PROXY_SEPOLIA, NOUNS_TIMELOCK_V2_PROXY_SEPOLIA) {}
}
