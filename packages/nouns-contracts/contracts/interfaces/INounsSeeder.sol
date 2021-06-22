// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.5;

import { INounsDescriptor } from './INounsDescriptor.sol';

/**
 * @title Interface for NounsSeeder.
 */
interface INounsSeeder {
    struct Seed {
        uint64 body;
        uint64 accessory;
        uint64 head;
        uint64 glasses;
    }

    function generateSeed(uint256 nounId, INounsDescriptor descriptor) external view returns (Seed memory);
}
