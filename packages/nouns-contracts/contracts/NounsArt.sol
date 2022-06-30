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

pragma solidity ^0.8.6;

import { INounsArt } from './interfaces/INounsArt.sol';
import { Inflate } from './libs/Inflate.sol';
import { SSTORE2 } from './libs/SSTORE2.sol';

contract NounsArt is INounsArt {
    // Current Nouns Descriptor address
    address public override descriptor;

    // Pending Nouns Descriptor address
    address public override pendingDescriptor;

    // Noun Backgrounds (Hex Colors)
    string[] public override backgrounds;

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

    constructor(address _descriptor) {
        descriptor = _descriptor;
    }

    /**
     * @notice Set the pending descriptor, which can be confirmed
     * by calling `confirmDescriptor`.
     * @dev This function can only be called by the current descriptor.
     */
    function setDescriptor(address _pendingDescriptor) external override onlyDescriptor {
        pendingDescriptor = _pendingDescriptor;
    }

    /**
     * @notice Confirm the pending descriptor.
     * @dev This function can only be called by the pending descriptor.
     */
    function confirmDescriptor() external override {
        if (msg.sender != pendingDescriptor) {
            revert SenderIsNotPendingDescriptor();
        }

        address oldDescriptor = descriptor;
        descriptor = pendingDescriptor;
        delete pendingDescriptor;

        emit DescriptorUpdated(oldDescriptor, descriptor);
    }

    /**
     * @notice Get the Trait struct for bodies.
     * @return Trait the struct, including a total image count, and an array of storage pages.
     */
    function bodiesTrait() external view override returns (Trait memory) {
        return _bodies;
    }

    /**
     * @notice Get the Trait struct for accessories.
     * @return Trait the struct, including a total image count, and an array of storage pages.
     */
    function accessoriesTrait() external view override returns (Trait memory) {
        return _accessories;
    }

    /**
     * @notice Get the Trait struct for heads.
     * @return Trait the struct, including a total image count, and an array of storage pages.
     */
    function headsTrait() external view override returns (Trait memory) {
        return _heads;
    }

    /**
     * @notice Get the Trait struct for glasses.
     * @return Trait the struct, including a total image count, and an array of storage pages.
     */
    function glassesTrait() external view override returns (Trait memory) {
        return _glasses;
    }

    /**
     * @notice Batch add Noun backgrounds.
     * @dev This function can only be called by the descriptor.
     */
    function addManyBackgrounds(string[] calldata _backgrounds) external override onlyDescriptor {
        for (uint256 i = 0; i < _backgrounds.length; i++) {
            _addBackground(_backgrounds[i]);
        }
    }

    /**
     * @notice Add a Noun background.
     * @dev This function can only be called by the descriptor.
     */
    function addBackground(string calldata _background) external override onlyDescriptor {
        _addBackground(_background);
    }

    /**
     * @notice Update a single color palette. This function can be used to
     * add a new color palette or update an existing palette.
     * @dev This function can only be called by the descriptor.
     */
    function setPalette(uint8 paletteIndex, bytes calldata palette) external override onlyDescriptor {
        if (palette.length == 0) {
            revert EmptyPalette();
        }
        if (palette.length % 3 != 0 || palette.length > 768) {
            revert BadPaletteLength();
        }
        palettesPointers[paletteIndex] = SSTORE2.write(palette);
    }

    /**
     * @notice Add a batch of body images.
     * @param encodedCompressed bytes created by taking a string array of RLE-encoded images, abi encoding it as a bytes array,
     * and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     * @dev This function can only be called by the descriptor.
     */
    function addBodies(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromBytes(_bodies, encodedCompressed, decompressedLength, imageCount);
    }

    /**
     * @notice Add a batch of accessory images.
     * @param encodedCompressed bytes created by taking a string array of RLE-encoded images, abi encoding it as a bytes array,
     * and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     * @dev This function can only be called by the descriptor.
     */
    function addAccessories(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromBytes(_accessories, encodedCompressed, decompressedLength, imageCount);
    }

    /**
     * @notice Add a batch of head images.
     * @param encodedCompressed bytes created by taking a string array of RLE-encoded images, abi encoding it as a bytes array,
     * and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     * @dev This function can only be called by the descriptor.
     */
    function addHeads(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromBytes(_heads, encodedCompressed, decompressedLength, imageCount);
    }

    /**
     * @notice Add a batch of glasses images.
     * @param encodedCompressed bytes created by taking a string array of RLE-encoded images, abi encoding it as a bytes array,
     * and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     * @dev This function can only be called by the descriptor.
     */
    function addGlasses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromBytes(_glasses, encodedCompressed, decompressedLength, imageCount);
    }

    /**
     * @notice Add a batch of body images from an existing storage contract.
     * @param pointer the address of a contract where the image batch was stored using SSTORE2. The data
     * format is expected to be like {encodedCompressed}: bytes created by taking a string array of
     * RLE-encoded images, abi encoding it as a bytes array, and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     * @dev This function can only be called by the descriptor.
     */
    function addBodiesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromPointer(_bodies, pointer, decompressedLength, imageCount);
    }

    /**
     * @notice Add a batch of accessory images from an existing storage contract.
     * @param pointer the address of a contract where the image batch was stored using SSTORE2. The data
     * format is expected to be like {encodedCompressed}: bytes created by taking a string array of
     * RLE-encoded images, abi encoding it as a bytes array, and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     * @dev This function can only be called by the descriptor.
     */
    function addAccessoriesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromPointer(_accessories, pointer, decompressedLength, imageCount);
    }

    /**
     * @notice Add a batch of head images from an existing storage contract.
     * @param pointer the address of a contract where the image batch was stored using SSTORE2. The data
     * format is expected to be like {encodedCompressed}: bytes created by taking a string array of
     * RLE-encoded images, abi encoding it as a bytes array, and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches
     * @dev This function can only be called by the descriptor..
     */
    function addHeadsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromPointer(_heads, pointer, decompressedLength, imageCount);
    }

    /**
     * @notice Add a batch of glasses images from an existing storage contract.
     * @param pointer the address of a contract where the image batch was stored using SSTORE2. The data
     * format is expected to be like {encodedCompressed}: bytes created by taking a string array of
     * RLE-encoded images, abi encoding it as a bytes array, and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     * @dev This function can only be called by the descriptor.
     */
    function addGlassesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addToTraitFromPointer(_glasses, pointer, decompressedLength, imageCount);
    }

    /**
     * @notice Get the number of available Noun `backgrounds`.
     */
    function backgroundsCount() public view override returns (uint256) {
        return backgrounds.length;
    }

    /**
     * @notice Get a head image bytes (RLE-encoded).
     */
    function heads(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(_heads, index);
    }

    /**
     * @notice Get a body image bytes (RLE-encoded).
     */
    function bodies(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(_bodies, index);
    }

    /**
     * @notice Get a accessory image bytes (RLE-encoded).
     */
    function accessories(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(_accessories, index);
    }

    /**
     * @notice Get a glasses image bytes (RLE-encoded).
     */
    function glasses(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(_glasses, index);
    }

    /**
     * @notice Get a color palette bytes.
     */
    function palettes(uint8 paletteIndex) public view override returns (bytes memory) {
        return SSTORE2.read(palettesPointers[paletteIndex]);
    }

    function _addBackground(string calldata _background) internal {
        backgrounds.push(_background);
    }

    function addToTraitFromBytes(
        Trait storage trait,
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) internal {
        if (encodedCompressed.length == 0) {
            revert EmptyBytes();
        }
        address pointer = SSTORE2.write(encodedCompressed);
        addToTraitFromPointer(trait, pointer, decompressedLength, imageCount);
    }

    function addToTraitFromPointer(
        Trait storage trait,
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) internal {
        if (decompressedLength == 0) {
            revert BadDecompressedLength();
        }
        if (imageCount == 0) {
            revert BadImageCount();
        }
        trait.storagePages.push(
            NounArtStoragePage({ pointer: pointer, decompressedLength: decompressedLength, imageCount: imageCount })
        );
        trait.storedImagesCount += imageCount;
    }

    function imageByIndex(INounsArt.Trait storage trait, uint256 index) internal view returns (bytes memory) {
        (INounsArt.NounArtStoragePage storage page, uint256 indexInPage) = getPage(trait.storagePages, index);
        bytes[] memory decompressedImages = decompressAndDecode(page);
        return decompressedImages[indexInPage];
    }

    function getPage(INounsArt.NounArtStoragePage[] storage pages, uint256 index)
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

            if (index < pageFirstImageIndex + page.imageCount) {
                return (page, index - pageFirstImageIndex);
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
