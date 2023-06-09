// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

import { NToken } from '../NToken.sol';
import { IDescriptorMinimal } from '../interfaces/IDescriptorMinimal.sol';
import { ISeeder } from '../interfaces/ISeeder.sol';

contract NTokenHarness is NToken {
    uint256 public currentPunkId;

    constructor(
        address punkerDAO,
        address minter,
        IDescriptorMinimal descriptor,
        ISeeder seeder
    ) NToken(punkerDAO, minter, descriptor, seeder) {}

    function mintTo(address to) public {
        _mintTo(to, currentPunkId++);
    }

    function mintMany(address to, uint256 amount) public {
        for (uint256 i = 0; i < amount; i++) {
            mintTo(to);
        }
    }

    // function mintSeed(
    //     address to,
    //     uint48 background,
    //     uint48 body,
    //     uint48 accessory,
    //     uint48 head,
    //     uint48 glasses
    // ) public {
    //     seeds[currentPunkId] = ISeeder.Seed({
    //         background: background,
    //         body: body,
    //         accessory: accessory,
    //         head: head,
    //         glasses: glasses
    //     });

    //     _mint(owner(), to, currentPunkId++);
    // }
}
