// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NounsSeeder

pragma solidity ^0.8.6;

import { INounsDescriptor } from './INounsDescriptor.sol';

interface INounsSeeder {
    struct Seed {
        uint8 volumeCount;
        uint8 maxVolumeHeight;
        uint8 waterFeatureCount;
        uint8 grassFeatureCount;
        uint8 treeCount;
        uint8 bushCount;
        uint8 peopleCount;
        uint8 timeOfDay;
        uint8 season;
        uint8 greenRooftopP;
        uint256 siteEdgeOffset;
        uint256 orientation;
    }

    function generateSeed(uint256 nounId, INounsDescriptor descriptor) external view returns (Seed memory);
}
