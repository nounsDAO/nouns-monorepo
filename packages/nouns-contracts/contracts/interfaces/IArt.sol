// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NounsArt

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░██░░░████░░██░░░████░░░ *
 * ░░██████░░░████████░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 *********************************/

pragma solidity ^0.8.6;

import { Inflate } from '../libs/Inflate.sol';
import { IInflator } from './IInflator.sol';

interface IArt {
    error SenderIsNotDescriptor();

    error EmptyPalette();

    error BadPaletteLength();

    error EmptyBytes();

    error BadDecompressedLength();

    error BadImageCount();

    error ImageNotFound();

    error PaletteNotFound();

    event DescriptorUpdated(address oldDescriptor, address newDescriptor);

    event InflatorUpdated(address oldInflator, address newInflator);

    event PaletteSet(uint8 paletteIndex);

    event PunkTypesAdded(uint16 count);
    event HatsAdded(uint16 count);
    event HairsAdded(uint16 count);
    event BeardsAdded(uint16 count);
    event EyesesAdded(uint16 count);
    event GlassesesAdded(uint16 count);
    event GogglesesAdded(uint16 count);
    event MouthsAdded(uint16 count);
    event TeethsAdded(uint16 count);
    event LipsesAdded(uint16 count);
    event NecksAdded(uint16 count);
    event EmotionsAdded(uint16 count);
    event FacesAdded(uint16 count);
    event EarsesAdded(uint16 count);
    event NosesAdded(uint16 count);
    event CheeksesAdded(uint16 count);

    struct NArtStoragePage {
        uint16 imageCount;
        uint80 decompressedLength;
        address pointer;
    }

    struct Trait {
        NArtStoragePage[] storagePages;
        uint256 storedImagesCount;
    }

    function descriptor() external view returns (address);

    function inflator() external view returns (IInflator);

    function setDescriptor(address descriptor) external;

    function setInflator(IInflator inflator) external;

    function palettes(uint8 paletteIndex) external view returns (bytes memory);

    function setPalette(uint8 paletteIndex, bytes calldata palette) external;

    function addPunkTypes(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addHats(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addHairs(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addBeards(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addEyeses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addGlasseses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addGoggleses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addMouths(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addTeeths(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addLipses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addNecks(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addEmotions(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addFaces(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addEarses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addNoses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addCheekses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function setPalettePointer(uint8 paletteIndex, address pointer) external;

    function addPunkTypesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addHatsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addHairsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addBeardsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addEyesesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addGlassesesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addGogglesesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addMouthsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addTeethsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addLipsesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addNecksFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addEmotionsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addFacesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addEarsesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addNosesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;
    function addCheeksesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;


    function punkTypes(uint256 index) external view returns (bytes memory);
    function hats(uint256 index) external view returns (bytes memory);
    function hairs(uint256 index) external view returns (bytes memory);
    function beards(uint256 index) external view returns (bytes memory);
    function eyeses(uint256 index) external view returns (bytes memory);
    function glasseses(uint256 index) external view returns (bytes memory);
    function goggleses(uint256 index) external view returns (bytes memory);
    function mouths(uint256 index) external view returns (bytes memory);
    function teeths(uint256 index) external view returns (bytes memory);
    function lipses(uint256 index) external view returns (bytes memory);
    function necks(uint256 index) external view returns (bytes memory);
    function emotions(uint256 index) external view returns (bytes memory);
    function faces(uint256 index) external view returns (bytes memory);
    function earses(uint256 index) external view returns (bytes memory);
    function noses(uint256 index) external view returns (bytes memory);
    function cheekses(uint256 index) external view returns (bytes memory);

    function getPunkTypesTrait() external view returns (Trait memory);
    function getHatsTrait() external view returns (Trait memory);
    function getHairsTrait() external view returns (Trait memory);
    function getBeardsTrait() external view returns (Trait memory);
    function getEyesesTrait() external view returns (Trait memory);
    function getGlassesesTrait() external view returns (Trait memory);
    function getGogglesesTrait() external view returns (Trait memory);
    function getMouthsTrait() external view returns (Trait memory);
    function getTeethsTrait() external view returns (Trait memory);
    function getLipsesTrait() external view returns (Trait memory);
    function getNecksTrait() external view returns (Trait memory);
    function getEmotionsTrait() external view returns (Trait memory);
    function getFacesTrait() external view returns (Trait memory);
    function getEarsesTrait() external view returns (Trait memory);
    function getNosesTrait() external view returns (Trait memory);
    function getCheeksesTrait() external view returns (Trait memory);
}
