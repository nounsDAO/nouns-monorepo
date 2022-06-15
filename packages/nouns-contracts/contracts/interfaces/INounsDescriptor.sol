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

import { INounsSeeder } from './INounsSeeder.sol';
import { ISVGRenderer } from './ISVGRenderer.sol';

interface INounsDescriptor {
    event PartsLocked();

    event DataURIToggled(bool enabled);

    event BaseURIUpdated(string baseURI);

    event RendererUpdated(ISVGRenderer renderer);

    error EmptyPalette();
    error BadPaletteLength();
    error NoPages();
    error ImageNotFound();

    struct NounArtStoragePage {
        uint16 imageCount;
        uint80 decompressedLength;
        address pointer;
    }

    struct Trait {
        NounArtStoragePage[] storagePages;
        uint256[] virtualIndexToStorageIndex;
        uint256 storedImagesCount;
    }

    function arePartsLocked() external returns (bool);

    function isDataURIEnabled() external returns (bool);

    function baseURI() external returns (string memory);

    function palettes(uint8 paletteIndex) external view returns (address);

    function backgrounds(uint256 index) external view returns (string memory);

    function bodies(uint256 index) external view returns (bytes memory);

    function accessories(uint256 index) external view returns (bytes memory);

    function heads(uint256 index) external view returns (bytes memory);

    function glasses(uint256 index) external view returns (bytes memory);

    function backgroundCount() external view returns (uint256);

    function bodyCount() external view returns (uint256);

    function accessoryCount() external view returns (uint256);

    function headCount() external view returns (uint256);

    function glassesCount() external view returns (uint256);

    function headsPageCount() external view returns (uint256);

    function bodiesPageCount() external view returns (uint256);

    function accessoriesPageCount() external view returns (uint256);

    function glassesPageCount() external view returns (uint256);

    function headsPage(uint256 pageIndex) external view returns (NounArtStoragePage memory);

    function bodiesPage(uint256 pageIndex) external view returns (NounArtStoragePage memory);

    function accessoriesPage(uint256 pageIndex) external view returns (NounArtStoragePage memory);

    function glassesPage(uint256 pageIndex) external view returns (NounArtStoragePage memory);

    function addManyBackgrounds(string[] calldata backgrounds) external;

    function addBackground(string calldata background) external;

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

    function retireBackground(uint256 virtualIndex) external;

    function retireBody(uint256 virtualIndex) external;

    function retireAccessory(uint256 virtualIndex) external;

    function retireHead(uint256 virtualIndex) external;

    function retireGlasses(uint256 virtualIndex) external;

    function backgroundStorageIndex(uint256 virtualIndex) external view returns (uint256);

    function bodyStorageIndex(uint256 virtualIndex) external view returns (uint256);

    function accessoryStorageIndex(uint256 virtualIndex) external view returns (uint256);

    function headStorageIndex(uint256 virtualIndex) external view returns (uint256);

    function glassesStorageIndex(uint256 virtualIndex) external view returns (uint256);

    function lockParts() external;

    function toggleDataURIEnabled() external;

    function setBaseURI(string calldata baseURI) external;

    function tokenURI(uint256 tokenId, INounsSeeder.Seed memory seed) external view returns (string memory);

    function dataURI(uint256 tokenId, INounsSeeder.Seed memory seed) external view returns (string memory);

    function genericDataURI(
        string calldata name,
        string calldata description,
        INounsSeeder.Seed memory seed
    ) external view returns (string memory);

    function generateSVGImage(INounsSeeder.Seed memory seed) external view returns (string memory);
}
