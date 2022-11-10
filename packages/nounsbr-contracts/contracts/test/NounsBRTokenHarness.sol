// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

import { NounsBRToken } from '../NounsBRToken.sol';
import { INounsBRDescriptorMinimal } from '../interfaces/INounsBRDescriptorMinimal.sol';
import { INounsBRSeeder } from '../interfaces/INounsBRSeeder.sol';
import { IProxyRegistry } from '../external/opensea/IProxyRegistry.sol';

contract NounsBRTokenHarness is NounsBRToken {
    uint256 public currentNounBRId;

    constructor(
        address noundersbrDAO,
        address minter,
        INounsBRDescriptorMinimal descriptor,
        INounsBRSeeder seeder,
        IProxyRegistry proxyRegistry
    ) NounsBRToken(noundersbrDAO, minter, descriptor, seeder, proxyRegistry) {}

    function mintTo(address to) public {
        _mintTo(to, currentNounBRId++);
    }

    function mintMany(address to, uint256 amount) public {
        for (uint256 i = 0; i < amount; i++) {
            mintTo(to);
        }
    }

    function mintSeed(
        address to,
        uint48 background,
        uint48 body,
        uint48 accessory,
        uint48 head,
        uint48 glasses
    ) public {
        seeds[currentNounBRId] = INounsBRSeeder.Seed({
            background: background,
            body: body,
            accessory: accessory,
            head: head,
            glasses: glasses
        });

        _mint(owner(), to, currentNounBRId++);
    }
}
