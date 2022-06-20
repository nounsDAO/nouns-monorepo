// SPDX-License-Identifier: GPL-3.0

/// @title The Nouns art storage contract

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

pragma solidity ^0.8.12;

import { INounsArt } from './interfaces/INounsArt.sol';
import { Inflate } from './libs/Inflate.sol';
import { SSTORE2 } from './libs/SSTORE2.sol';

contract NounsArt is INounsArt {
    // Current Nouns Descriptor address
    address public descriptor;

    // Pending Nouns Descriptor address
    address public pendingDescriptor;

    // Noun Backgrounds (Hex Colors)
    string[] public backgrounds;

    // Noun Color Palettes (Index => Hex Colors)
    mapping(uint8 => address) public palettesPointers;

    // Noun Bodies (Custom RLE)
    Trait public _bodies;

    // Noun Accessories (Custom RLE)
    Trait public _accessories;

    // Noun Heads (Custom RLE)
    Trait public _heads;

    // Noun Glasses (Custom RLE)
    Trait public _glasses;

    /**
     * @notice Require that the sender is the descriptor.
     */
    modifier onlyDescriptor() {
        if (msg.sender != descriptor) {
            revert SenderIsNotDescriptor();
        }
        _;
    }

    /**
     * @notice Set the pending descriptor, which can be confirmed
     * by calling `confirmDescriptor`.
     * @dev This function can only be called by the current descriptor.
     */
    function setDescriptor(address _pendingDescriptor) external onlyDescriptor {
        pendingDescriptor = _pendingDescriptor;
    }

    /**
     * @notice Confirm the pending descriptor.
     * @dev This function can only be called by the pending descriptor.
     */
    function confirmDescriptor() external {
        if (msg.sender != pendingDescriptor) {
            revert SenderIsNotPendingDescriptor();
        }

        address oldDescriptor = descriptor;
        descriptor = pendingDescriptor;
        delete pendingDescriptor;

        emit DescriptorUpdated(oldDescriptor, descriptor);
    }

    function bodiesTrait() external view returns (Trait memory) {
        return _bodies;
    }

    function accessoriesTrait() external view returns (Trait memory) {
        return _accessories;
    }

    function headsTrait() external view returns (Trait memory) {
        return _heads;
    }

    function glassesTrait() external view returns (Trait memory) {
        return _glasses;
    }

    function addManyBackgrounds(string[] calldata _backgrounds) external override onlyDescriptor {
        for (uint256 i = 0; i < _backgrounds.length; i++) {
            _addBackground(_backgrounds[i]);
        }
    }

    function addBackground(string calldata _background) external override onlyDescriptor {
        _addBackground(_background);
    }

    function _addBackground(string calldata _background) internal {
        backgrounds.push(_background);
    }

    function setPalette(uint8 paletteIndex, bytes calldata palette) external override onlyDescriptor {
        if (palette.length == 0) {
            revert EmptyPalette();
        }
        if (palette.length % 3 != 0 || palette.length > 768) {
            revert BadPaletteLength();
        }
        palettesPointers[paletteIndex] = SSTORE2.write(palette);
    }

    function addBodies(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromBytes(_bodies, encodedCompressed, decompressedLength, imageCount);
    }

    function addAccessories(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromBytes(_accessories, encodedCompressed, decompressedLength, imageCount);
    }

    function addHeads(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromBytes(_heads, encodedCompressed, decompressedLength, imageCount);
    }

    function addGlasses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromBytes(_glasses, encodedCompressed, decompressedLength, imageCount);
    }

    function addBodiesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromPointer(_bodies, pointer, decompressedLength, imageCount);
    }

    function addAccessoriesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromPointer(_accessories, pointer, decompressedLength, imageCount);
    }

    function addHeadsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromPointer(_heads, pointer, decompressedLength, imageCount);
    }

    function addGlassesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromPointer(_glasses, pointer, decompressedLength, imageCount);
    }

    function backgroundsCount() public view override returns (uint256) {
        return backgrounds.length;
    }

    function headsPageCount() public view override returns (uint256) {
        return _heads.storagePages.length;
    }

    function bodiesPageCount() public view override returns (uint256) {
        return _bodies.storagePages.length;
    }

    function accessoriesPageCount() public view override returns (uint256) {
        return _accessories.storagePages.length;
    }

    function glassesPageCount() public view override returns (uint256) {
        return _glasses.storagePages.length;
    }

    function headsPage(uint256 pageIndex) public view override returns (INounsArt.NounArtStoragePage memory) {
        return _heads.storagePages[pageIndex];
    }

    function bodiesPage(uint256 pageIndex) public view override returns (INounsArt.NounArtStoragePage memory) {
        return _bodies.storagePages[pageIndex];
    }

    function accessoriesPage(uint256 pageIndex) public view override returns (INounsArt.NounArtStoragePage memory) {
        return _accessories.storagePages[pageIndex];
    }

    function glassesPage(uint256 pageIndex) public view override returns (INounsArt.NounArtStoragePage memory) {
        return _glasses.storagePages[pageIndex];
    }

    function heads(uint256 storageIndex) public view override returns (bytes memory) {
        return imageByStorageIndex(_heads, storageIndex);
    }

    function bodies(uint256 storageIndex) public view override returns (bytes memory) {
        return imageByStorageIndex(_bodies, storageIndex);
    }

    function accessories(uint256 storageIndex) public view override returns (bytes memory) {
        return imageByStorageIndex(_accessories, storageIndex);
    }

    function glasses(uint256 storageIndex) public view override returns (bytes memory) {
        return imageByStorageIndex(_glasses, storageIndex);
    }

    function palettes(uint8 paletteIndex) public view override returns (bytes memory) {
        return SSTORE2.read(palettesPointers[paletteIndex]);
    }

    function addToTraitFromBytes(
        Trait storage trait,
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) internal {
        address pointer = SSTORE2.write(encodedCompressed);
        addToTraitFromPointer(trait, pointer, decompressedLength, imageCount);
    }

    function addToTraitFromPointer(
        Trait storage trait,
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) internal {
        trait.storagePages.push(
            NounArtStoragePage({ pointer: pointer, decompressedLength: decompressedLength, imageCount: imageCount })
        );
        trait.storedImagesCount += imageCount;
    }

    function imageByStorageIndex(INounsArt.Trait storage trait, uint256 storageIndex)
        internal
        view
        returns (bytes memory)
    {
        (INounsArt.NounArtStoragePage storage page, uint256 indexInPage) = getPage(trait.storagePages, storageIndex);
        bytes[] memory decompressedImages = decompressAndDecode(page);
        return decompressedImages[indexInPage];
    }

    function getPage(INounsArt.NounArtStoragePage[] storage pages, uint256 storageIndex)
        internal
        view
        returns (INounsArt.NounArtStoragePage storage, uint256)
    {
        uint256 len = pages.length;
        if (len == 0) {
            revert NoPages();
        }

        uint256 pageFirstImageIndex = 0;
        for (uint256 i = 0; i < len; i++) {
            INounsArt.NounArtStoragePage storage page = pages[i];

            if (storageIndex < pageFirstImageIndex + page.imageCount) {
                return (page, storageIndex - pageFirstImageIndex);
            }

            pageFirstImageIndex += page.imageCount;
        }

        revert ImageNotFound();
    }

    function decompressAndDecode(INounsArt.NounArtStoragePage storage page) internal view returns (bytes[] memory) {
        bytes memory compressedData = SSTORE2.read(page.pointer);
        (, bytes memory decompressedData) = Inflate.puff(compressedData, page.decompressedLength);
        return abi.decode(decompressedData, (bytes[]));
    }
}
