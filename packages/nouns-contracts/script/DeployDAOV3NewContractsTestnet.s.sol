// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { DeployDAOV3NewContractsBase } from './DeployDAOV3NewContractsBase.s.sol';

contract DeployDAOV3NewContractsGoerli is DeployDAOV3NewContractsBase {
    address public constant NOUNS_DAO_PROXY_GOERLI = 0x9e6D4B42b8Dc567AC4aeCAB369Eb9a3156dF095C;
    address public constant NOUNS_TIMELOCK_V1_GOERLI = 0xADa0F1A73D1df49477fa41C7F8476F9eA5aB115f;
    uint256 public constant FORK_DAO_VOTING_PERIOD = 40; // 8 minutes
    uint256 public constant FORK_DAO_VOTING_DELAY = 1;

    constructor()
        DeployDAOV3NewContractsBase(
            NOUNS_DAO_PROXY_GOERLI,
            NOUNS_TIMELOCK_V1_GOERLI,
            true,
            FORK_DAO_VOTING_PERIOD,
            FORK_DAO_VOTING_DELAY
        )
    {}
}

contract DeployDAOV3NewContractsSepolia is DeployDAOV3NewContractsBase {
    address public constant NOUNS_DAO_PROXY_SEPOLIA = 0x35d2670d7C8931AACdd37C89Ddcb0638c3c44A57;
    address public constant NOUNS_TIMELOCK_V1_SEPOLIA = 0x332db58b51393f3a6b28d4DD8964234967e1aD33;
    uint256 public constant FORK_DAO_VOTING_PERIOD = 40; // 8 minutes
    uint256 public constant FORK_DAO_VOTING_DELAY = 1;

    constructor()
        DeployDAOV3NewContractsBase(
            NOUNS_DAO_PROXY_SEPOLIA,
            NOUNS_TIMELOCK_V1_SEPOLIA,
            true,
            FORK_DAO_VOTING_PERIOD,
            FORK_DAO_VOTING_DELAY
        )
    {}
}
