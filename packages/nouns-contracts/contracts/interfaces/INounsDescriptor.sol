// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NounsDescriptor

pragma solidity ^0.8.6;

interface INounsDescriptor {
    struct AttributeRanges {
        uint8[2] volumeCountRange;
        uint8[2] maxVolumeHeightRange;
        uint8[2] waterFeatureCountRange;
        uint8[2] grassFeatureCountRange;
        uint8[2] treeCountRange;
        uint8[2] bushCountRange;
        uint8[2] peopleCountRange;
        uint8[2] timeOfDayRange;
        uint8[2] seasonRange;
        uint8[2] greenRooftopPRange;
        uint256[2] siteEdgeOffsetRange;
        uint256[2] orientationRange;
    }

    event PartsLocked();

    function getAttributeRanges() external view returns (AttributeRanges memory);

    function getVolumeCountRange() external view returns (uint8[2] memory);

    function getMaxVolumeHeightRange() external view returns (uint8[2] memory);

    function getWaterFeatureCountRange() external view returns (uint8[2] memory);

    function getGrassFeatureCountRange() external view returns (uint8[2] memory);

    function getTreeCountRange() external view returns (uint8[2] memory);

    function getBushCountRange() external view returns (uint8[2] memory);

    function getPeopleCountRange() external view returns (uint8[2] memory);

    function getTimeOfDayRange() external view returns (uint8[2] memory);
    
    function getSeasonRange() external view returns (uint8[2] memory);

    function getGreenRooftopPRange() external view returns (uint8[2] memory);

    function getSiteEdgeOffsetRange() external view returns (uint256[2] memory);

    function getOrientationRange() external view returns (uint256[2] memory);

    function arePartsLocked() external view returns (bool);

    function lockParts() external;
}
