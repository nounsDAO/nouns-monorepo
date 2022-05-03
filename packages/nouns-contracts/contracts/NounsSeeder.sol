// SPDX-License-Identifier: GPL-3.0

/// @title The NounsToken pseudo-random seed generator

pragma solidity ^0.8.6;

import 'hardhat/console.sol';
import { INounsSeeder } from './interfaces/INounsSeeder.sol';
import { INounsDescriptor } from './interfaces/INounsDescriptor.sol';

contract NounsSeeder is INounsSeeder {
    /**
     * @notice Generate a pseudo-random Nouns seed using the previous blockhash and nouns ID.
     */
    function generateSeed(uint256 nounId, INounsDescriptor descriptor) external view override returns (Seed memory) {
        uint256 pr = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), nounId)));

        INounsDescriptor.AttributeRanges memory ranges = descriptor.getAttributeRanges();
        INounsSeeder.Seed memory seed;

        seed.volumeCount = randomUint8InRange(pr >> (16 * 0), ranges.volumeCountRange[0], ranges.volumeCountRange[1]);

        seed.maxVolumeHeight = randomUint8InRange(
            pr >> (16 * 1),
            ranges.maxVolumeHeightRange[0],
            ranges.maxVolumeHeightRange[1]
        );

        seed.waterFeatureCount = randomUint8InRange(
            pr >> (16 * 2),
            ranges.waterFeatureCountRange[0],
            ranges.waterFeatureCountRange[1]
        );

        seed.grassFeatureCount = randomUint8InRange(
            pr >> (16 * 3),
            ranges.grassFeatureCountRange[0],
            ranges.grassFeatureCountRange[1]
        );

        seed.treeCount = randomUint8InRange(pr >> (16 * 4), ranges.treeCountRange[0], ranges.treeCountRange[1]);

        seed.bushCount = randomUint8InRange(pr >> (16 * 5), ranges.bushCountRange[0], ranges.bushCountRange[1]);

        seed.peopleCount = randomUint8InRange(pr >> (16 * 6), ranges.peopleCountRange[0], ranges.peopleCountRange[1]);

        seed.timeOfDay = randomUint8InRange(pr >> (16 * 7), ranges.timeOfDayRange[0], ranges.timeOfDayRange[1]);

        seed.season = randomUint8InRange(pr >> (16 * 8), ranges.seasonRange[0], ranges.seasonRange[1]);

        seed.greenRooftopP = randomUint8InRange(
            pr >> (16 * 9),
            ranges.greenRooftopPRange[0],
            ranges.greenRooftopPRange[0]
        );

        seed.siteEdgeOffset = randomUint256InRange(
            pr >> (16 * 10),
            ranges.siteEdgeOffsetRange[0],
            ranges.siteEdgeOffsetRange[1]
        );

        seed.orientation = randomUint256InRange(pr >> (16 * 11), ranges.orientationRange[0], ranges.orientationRange[1]);

        return seed;
    }

    function randomUint8InRange(
        uint256 randomValue,
        uint8 min,
        uint8 max
    ) internal pure returns (uint8 value) {
        return uint8(randomUint256InRange(randomValue, min, max));
    }

    function randomUint256InRange(
        uint256 randomValue,
        uint256 min,
        uint256 max
    ) internal pure returns (uint256 value) {
        return (randomValue % (max - min + 1)) + min;
    }
}
