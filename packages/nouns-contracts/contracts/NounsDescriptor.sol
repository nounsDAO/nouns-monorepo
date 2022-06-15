// SPDX-License-Identifier: GPL-3.0

/// @title The Nouns NFT descriptor

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

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { INounsDescriptor } from './interfaces/INounsDescriptor.sol';
import { INounsSeeder } from './interfaces/INounsSeeder.sol';
import { NFTDescriptor } from './libs/NFTDescriptor.sol';
import { ISVGRenderer } from './interfaces/ISVGRenderer.sol';
import { SSTORE2 } from './libs/SSTORE2.sol';
import { Inflate } from './libs/Inflate.sol';
import { MultiPartRLEToSVG } from './libs/MultiPartRLEToSVG.sol';

contract NounsDescriptor is INounsDescriptor, Ownable {
    using Strings for uint256;

    // prettier-ignore
    // https://creativecommons.org/publicdomain/zero/1.0/legalcode.txt
    bytes32 constant COPYRIGHT_CC0_1_0_UNIVERSAL_LICENSE = 0xa2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499;

    // The contract responsible for constructing SVGs
    ISVGRenderer public renderer;

    // Whether or not new Noun parts can be added
    bool public override arePartsLocked;

    // Whether or not `tokenURI` should be returned as a data URI (Default: true)
    bool public override isDataURIEnabled = true;

    // Base URI
    string public override baseURI;

    // Noun Color Palettes (Index => Hex Colors)
    mapping(uint8 => address) public override palettes;

    // Noun Backgrounds (Hex Colors)
    string[] public override backgrounds;

    // Noun Bodies (Custom RLE)
    Trait private _bodies;

    // Noun Accessories (Custom RLE)
    Trait private _accessories;

    // Noun Heads (Custom RLE)
    Trait private _heads;

    // Noun Glasses (Custom RLE)
    Trait private _glasses;

    /**
     * @notice Require that the parts have not been locked.
     */
    modifier whenPartsNotLocked() {
        require(!arePartsLocked, 'Parts are locked');
        _;
    }

    constructor(ISVGRenderer _renderer) {
        renderer = _renderer;
    }

    /**
     * @notice Set the SVG renderer.
     * @dev Only callable by the owner.
     */
    function setRenderer(ISVGRenderer _renderer) external onlyOwner {
        renderer = _renderer;

        emit RendererUpdated(_renderer);
    }

    /**
     * @notice Get the number of available Noun `backgrounds`.
     */
    function backgroundCount() external view override returns (uint256) {
        return backgrounds.length;
    }

    /**
     * @notice Get the number of available Noun `bodies`.
     */
    function bodyCount() external view override returns (uint256) {
        return _bodies.virtualIndexToStorageIndex.length;
    }

    /**
     * @notice Get the number of available Noun `accessories`.
     */
    function accessoryCount() external view override returns (uint256) {
        return _accessories.virtualIndexToStorageIndex.length;
    }

    /**
     * @notice Get the number of available Noun `heads`.
     */
    function headCount() external view override returns (uint256) {
        return _heads.virtualIndexToStorageIndex.length;
    }

    /**
     * @notice Get the number of available Noun `glasses`.
     */
    function glassesCount() external view override returns (uint256) {
        return _glasses.virtualIndexToStorageIndex.length;
    }

    /**
     * @notice Batch add Noun backgrounds.
     * @dev This function can only be called by the owner when not locked.
     */
    function addManyBackgrounds(string[] calldata _backgrounds) external override onlyOwner whenPartsNotLocked {
        for (uint256 i = 0; i < _backgrounds.length; i++) {
            _addBackground(_backgrounds[i]);
        }
    }

    /**
     * @notice Add a Noun background.
     * @dev This function can only be called by the owner when not locked.
     */
    function addBackground(string calldata _background) external override onlyOwner whenPartsNotLocked {
        _addBackground(_background);
    }

    /**
     * @notice Add a Noun background.
     */
    function _addBackground(string calldata _background) internal {
        backgrounds.push(_background);
    }

    /**
     * @notice Update a single color palette. This function can be used to
     * add a new color palette or update an existing palette.
     * @dev This function can only be called by the descriptor.
     */
    function setPalette(uint8 paletteIndex, bytes calldata palette) external onlyOwner {
        if (palette.length == 0) {
            revert EmptyPalette();
        }
        if (palette.length % 3 != 0 || palette.length > 768) {
            revert BadPaletteLength();
        }
        palettes[paletteIndex] = SSTORE2.write(palette);
    }

    function addBodies(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external onlyOwner {
        addToTrait(_bodies, encodedCompressed, decompressedLength, imageCount);
    }

    function addAccessories(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external onlyOwner {
        addToTrait(_accessories, encodedCompressed, decompressedLength, imageCount);
    }

    function addHeads(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external onlyOwner {
        addToTrait(_heads, encodedCompressed, decompressedLength, imageCount);
    }

    function addGlasses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external onlyOwner {
        addToTrait(_glasses, encodedCompressed, decompressedLength, imageCount);
    }

    function retireBody(uint256 virtualIndex) external onlyOwner {
        retireTraitImage(_bodies, virtualIndex);
    }

    function retireAccessory(uint256 virtualIndex) external onlyOwner {
        retireTraitImage(_accessories, virtualIndex);
    }

    function retireHead(uint256 virtualIndex) external onlyOwner {
        retireTraitImage(_heads, virtualIndex);
    }

    function retireGlasses(uint256 virtualIndex) external onlyOwner {
        retireTraitImage(_glasses, virtualIndex);
    }

    function bodyStorageIndex(uint256 virtualIndex) external view returns (uint256) {
        return traitStorageIndex(_bodies, virtualIndex);
    }

    function accessoryStorageIndex(uint256 virtualIndex) external view returns (uint256) {
        return traitStorageIndex(_accessories, virtualIndex);
    }

    function headStorageIndex(uint256 virtualIndex) external view returns (uint256) {
        return traitStorageIndex(_heads, virtualIndex);
    }

    function glassesStorageIndex(uint256 virtualIndex) external view returns (uint256) {
        return traitStorageIndex(_glasses, virtualIndex);
    }

    function traitStorageIndex(Trait storage trait, uint256 virtualIndex) internal view returns (uint256) {
        return trait.virtualIndexToStorageIndex[virtualIndex];
    }

    function headsPageCount() public view returns (uint256) {
        return _heads.storagePages.length;
    }

    function bodiesPageCount() public view returns (uint256) {
        return _bodies.storagePages.length;
    }

    function accessoriesPageCount() public view returns (uint256) {
        return _accessories.storagePages.length;
    }

    function glassesPageCount() public view returns (uint256) {
        return _glasses.storagePages.length;
    }

    function headsPage(uint256 pageIndex) public view returns (NounArtStoragePage memory) {
        return _heads.storagePages[pageIndex];
    }

    function bodiesPage(uint256 pageIndex) public view returns (NounArtStoragePage memory) {
        return _bodies.storagePages[pageIndex];
    }

    function accessoriesPage(uint256 pageIndex) public view returns (NounArtStoragePage memory) {
        return _accessories.storagePages[pageIndex];
    }

    function glassesPage(uint256 pageIndex) public view returns (NounArtStoragePage memory) {
        return _glasses.storagePages[pageIndex];
    }

    function heads(uint256 storageIndex) public view returns (bytes memory) {
        return imageByStorageIndex(_heads, storageIndex);
    }

    function bodies(uint256 storageIndex) public view returns (bytes memory) {
        return imageByStorageIndex(_bodies, storageIndex);
    }

    function accessories(uint256 storageIndex) public view returns (bytes memory) {
        return imageByStorageIndex(_accessories, storageIndex);
    }

    function glasses(uint256 storageIndex) public view returns (bytes memory) {
        return imageByStorageIndex(_glasses, storageIndex);
    }

    /**
     * @notice Lock all Noun parts.
     * @dev This cannot be reversed and can only be called by the owner when not locked.
     */
    function lockParts() external override onlyOwner whenPartsNotLocked {
        arePartsLocked = true;

        emit PartsLocked();
    }

    /**
     * @notice Toggle a boolean value which determines if `tokenURI` returns a data URI
     * or an HTTP URL.
     * @dev This can only be called by the owner.
     */
    function toggleDataURIEnabled() external override onlyOwner {
        bool enabled = !isDataURIEnabled;

        isDataURIEnabled = enabled;
        emit DataURIToggled(enabled);
    }

    /**
     * @notice Set the base URI for all token IDs. It is automatically
     * added as a prefix to the value returned in {tokenURI}, or to the
     * token ID if {tokenURI} is empty.
     * @dev This can only be called by the owner.
     */
    function setBaseURI(string calldata _baseURI) external override onlyOwner {
        baseURI = _baseURI;

        emit BaseURIUpdated(_baseURI);
    }

    /**
     * @notice Given a token ID and seed, construct a token URI for an official Nouns DAO noun.
     * @dev The returned value may be a base64 encoded data URI or an API URL.
     */
    function tokenURI(uint256 tokenId, INounsSeeder.Seed memory seed) external view override returns (string memory) {
        if (isDataURIEnabled) {
            return dataURI(tokenId, seed);
        }
        return string(abi.encodePacked(baseURI, tokenId.toString()));
    }

    /**
     * @notice Given a token ID and seed, construct a base64 encoded data URI for an official Nouns DAO noun.
     */
    function dataURI(uint256 tokenId, INounsSeeder.Seed memory seed) public view override returns (string memory) {
        string memory nounId = tokenId.toString();
        string memory name = string(abi.encodePacked('Noun ', nounId));
        string memory description = string(abi.encodePacked('Noun ', nounId, ' is a member of the Nouns DAO'));

        return genericDataURI(name, description, seed);
    }

    /**
     * @notice Given a name, description, and seed, construct a base64 encoded data URI.
     */
    function genericDataURI(
        string memory name,
        string memory description,
        INounsSeeder.Seed memory seed
    ) public view override returns (string memory) {
        NFTDescriptor.TokenURIParams memory params = NFTDescriptor.TokenURIParams({
            name: name,
            description: description,
            parts: getPartsForSeed(seed),
            background: backgrounds[seed.background]
        });
        return NFTDescriptor.constructTokenURI(renderer, params);
    }

    /**
     * @notice Given a seed, construct a base64 encoded SVG image.
     */
    function generateSVGImage(INounsSeeder.Seed memory seed) external view override returns (string memory) {
        ISVGRenderer.SVGParams memory params = ISVGRenderer.SVGParams({
            parts: getPartsForSeed(seed),
            background: backgrounds[seed.background]
        });
        return NFTDescriptor.generateSVGImage(renderer, params);
    }

    /**
     * @notice Get all Noun parts for the passed `seed`.
     */
    function getPartsForSeed(INounsSeeder.Seed memory seed) public view returns (ISVGRenderer.Part[] memory) {
        bytes memory _body = bodies(seed.body);
        bytes memory _accessory = accessories(seed.accessory);
        bytes memory _head = heads(seed.head);
        bytes memory _glassesBytes = glasses(seed.glasses);

        ISVGRenderer.Part[] memory _parts = new ISVGRenderer.Part[](4);
        _parts[0] = ISVGRenderer.Part({ image: _body, palette: _getPalette(_body) });
        _parts[1] = ISVGRenderer.Part({ image: _accessory, palette: _getPalette(_accessory) });
        _parts[2] = ISVGRenderer.Part({ image: _head, palette: _getPalette(_head) });
        _parts[3] = ISVGRenderer.Part({ image: _glassesBytes, palette: _getPalette(_glassesBytes) });
        return _parts;
    }

    /**
     * @notice Get the color palette pointer for the passed part.
     */
    function _getPalette(bytes memory part) private view returns (address) {
        return palettes[uint8(part[0])];
    }

    function imageByStorageIndex(Trait storage trait, uint256 storageIndex) internal view returns (bytes memory) {
        (NounArtStoragePage storage page, uint256 pageFirstImageIndex) = getPage(trait.storagePages, storageIndex);
        bytes[] memory decompressedImages = decompressAndDecode(page);
        return decompressedImages[storageIndex - pageFirstImageIndex];
    }

    function getPage(NounArtStoragePage[] storage pages, uint256 storageIndex)
        internal
        view
        returns (NounArtStoragePage storage, uint256)
    {
        uint256 len = pages.length;
        if (len == 0) {
            revert NoPages();
        }

        uint256 pageFirstImageIndex = 0;
        for (uint256 i = 0; i < len; i++) {
            NounArtStoragePage storage page = pages[i];

            if (storageIndex < pageFirstImageIndex + page.imageCount) {
                return (page, pageFirstImageIndex);
            }

            pageFirstImageIndex += page.imageCount;
        }

        revert ImageNotFound();
    }

    function decompressAndDecode(NounArtStoragePage storage page) internal view returns (bytes[] memory) {
        bytes memory compressedData = SSTORE2.read(page.pointer);
        (, bytes memory decompressedData) = Inflate.puff(compressedData, page.decompressedLength);
        return abi.decode(decompressedData, (bytes[]));
    }

    function addToTrait(
        Trait storage trait,
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) internal {
        trait.storagePages.push(
            NounArtStoragePage({
                pointer: SSTORE2.write(encodedCompressed),
                decompressedLength: decompressedLength,
                imageCount: imageCount
            })
        );

        uint256 storedImageCount = trait.storedImagesCount;

        for (uint256 i = 0; i < imageCount; i++) {
            trait.virtualIndexToStorageIndex.push(storedImageCount + i);
        }

        trait.storedImagesCount += imageCount;
    }

    function retireTraitImage(Trait storage trait, uint256 virtualIndex) internal {
        trait.virtualIndexToStorageIndex[virtualIndex] = trait.virtualIndexToStorageIndex[
            trait.virtualIndexToStorageIndex.length - 1
        ];

        trait.virtualIndexToStorageIndex.pop();
    }
}
