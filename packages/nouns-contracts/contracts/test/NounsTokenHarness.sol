// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

import { NounsToken } from '../NounsToken.sol';
import { INounsDescriptorMinimal } from '../interfaces/INounsDescriptorMinimal.sol';
import { INounsSeeder } from '../interfaces/INounsSeeder.sol';
import { IProxyRegistry } from '../external/opensea/IProxyRegistry.sol';

contract NounsTokenHarness is NounsToken {
    uint256 public currentNounId;

    constructor(
        address noundersDAO,
        address minter,
        INounsDescriptorMinimal descriptor,
        INounsSeeder seeder,
        IProxyRegistry proxyRegistry
    ) NounsToken(noundersDAO, minter, descriptor, seeder, proxyRegistry) {}

    function mintTo(address to) public {
        _mintTo(to, currentNounId++);
    }
}
