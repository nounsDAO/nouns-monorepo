// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.6;

import { INounsDescriptor } from './INounsDescriptor.sol';

/**
 * @title Interface for NounsSeeder.
 */
interface INounsSeeder {
    struct Seed {
        uint48 background;
        uint48 body;
        uint48 accessory;
        uint48 head;
        uint48 glasses;
    }

    function generateSeed(uint256 nounId, INounsDescriptor descriptor) external view returns (Seed memory);
}
