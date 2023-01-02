// SPDX-License-Identifier: GPL-3.0

/// @title The Punks NFT descriptor

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

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { IDescriptorV2 } from './interfaces/IDescriptorV2.sol';
import { ISeeder } from './interfaces/ISeeder.sol';
import { NFTDescriptorV2 } from './libs/NFTDescriptorV2.sol';
import { ISVGRenderer } from './interfaces/ISVGRenderer.sol';
import { IArt } from './interfaces/IArt.sol';
import { IInflator } from './interfaces/IInflator.sol';

contract NDescriptorV2 is IDescriptorV2, Ownable {
    using Strings for uint256;

    // prettier-ignore
    // https://creativecommons.org/publicdomain/zero/1.0/legalcode.txt
    bytes32 constant COPYRIGHT_CC0_1_0_UNIVERSAL_LICENSE = 0xa2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499;

    /// @notice The contract responsible for holding compressed Punk art
    IArt public art;

    /// @notice The contract responsible for constructing SVGs
    ISVGRenderer public renderer;

    /// @notice Whether or not new Punk parts can be added
    bool public override arePartsLocked;

    /// @notice Whether or not `tokenURI` should be returned as a data URI (Default: true)
    bool public override isDataURIEnabled = true;

    /// @notice Base URI, used when isDataURIEnabled is false
    string public override baseURI;

    /**
     * @notice Require that the parts have not been locked.
     */
    modifier whenPartsNotLocked() {
        require(!arePartsLocked, 'Parts are locked');
        _;
    }

    constructor(IArt _art, ISVGRenderer _renderer) {
        art = _art;
        renderer = _renderer;
    }

    /**
     * @notice Set the Punk's art contract.
     * @dev Only callable by the owner when not locked.
     */
    function setArt(IArt _art) external onlyOwner whenPartsNotLocked {
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
     * @notice Set the art contract's `descriptor`.
     * @param descriptor the address to set.
     * @dev Only callable by the owner.
     */
    function setArtDescriptor(address descriptor) external onlyOwner {
        art.setDescriptor(descriptor);
    }

    /**
     * @notice Set the art contract's `inflator`.
     * @param inflator the address to set.
     * @dev Only callable by the owner.
     */
    function setArtInflator(IInflator inflator) external onlyOwner {
        art.setInflator(inflator);
    }

    /**
     * @notice Get the number of available Noun `backgrounds`.
     */
    // function backgroundCount() external view override returns (uint256) {
    //     return art.backgroundsCount();
    // }

    /**
     * @notice Get the number of available Punk `bodies`.
     */
    function punkTypeCount() external view override returns (uint256) {
        return art.getPunkTypesTrait().storedImagesCount;
    }
    function hatCount() external view override returns (uint256) {
        return art.getHatsTrait().storedImagesCount;
    }
    function hairCount() external view override returns (uint256) {
        return art.getHairsTrait().storedImagesCount;
    }
    function beardCount() external view override returns (uint256) {
        return art.getBeardsTrait().storedImagesCount;
    }
    function eyesCount() external view override returns (uint256) {
        return art.getEyesesTrait().storedImagesCount;
    }
    function glassesCount() external view override returns (uint256) {
        return art.getGlassesesTrait().storedImagesCount;
    }
    function mouthCount() external view override returns (uint256) {
        return art.getMouthsTrait().storedImagesCount;
    }
    function teethCount() external view override returns (uint256) {
        return art.getTeethsTrait().storedImagesCount;
    }
    function lipsCount() external view override returns (uint256) {
        return art.getLipsesTrait().storedImagesCount;
    }
    function neckCount() external view override returns (uint256) {
        return art.getNecksTrait().storedImagesCount;
    }
    function emotionCount() external view override returns (uint256) {
        return art.getEmotionsTrait().storedImagesCount;
    }
    function faceCount() external view override returns (uint256) {
        return art.getFacesTrait().storedImagesCount;
    }
    function earsCount() external view override returns (uint256) {
        return art.getEarsesTrait().storedImagesCount;
    }
    function noseCount() external view override returns (uint256) {
        return art.getNosesTrait().storedImagesCount;
    }
    function cheeksCount() external view override returns (uint256) {
        return art.getCheeksesTrait().storedImagesCount;
    }

    /**
     * @notice Batch add Noun backgrounds.
     * @dev This function can only be called by the owner when not locked.
     */
    // function addManyBackgrounds(string[] calldata _backgrounds) external override onlyOwner whenPartsNotLocked {
    //     art.addManyBackgrounds(_backgrounds);
    // }

    /**
     * @notice Add a Noun background.
     * @dev This function can only be called by the owner when not locked.
     */
    // function addBackground(string calldata _background) external override onlyOwner whenPartsNotLocked {
    //     art.addBackground(_background);
    // }

    /**
     * @notice Update a single color palette. This function can be used to
     * add a new color palette or update an existing palette.
     * @param paletteIndex the identifier of this palette
     * @param palette byte array of colors. every 3 bytes represent an RGB color. max length: 256 * 3 = 768
     * @dev This function can only be called by the owner when not locked.
     */
    function setPalette(uint8 paletteIndex, bytes calldata palette) external override onlyOwner whenPartsNotLocked {
        art.setPalette(paletteIndex, palette);
    }

    /**
     * @notice Add a batch of body images.
     * @param encodedCompressed bytes created by taking a string array of RLE-encoded images, abi encoding it as a bytes array,
     * and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     * @dev This function can only be called by the owner when not locked.
     */
    function addPunkTypes(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addPunkTypes(encodedCompressed, decompressedLength, imageCount);
    }
    function addHats(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addHats(encodedCompressed, decompressedLength, imageCount);
    }
    function addHairs(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addHairs(encodedCompressed, decompressedLength, imageCount);
    }
    function addBeards(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addBeards(encodedCompressed, decompressedLength, imageCount);
    }
    function addEyeses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addEyeses(encodedCompressed, decompressedLength, imageCount);
    }
    function addGlasseses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addGlasseses(encodedCompressed, decompressedLength, imageCount);
    }
    function addMouths(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addMouths(encodedCompressed, decompressedLength, imageCount);
    }
    function addTeeths(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addTeeths(encodedCompressed, decompressedLength, imageCount);
    }
    function addLipses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addLipses(encodedCompressed, decompressedLength, imageCount);
    }
    function addNecks(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addNecks(encodedCompressed, decompressedLength, imageCount);
    }
    function addEmotions(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addEmotions(encodedCompressed, decompressedLength, imageCount);
    }
    function addFaces(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addFaces(encodedCompressed, decompressedLength, imageCount);
    }
    function addEarses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addEarses(encodedCompressed, decompressedLength, imageCount);
    }
    function addNoses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addNoses(encodedCompressed, decompressedLength, imageCount);
    }
    function addCheekses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addCheekses(encodedCompressed, decompressedLength, imageCount);
    }

    /**
     * @notice Update a single color palette. This function can be used to
     * add a new color palette or update an existing palette. This function does not check for data length validity
     * (len <= 768, len % 3 == 0).
     * @param paletteIndex the identifier of this palette
     * @param pointer the address of the contract holding the palette bytes. every 3 bytes represent an RGB color.
     * max length: 256 * 3 = 768.
     * @dev This function can only be called by the owner when not locked.
     */
    function setPalettePointer(uint8 paletteIndex, address pointer) external override onlyOwner whenPartsNotLocked {
        art.setPalettePointer(paletteIndex, pointer);
    }

    /**
     * @notice Add a batch of body images from an existing storage contract.
     * @param pointer the address of a contract where the image batch was stored using SSTORE2. The data
     * format is expected to be like {encodedCompressed}: bytes created by taking a string array of
     * RLE-encoded images, abi encoding it as a bytes array, and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     * @dev This function can only be called by the owner when not locked.
     */
    function addPunkTypesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addPunkTypesFromPointer(pointer, decompressedLength, imageCount);
    }
    function addHatsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addHatsFromPointer(pointer, decompressedLength, imageCount);
    }
    function addHairsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addHairsFromPointer(pointer, decompressedLength, imageCount);
    }
    function addBeardsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addBeardsFromPointer(pointer, decompressedLength, imageCount);
    }
    function addEyesesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addEyesesFromPointer(pointer, decompressedLength, imageCount);
    }
    function addGlassesesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addGlassesesFromPointer(pointer, decompressedLength, imageCount);
    }
    function addMouthsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addMouthsFromPointer(pointer, decompressedLength, imageCount);
    }
    function addTeethsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addTeethsFromPointer(pointer, decompressedLength, imageCount);
    }
    function addLipsesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addLipsesFromPointer(pointer, decompressedLength, imageCount);
    }
    function addNecksFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addNecksFromPointer(pointer, decompressedLength, imageCount);
    }
    function addEmotionsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addEmotionsFromPointer(pointer, decompressedLength, imageCount);
    }
    function addFacesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addFacesFromPointer(pointer, decompressedLength, imageCount);
    }
    function addEarsesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addEarsesFromPointer(pointer, decompressedLength, imageCount);
    }
    function addNosesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addNosesFromPointer(pointer, decompressedLength, imageCount);
    }
    function addCheeksesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyOwner whenPartsNotLocked {
        art.addCheeksesFromPointer(pointer, decompressedLength, imageCount);
    }

    /**
     * @notice Get a background color by ID.
     * @param index the index of the background.
     * @return string the RGB hex value of the background.
     */
    // function backgrounds(uint256 index) public view override returns (string memory) {
    //     return art.backgrounds(index);
    // }

    /**
     * @notice Get a head image by ID.
     * @param index the index of the head.
     * @return bytes the RLE-encoded bytes of the image.
     */
    function punkTypes(uint256 index) public view override returns (bytes memory) {
        return art.punkTypes(index);
    }
    function hats(uint256 index) public view override returns (bytes memory) {
        return art.hats(index);
    }
    function hairs(uint256 index) public view override returns (bytes memory) {
        return art.hairs(index);
    }
    function beards(uint256 index) public view override returns (bytes memory) {
        return art.beards(index);
    }
    function eyeses(uint256 index) public view override returns (bytes memory) {
        return art.eyeses(index);
    }
    function glasseses(uint256 index) public view override returns (bytes memory) {
        return art.glasseses(index);
    }
    function mouths(uint256 index) public view override returns (bytes memory) {
        return art.mouths(index);
    }
    function teeths(uint256 index) public view override returns (bytes memory) {
        return art.teeths(index);
    }
    function lipses(uint256 index) public view override returns (bytes memory) {
        return art.lipses(index);
    }
    function necks(uint256 index) public view override returns (bytes memory) {
        return art.necks(index);
    }
    function emotions(uint256 index) public view override returns (bytes memory) {
        return art.emotions(index);
    }
    function faces(uint256 index) public view override returns (bytes memory) {
        return art.faces(index);
    }
    function earses(uint256 index) public view override returns (bytes memory) {
        return art.earses(index);
    }
    function noses(uint256 index) public view override returns (bytes memory) {
        return art.noses(index);
    }
    function cheekses(uint256 index) public view override returns (bytes memory) {
        return art.cheekses(index);
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
     * @notice Lock all Punk parts.
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
     * @notice Given a token ID and seed, construct a token URI for an official Punks DAO token.
     * @dev The returned value may be a base64 encoded data URI or an API URL.
     */
    function tokenURI(uint256 tokenId, ISeeder.Seed memory seed) external view override returns (string memory) {
        if (isDataURIEnabled) {
            return dataURI(tokenId, seed);
        }
        return string(abi.encodePacked(baseURI, tokenId.toString()));
    }

    /**
     * @notice Given a token ID and seed, construct a base64 encoded data URI for an official NDAO token.
     */
    function dataURI(uint256 tokenId, ISeeder.Seed memory seed) public view override returns (string memory) {
        string memory punkId = tokenId.toString();
        string memory name = string(abi.encodePacked('Token ', punkId));
        string memory description = string(abi.encodePacked('Token ', punkId, ' is a member of the Punk DAO'));

        return genericDataURI(name, description, seed);
    }

    /**
     * @notice Given a name, description, and seed, construct a base64 encoded data URI.
     */
    function genericDataURI(
        string memory name,
        string memory description,
        ISeeder.Seed memory seed
    ) public view override returns (string memory) {
        NFTDescriptorV2.TokenURIParams memory params = NFTDescriptorV2.TokenURIParams({
            name: name,
            description: description,
            parts: getPartsForSeed(seed)
//            background: art.backgrounds(seed.background)
        });
        return NFTDescriptorV2.constructTokenURI(renderer, params);
    }

    /**
     * @notice Given a seed, construct a base64 encoded SVG image.
     */
    function generateSVGImage(ISeeder.Seed memory seed) external view override returns (string memory) {
        ISVGRenderer.SVGParams memory params = ISVGRenderer.SVGParams({
            parts: getPartsForSeed(seed)
//            background: art.backgrounds(seed.background)
        });
        return NFTDescriptorV2.generateSVGImage(renderer, params);
    }

    /**
     * @notice Get all Punk parts for the passed `seed`.
     */
    function getPartsForSeed(ISeeder.Seed memory seed) public view returns (ISVGRenderer.Part[] memory) {
        ISVGRenderer.Part[] memory parts = new ISVGRenderer.Part[](seed.accessories.length + 1);
        bytes memory accBuffer;
        uint256 punkTypeId;
        if (seed.punkType == 0) {
            punkTypeId = 2 * seed.skinTone;
        } else if (seed.punkType == 1) {
            punkTypeId = 8 + 2 * seed.skinTone;
        } else {
            punkTypeId = 12 + 2 * seed.punkType;
        }
        accBuffer = art.punkTypes(punkTypeId);
        parts[0] = ISVGRenderer.Part({ image: accBuffer, palette: _getPalette(accBuffer) });
        for(uint i = 0; i < seed.accessories.length; i ++) {
            uint accType = seed.accessories[i].accType;
            uint accId = 2 * seed.accessories[i].accId;
            if(accType == 0) accBuffer = art.hats(accId);
            else if(accType == 1) accBuffer = art.hairs(accId);
            else if(accType == 2) accBuffer = art.beards(accId);
            else if(accType == 3) accBuffer = art.eyeses(accId);
            else if(accType == 4) accBuffer = art.glasseses(accId);
            else if(accType == 5) accBuffer = art.mouths(accId);
            else if(accType == 6) accBuffer = art.teeths(accId);
            else if(accType == 7) accBuffer = art.lipses(accId);
            else if(accType == 8) accBuffer = art.necks(accId);
            else if(accType == 9) accBuffer = art.emotions(accId);
            else if(accType == 10) accBuffer = art.faces(accId);
            else if(accType == 11) accBuffer = art.earses(accId);
            else if(accType == 12) accBuffer = art.noses(accId);
            else if(accType == 13) accBuffer = art.cheekses(accId);
            else revert();
            parts[i + 1] = ISVGRenderer.Part({ image: accBuffer, palette: _getPalette(accBuffer) });
        }
        return parts;
    }

    /**
     * @notice Get the color palette pointer for the passed part.
     */
    function _getPalette(bytes memory part) private view returns (bytes memory) {
        return art.palettes(uint8(part[0]));
    }
}
