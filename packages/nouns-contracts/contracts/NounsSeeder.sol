// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.5;

import { INounsSeeder } from './interfaces/INounsSeeder.sol';
import { INounsDescriptor } from './interfaces/INounsDescriptor.sol';

contract NounsSeeder is INounsSeeder {
    /**
     * @notice Generate a pseudo-random Noun seed using the previous blockhash and noun ID.
     */
    // prettier-ignore
    function generateSeed(uint256 nounId, INounsDescriptor descriptor) external view override returns (Seed memory) {
        uint256 pseudorandomness = uint256(
            keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))
        );

        uint256 bodyCount = descriptor.bodyCount();
        uint256 accessoryCount = descriptor.accessoryCount();
        uint256 headCount = descriptor.headCount();
        uint256 glassesCount = descriptor.glassesCount();

        return Seed({
            body: uint64(
                uint64(pseudorandomness) % bodyCount
            ),
            accessory: uint64(
                uint64(pseudorandomness >> 64) % accessoryCount
            ),
            head: uint64(
                uint64(pseudorandomness >> 128) % headCount
            ),
            glasses: uint64(
                uint64(pseudorandomness >> 192) % glassesCount
            )
        });
    }
}
