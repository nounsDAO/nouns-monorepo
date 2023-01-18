// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

import { N00unsToken } from '../N00unsToken.sol';
import { IN00unsDescriptorMinimal } from '../interfaces/IN00unsDescriptorMinimal.sol';
import { IN00unsSeeder } from '../interfaces/IN00unsSeeder.sol';
import { IProxyRegistry } from '../external/opensea/IProxyRegistry.sol';

contract N00unsTokenHarness is N00unsToken {
    uint256 public currentN00unId;

    constructor(
        address n00undersDAO,
        address minter,
        IN00unsDescriptorMinimal descriptor,
        IN00unsSeeder seeder,
        IProxyRegistry proxyRegistry
    ) N00unsToken(n00undersDAO, minter, descriptor, seeder, proxyRegistry) {}

    function mintTo(address to) public {
        _mintTo(to, currentN00unId++);
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
        seeds[currentN00unId] = IN00unsSeeder.Seed({
            background: background,
            body: body,
            accessory: accessory,
            head: head,
            glasses: glasses
        });

        _mint(owner(), to, currentN00unId++);
    }
}
