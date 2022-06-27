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
import { INounsArt } from './interfaces/INounsArt.sol';

contract NounsDescriptor is INounsDescriptor, Ownable {
    using Strings for uint256;

    // prettier-ignore
    // https://creativecommons.org/publicdomain/zero/1.0/legalcode.txt
    bytes32 constant COPYRIGHT_CC0_1_0_UNIVERSAL_LICENSE = 0xa2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499;

    // The contract responsible for holding compressed Noun art
    INounsArt public art;

    // The contract responsible for constructing SVGs
    ISVGRenderer public renderer;

    // Whether or not new Noun parts can be added
    bool public override arePartsLocked;

    // Whether or not `tokenURI` should be returned as a data URI (Default: true)
    bool public override isDataURIEnabled = true;

    // Base URI
    string public override baseURI;

    /**
     * @notice Require that the parts have not been locked.
     */
    modifier whenPartsNotLocked() {
        require(!arePartsLocked, 'Parts are locked');
        _;
    }

    constructor(INounsArt _art, ISVGRenderer _renderer) {
        art = _art;
        renderer = _renderer;
    }

    /**
     * @notice Set the Noun's art contract.
     * Only callable by the owner when not locked.
     */
    function setArt(INounsArt _art) external onlyOwner whenPartsNotLocked {
        art = _art;

        emit ArtUpdated(_art);
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
        return art.backgroundsCount();
    }

    /**
     * @notice Get the number of available Noun `bodies`.
     */
    function bodyCount() external view override returns (uint256) {
        return art.bodiesTrait().storedImagesCount;
    }

    /**
     * @notice Get the number of available Noun `accessories`.
     */
    function accessoryCount() external view override returns (uint256) {
        return art.accessoriesTrait().storedImagesCount;
    }

    /**
     * @notice Get the number of available Noun `heads`.
     */
    function headCount() external view override returns (uint256) {
        return art.headsTrait().storedImagesCount;
    }

    /**
     * @notice Get the number of available Noun `glasses`.
     */
    function glassesCount() external view override returns (uint256) {
        return art.glassesTrait().storedImagesCount;
    }

    /**
     * @notice Batch add Noun backgrounds.
     * @dev This function can only be called by the owner when not locked.
     */
    function addManyBackgrounds(string[] calldata _backgrounds) external override onlyOwner whenPartsNotLocked {
        art.addManyBackgrounds(_backgrounds);
    }

    /**
     * @notice Add a Noun background.
     * @dev This function can only be called by the owner when not locked.
     */
    function addBackground(string calldata _background) external override onlyOwner whenPartsNotLocked {
        art.addBackground(_background);
    }

    /**
     * @notice Update a single color palette. This function can be used to
     * add a new color palette or update an existing palette.
     */
    function setPalette(uint8 paletteIndex, bytes calldata palette) external override onlyOwner {
        art.setPalette(paletteIndex, palette);
    }

    /**
     * @notice Add a batch of body images.
     * @param encodedCompressed bytes created by taking a string array of RLE-encoded images, abi encoding it as a bytes array,
     * and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     */
    function addBodies(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner {
        art.addBodies(encodedCompressed, decompressedLength, imageCount);
    }

    /**
     * @notice Add a batch of accessory images.
     * @param encodedCompressed bytes created by taking a string array of RLE-encoded images, abi encoding it as a bytes array,
     * and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     */
    function addAccessories(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external onlyOwner {
        art.addAccessories(encodedCompressed, decompressedLength, imageCount);
    }

    /**
     * @notice Add a batch of head images.
     * @param encodedCompressed bytes created by taking a string array of RLE-encoded images, abi encoding it as a bytes array,
     * and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     */
    function addHeads(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external onlyOwner {
        art.addHeads(encodedCompressed, decompressedLength, imageCount);
    }

    /**
     * @notice Add a batch of glasses images.
     * @param encodedCompressed bytes created by taking a string array of RLE-encoded images, abi encoding it as a bytes array,
     * and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     */
    function addGlasses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external onlyOwner {
        art.addGlasses(encodedCompressed, decompressedLength, imageCount);
    }

    /**
     * @notice Add a batch of body images from an existing storage contract.
     * @param pointer the address of a contract where the image batch was stored using SSTORE2. The data
     * format is expected to be like {encodedCompressed}: bytes created by taking a string array of
     * RLE-encoded images, abi encoding it as a bytes array, and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     */
    function addBodiesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external onlyOwner {
        art.addBodiesFromPointer(pointer, decompressedLength, imageCount);
    }

    /**
     * @notice Add a batch of accessory images from an existing storage contract.
     * @param pointer the address of a contract where the image batch was stored using SSTORE2. The data
     * format is expected to be like {encodedCompressed}: bytes created by taking a string array of
     * RLE-encoded images, abi encoding it as a bytes array, and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     */
    function addAccessoriesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external onlyOwner {
        art.addAccessoriesFromPointer(pointer, decompressedLength, imageCount);
    }

    /**
     * @notice Add a batch of head images from an existing storage contract.
     * @param pointer the address of a contract where the image batch was stored using SSTORE2. The data
     * format is expected to be like {encodedCompressed}: bytes created by taking a string array of
     * RLE-encoded images, abi encoding it as a bytes array, and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     */
    function addHeadsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external onlyOwner {
        art.addHeadsFromPointer(pointer, decompressedLength, imageCount);
    }

    /**
     * @notice Add a batch of glasses images from an existing storage contract.
     * @param pointer the address of a contract where the image batch was stored using SSTORE2. The data
     * format is expected to be like {encodedCompressed}: bytes created by taking a string array of
     * RLE-encoded images, abi encoding it as a bytes array, and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     */
    function addGlassesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external onlyOwner {
        art.addGlassesFromPointer(pointer, decompressedLength, imageCount);
    }

    /**
     * @notice Get a background color by ID.
     * @param index the index of the background.
     * @return string the RGB hex value of the background.
     */
    function backgrounds(uint256 index) public view override returns (string memory) {
        return art.backgrounds(index);
    }

    /**
     * @notice Get a head image by ID.
     * @param index the index of the head.
     * @return bytes the RLE-encoded bytes of the image.
     */
    function heads(uint256 index) public view override returns (bytes memory) {
        return art.heads(index);
    }

    /**
     * @notice Get a body image by ID.
     * @param index the index of the body.
     * @return bytes the RLE-encoded bytes of the image.
     */
    function bodies(uint256 index) public view override returns (bytes memory) {
        return art.bodies(index);
    }

    /**
     * @notice Get an accessory image by ID.
     * @param index the index of the accessory.
     * @return bytes the RLE-encoded bytes of the image.
     */
    function accessories(uint256 index) public view override returns (bytes memory) {
        return art.accessories(index);
    }

    /**
     * @notice Get a glasses image by ID.
     * @param index the index of the glasses.
     * @return bytes the RLE-encoded bytes of the image.
     */
    function glasses(uint256 index) public view override returns (bytes memory) {
        return art.glasses(index);
    }

    /**
     * @notice Get a color palette by ID.
     * @param index the index of the palette.
     * @return bytes the palette bytes, where every 3 consecutive bytes represent a color in RGB format.
     */
    function palettes(uint8 index) public view override returns (bytes memory) {
        return art.palettes(index);
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
            background: art.backgrounds(seed.background)
        });
        return NFTDescriptor.constructTokenURI(renderer, params);
    }

    /**
     * @notice Given a seed, construct a base64 encoded SVG image.
     */
    function generateSVGImage(INounsSeeder.Seed memory seed) external view override returns (string memory) {
        ISVGRenderer.SVGParams memory params = ISVGRenderer.SVGParams({
            parts: getPartsForSeed(seed),
            background: art.backgrounds(seed.background)
        });
        return NFTDescriptor.generateSVGImage(renderer, params);
    }

    /**
     * @notice Get all Noun parts for the passed `seed`.
     */
    function getPartsForSeed(INounsSeeder.Seed memory seed) public view returns (ISVGRenderer.Part[] memory) {
        bytes memory _body = art.bodies(seed.body);
        bytes memory _accessory = art.accessories(seed.accessory);
        bytes memory _head = art.heads(seed.head);
        bytes memory _glassesBytes = art.glasses(seed.glasses);

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
    function _getPalette(bytes memory part) private view returns (bytes memory) {
        return art.palettes(uint8(part[0]));
    }
}
