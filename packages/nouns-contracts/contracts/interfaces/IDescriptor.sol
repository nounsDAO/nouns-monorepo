// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NounsDescriptor

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
import { IDescriptorMinimal } from './IDescriptorMinimal.sol';

interface IDescriptor is IDescriptorMinimal {
    event PartsLocked();

    event DataURIToggled(bool enabled);

    event BaseURIUpdated(string baseURI);

    function arePartsLocked() external returns (bool);

    function isDataURIEnabled() external returns (bool);

    function baseURI() external returns (string memory);

    function palettes(uint8 paletteIndex, uint256 colorIndex) external view returns (string memory);


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


    function addManyColorsToPalette(uint8 paletteIndex, string[] calldata newColors) external;


    function addManyPunkTypes(bytes[] calldata punkTypes) external;
    function addManyHats(bytes[] calldata hats) external;
    function addManyHairs(bytes[] calldata hairs) external;
    function addManyBeards(bytes[] calldata beards) external;
    function addManyEyeses(bytes[] calldata eyeses) external;
    function addManyGlasseses(bytes[] calldata glasseses) external;
    function addManyGoggleses(bytes[] calldata goggleses) external;
    function addManyMouths(bytes[] calldata mouths) external;
    function addManyTeeths(bytes[] calldata teeths) external;
    function addManyLipses(bytes[] calldata lipses) external;
    function addManyNecks(bytes[] calldata necks) external;
    function addManyEmotions(bytes[] calldata emotions) external;
    function addManyFaces(bytes[] calldata faces) external;
    function addManyEarses(bytes[] calldata earses) external;
    function addManyNoses(bytes[] calldata noses) external;
    function addManyCheekses(bytes[] calldata cheekses) external;


    function addColorToPalette(uint8 paletteIndex, string calldata color) external;


    function addPunkType(bytes calldata punkType) external;
    function addHat(bytes calldata hat) external;
    function addHair(bytes calldata hair) external;
    function addBeard(bytes calldata beard) external;
    function addEyes(bytes calldata eyes) external;
    function addGlasses(bytes calldata glasses) external;
    function addGoggles(bytes calldata goggleses) external;
    function addMouth(bytes calldata mouth) external;
    function addTeeth(bytes calldata teeth) external;
    function addLips(bytes calldata lips) external;
    function addNeck(bytes calldata neck) external;
    function addEmotion(bytes calldata emotion) external;
    function addFace(bytes calldata face) external;
    function addEars(bytes calldata ears) external;
    function addNose(bytes calldata nose) external;
    function addCheeks(bytes calldata cheeks) external;


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
