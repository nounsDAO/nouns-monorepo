// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { DeployDataContractsBase } from './DeployDataContractsBase.s.sol';

contract DeployDataContractsSepolia is DeployDataContractsBase {
    address public constant NOUNS_DAO_PROXY_SEPOLIA = 0x35d2670d7C8931AACdd37C89Ddcb0638c3c44A57;

    constructor() DeployDataContractsBase(NOUNS_DAO_PROXY_SEPOLIA) {}
}
