// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NounsDescriptorV2

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

import { ISeeder } from './ISeeder.sol';
import { ISVGRenderer } from './ISVGRenderer.sol';
import { IArt } from './IArt.sol';
import { IDescriptorMinimal } from './IDescriptorMinimal.sol';

interface IDescriptorV2 is IDescriptorMinimal {
    event PartsLocked();

    event DataURIToggled(bool enabled);

    event BaseURIUpdated(string baseURI);

    event ArtUpdated(IArt art);

    event RendererUpdated(ISVGRenderer renderer);

    error EmptyPalette();
    error BadPaletteLength();
    error IndexNotFound();

    function arePartsLocked() external returns (bool);

    function isDataURIEnabled() external returns (bool);

    function baseURI() external returns (string memory);

    function palettes(uint8 paletteIndex) external view returns (bytes memory);


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

    function punkTypeCount() external view override returns (uint256);
    function hatCount() external view override returns (uint256);
    function hairCount() external view override returns (uint256);
    function beardCount() external view override returns (uint256);
    function eyesCount() external view override returns (uint256);
    function glassesCount() external view override returns (uint256);
    function gogglesCount() external view override returns (uint256);
    function mouthCount() external view override returns (uint256);
    function teethCount() external view override returns (uint256);
    function lipsCount() external view override returns (uint256);
    function neckCount() external view override returns (uint256);
    function emotionCount() external view override returns (uint256);
    function faceCount() external view override returns (uint256);
    function earsCount() external view override returns (uint256);
    function noseCount() external view override returns (uint256);
    function cheeksCount() external view override returns (uint256);

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

    function lockParts() external;

    function toggleDataURIEnabled() external;

    function setBaseURI(string calldata baseURI) external;

    function tokenURI(uint256 tokenId, ISeeder.Seed memory seed) external view override returns (string memory);

    function dataURI(uint256 tokenId, ISeeder.Seed memory seed) external view override returns (string memory);

    function genericDataURI(
        string calldata name,
        string calldata description,
        ISeeder.Seed memory seed
    ) external view returns (string memory);

    function generateSVGImage(ISeeder.Seed memory seed) external view returns (string memory);
}
