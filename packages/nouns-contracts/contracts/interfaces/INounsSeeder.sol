// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.5;

import { INounsDescriptor } from './INounsDescriptor.sol';

/**
 * @title Interface for NounsSeeder.
 */
interface INounsSeeder {
    function generateSeed(INounsDescriptor descriptor) external view returns (uint256[4] memory);
}
