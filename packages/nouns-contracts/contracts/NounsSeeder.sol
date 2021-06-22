// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.5;

import { INounsSeeder } from './interfaces/INounsSeeder.sol';
import { INounsDescriptor } from './interfaces/INounsDescriptor.sol';

contract NounsSeeder is INounsSeeder {
    /**
     * @notice Generate a pseudo-random Noun seed using the previous blockhash.
     */
    function generateSeed(INounsDescriptor descriptor) external view override returns (uint256[4] memory) {
        uint256 bhash = uint256(blockhash(block.number - 1));

        uint64[4] memory pseudorandomness = [
            uint64(bhash),
            uint64(bhash >> 64),
            uint64(bhash >> 128),
            uint64(bhash >> 192)
        ];

        uint256 bodyCount = descriptor.bodyCount();
        uint256 accessoryCount = descriptor.accessoryCount();
        uint256 headCount = descriptor.headCount();
        uint256 glassesCount = descriptor.glassesCount();

        return [
            pseudorandomness[0] % bodyCount,
            pseudorandomness[1] % accessoryCount,
            pseudorandomness[2] % headCount,
            pseudorandomness[3] % glassesCount
        ];
    }
}
