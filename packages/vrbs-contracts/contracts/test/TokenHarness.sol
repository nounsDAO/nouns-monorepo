// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

import { VrbsToken } from '../VrbsToken.sol';
import { IDescriptorMinimal } from '../interfaces/IDescriptorMinimal.sol';
import { ISeeder } from '../interfaces/ISeeder.sol';
import { IProxyRegistry } from '../external/opensea/IProxyRegistry.sol';

contract VrbsTokenHarness is VrbsToken {
    uint256 public currentVrbId;

    constructor(
        address vrbsDAO,
        address minter,
        IDescriptorMinimal descriptor,
        ISeeder seeder,
        IProxyRegistry proxyRegistry
    ) VrbsToken(vrbsDAO, minter, descriptor, seeder, proxyRegistry) {}

    function mintTo(address to) public {
        _mintTo(to, currentVrbId++);
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
        seeds[currentVrbId] = ISeeder.Seed({
            background: background,
            body: body,
            accessory: accessory,
            head: head,
            glasses: glasses,
            imgData: new bytes(32)
        });

        _mint(owner(), to, currentVrbId++);
    }
}
