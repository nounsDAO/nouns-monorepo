// SPDX-License-Identifier: GPL-3.0

/// @title The Nouns NFT descriptor

pragma solidity ^0.8.6;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { INounsDescriptor } from './interfaces/INounsDescriptor.sol';
import { INounsSeeder } from './interfaces/INounsSeeder.sol';

contract NounsDescriptor is INounsDescriptor, Ownable {
    // prettier-ignore
    // https://creativecommons.org/publicdomain/zero/1.0/legalcode.txt
    bytes32 constant COPYRIGHT_CC0_1_0_UNIVERSAL_LICENSE = 0xa2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499;

    // Whether or not new Nouns parts can be added
    bool public override arePartsLocked;

    INounsDescriptor.AttributeRanges private attributeRanges =
        INounsDescriptor.AttributeRanges({
            volumeCountRange: [2, 40],
            maxVolumeHeightRange: [5, 8],
            waterFeatureCountRange: [5, 10],
            grassFeatureCountRange: [5, 10],
            treeCountRange: [2, 20],
            bushCountRange: [0, 100],
            peopleCountRange: [5, 20],
            timeOfDayRange: [0,2],
            seasonRange:[0,3],
            greenRooftopPRange: [0, 255],
            siteEdgeOffsetRange: [uint256(.1 * 1e10), uint256(.3 * 1e10)],
            orientationRange: [uint256(0 * 1e10), uint256(10 * 1e10)]
        });

    /**
     * @notice Require that the parts have not been locked.
     */
    modifier whenPartsNotLocked() {
        require(!arePartsLocked, 'Parts are locked');
        _;
    }

    /**
     * @dev Public getter for all attributes
     */
    function getAttributeRanges() external view override returns (INounsDescriptor.AttributeRanges memory) {
        return attributeRanges;
    }

    /**
     * @dev Public getter for volumeCountRange
     */
    function getVolumeCountRange() external view override returns (uint8[2] memory) {
        return attributeRanges.volumeCountRange;
    }

    /**
     * @dev Public getter for maxVolumeHeightRange
     */
    function getMaxVolumeHeightRange() external view override returns (uint8[2] memory) {
        return attributeRanges.maxVolumeHeightRange;
    }

    /**
     * @dev Public getter for waterFeatureCountRange
     */
    function getWaterFeatureCountRange() external view override returns (uint8[2] memory) {
        return attributeRanges.waterFeatureCountRange;
    }

    /**
     * @dev Public getter grassFeatureCountRange
     */
    function getGrassFeatureCountRange() external view override returns (uint8[2] memory) {
        return attributeRanges.grassFeatureCountRange;
    }

    /**
     * @dev Public getter for treesCountRange
     */
    function getTreeCountRange() external view override returns (uint8[2] memory) {
        return attributeRanges.treeCountRange;
    }

    /**
     * @dev Public getter for bushCountRange
     */
    function getBushCountRange() external view override returns (uint8[2] memory) {
        return attributeRanges.bushCountRange;
    }

    /**
     * @dev Public getter for peopleCountRange
     */
    function getPeopleCountRange() external view override returns (uint8[2] memory) {
        return attributeRanges.peopleCountRange;
    }

    /**
     * @dev Public getter for time of day range
     */
    function getTimeOfDayRange() external view override returns (uint8[2] memory) {
        return attributeRanges.timeOfDayRange;
    }
    /**
     * @dev Public getter for season range
     */
    function getSeasonRange() external view override returns (uint8[2] memory) {
        return attributeRanges.seasonRange;
    }

    /**
     * @dev Public getter for greenRooftopPRange
     */
    function getGreenRooftopPRange() external view override returns (uint8[2] memory) {
        return attributeRanges.greenRooftopPRange;
    }

    /**
     * @dev Public getter for site edge offset range
     */
    function getSiteEdgeOffsetRange() external view override returns (uint256[2] memory) {
        return attributeRanges.siteEdgeOffsetRange;
    }

    /**
     * @dev Public getter for orientation range
     */
    function getOrientationRange() external view override returns (uint256[2] memory) {
        return attributeRanges.orientationRange;
    }

    /**
     * @notice Lock all Nouns parts.
     * @dev This cannot be reversed and can only be called by the owner when not locked.
     */
    function lockParts() external override onlyOwner whenPartsNotLocked {
        arePartsLocked = true;

        emit PartsLocked();
    }

    // TODO: add update ranges fns
}
