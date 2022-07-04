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

interface INounsArt {
    error SenderIsNotDescriptor();

    error SenderIsNotPendingDescriptor();

    error EmptyPalette();

    error BadPaletteLength();

    error EmptyBytes();

    error BadDecompressedLength();

    error BadImageCount();

    error ImageNotFound();

    error PaletteNotFound();

    event DescriptorUpdated(address oldDescriptor, address newDescriptor);

    struct NounArtStoragePage {
        uint16 imageCount;
        uint80 decompressedLength;
        address pointer;
    }

    struct Trait {
        NounArtStoragePage[] storagePages;
        uint256 storedImagesCount;
    }

    function descriptor() external view returns (address);

    function pendingDescriptor() external view returns (address);

    function setDescriptor(address pendingDescriptor) external;

    function confirmDescriptor() external;

    function addManyBackgrounds(string[] calldata _backgrounds) external;

    function addBackground(string calldata _background) external;

    function palettes(uint8 paletteIndex) external view returns (bytes memory);

    function setPalette(uint8 paletteIndex, bytes calldata palette) external;

    function addBodies(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function addAccessories(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function addHeads(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function addGlasses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function addBodiesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function addAccessoriesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function addHeadsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function addGlassesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external;

    function backgroundsCount() external view returns (uint256);

    function backgrounds(uint256 index) external view returns (string memory);

    function heads(uint256 index) external view returns (bytes memory);

    function bodies(uint256 index) external view returns (bytes memory);

    function accessories(uint256 index) external view returns (bytes memory);

    function glasses(uint256 index) external view returns (bytes memory);

    function getBodiesTrait() external view returns (Trait memory);

    function getAccessoriesTrait() external view returns (Trait memory);

    function getHeadsTrait() external view returns (Trait memory);

    function getGlassesTrait() external view returns (Trait memory);
}
