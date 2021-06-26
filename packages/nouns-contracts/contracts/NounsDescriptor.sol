// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.5;

import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { INounsDescriptor } from './interfaces/INounsDescriptor.sol';
import { INounsSeeder } from './interfaces/INounsSeeder.sol';
import { NFTDescriptor } from './libs/NFTDescriptor.sol';

/**
 * @title The Nouns NFT descriptor.
 */
contract NounsDescriptor is INounsDescriptor {
    using Strings for uint256;

    // The nounsDAO address (avatars org)
    address public immutable override nounsDAO;

    // Whether or not new Noun parts can be added
    bool public override arePartsLocked;

    // Whether or not `tokenURI` should be returned as a data URI
    bool public override isDataURIEnabled;

    // Base URI
    string public override baseURI;

    // Noun Color Palettes (Index => Hex Colors)
    mapping(uint8 => string[]) public override palettes;

    // Noun Backgrounds (Hex Colors)
    string[] public override backgrounds;

    // Noun Bodies (Custom RLE)
    bytes[] public override bodies;

    // Noun Accessories (Custom RLE)
    bytes[] public override accessories;

    // Noun Heads (Custom RLE)
    bytes[] public override heads;

    // Noun Glasses (Custom RLE)
    bytes[] public override glasses;

    /**
     * @notice Require that the parts have not been locked.
     */
    modifier whenPartsNotLocked() {
        require(!arePartsLocked, 'Parts are locked');
        _;
    }

    /**
     * @notice Require that the sender is the nounsDAO.
     */
    modifier onlyNounsDAO() {
        require(msg.sender == nounsDAO, 'Sender is not the nounsDAO');
        _;
    }

    /**
     * @notice Populate the nounsDAO address on deployment.
     */
    constructor(address _nounsDAO) {
        nounsDAO = _nounsDAO;
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
        return bodies.length;
    }

    /**
     * @notice Get the number of available Noun `accessories`.
     */
    function accessoryCount() external view override returns (uint256) {
        return accessories.length;
    }

    /**
     * @notice Get the number of available Noun `heads`.
     */
    function headCount() external view override returns (uint256) {
        return heads.length;
    }

    /**
     * @notice Get the number of available Noun `glasses`.
     */
    function glassesCount() external view override returns (uint256) {
        return glasses.length;
    }

    /**
     * @notice Add colors to a color palette.
     * @dev This function can only be called by nounsDAO.
     */
    function addManyColorsToPalette(uint8 paletteIndex, string[] calldata newColors)
        external
        override
        onlyNounsDAO
    {
        require(palettes[paletteIndex].length + newColors.length <= 256, 'Palettes can only hold 256 colors');
        for (uint256 i = 0; i < newColors.length; i++) {
            _addColorToPalette(paletteIndex, newColors[i]);
        }
    }

    /**
     * @notice Batch add Noun backgrounds.
     * @dev This function can only be called by nounsDAO when not locked.
     */
    function addManyBackgrounds(string[] calldata _backgrounds) external override onlyNounsDAO whenPartsNotLocked {
        for (uint256 i = 0; i < _backgrounds.length; i++) {
            _addBackground(_backgrounds[i]);
        }
    }

    /**
     * @notice Batch add Noun bodies.
     * @dev This function can only be called by nounsDAO when not locked.
     */
    function addManyBodies(bytes[] calldata _bodies) external override onlyNounsDAO whenPartsNotLocked {
        for (uint256 i = 0; i < _bodies.length; i++) {
            _addBody(_bodies[i]);
        }
    }

    /**
     * @notice Batch add Noun accessories.
     * @dev This function can only be called by nounsDAO when not locked.
     */
    function addManyAccessories(bytes[] calldata _accessories) external override onlyNounsDAO whenPartsNotLocked {
        for (uint256 i = 0; i < _accessories.length; i++) {
            _addAccessory(_accessories[i]);
        }
    }

    /**
     * @notice Batch add Noun heads.
     * @dev This function can only be called by nounsDAO when not locked.
     */
    function addManyHeads(bytes[] calldata _heads) external override onlyNounsDAO whenPartsNotLocked {
        for (uint256 i = 0; i < _heads.length; i++) {
            _addHead(_heads[i]);
        }
    }

    /**
     * @notice Batch add Noun glasses.
     * @dev This function can only be called by nounsDAO when not locked.
     */
    function addManyGlasses(bytes[] calldata _glasses) external override onlyNounsDAO whenPartsNotLocked {
        for (uint256 i = 0; i < _glasses.length; i++) {
            _addGlasses(_glasses[i]);
        }
    }

    /**
     * @notice Add a single color to a color palette.
     * @dev This function can only be called by nounsDAO.
     */
    function addColorToPalette(uint8 _paletteIndex, string calldata _color)
        external
        override
        onlyNounsDAO
    {
        require(palettes[_paletteIndex].length <= 255, 'Palettes can only hold 256 colors');
        _addColorToPalette(_paletteIndex, _color);
    }

    /**
     * @notice Add a Noun background.
     * @dev This function can only be called by nounsDAO when not locked.
     */
    function addBackground(string calldata _background) external override onlyNounsDAO whenPartsNotLocked {
        _addBackground(_background);
    }

    /**
     * @notice Add a Noun body.
     * @dev This function can only be called by nounsDAO when not locked.
     */
    function addBody(bytes calldata _body) external override onlyNounsDAO whenPartsNotLocked {
        _addBody(_body);
    }

    /**
     * @notice Add a Noun accessory.
     * @dev This function can only be called by nounsDAO when not locked.
     */
    function addAccessory(bytes calldata _accessory) external override onlyNounsDAO whenPartsNotLocked {
        _addAccessory(_accessory);
    }

    /**
     * @notice Add a Noun head.
     * @dev This function can only be called by nounsDAO when not locked.
     */
    function addHead(bytes calldata _head) external override onlyNounsDAO whenPartsNotLocked {
        _addHead(_head);
    }

    /**
     * @notice Add Noun glasses.
     * @dev This function can only be called by nounsDAO when not locked.
     */
    function addGlasses(bytes calldata _glasses) external override onlyNounsDAO whenPartsNotLocked {
        _addGlasses(_glasses);
    }

    /**
     * @notice Lock all Noun parts.
     * @dev This cannot be reversed and can only be called by nounsDAO when not locked.
     */
    function lockParts() external override onlyNounsDAO whenPartsNotLocked {
        arePartsLocked = true;
    }

    /**
     * @notice Set a boolean value which determines if `tokenURI` returns a data URI
     * or an HTTP URL.
     * @dev This can only be called by nounsDAO.
     */
    function setDataURIEnabled(bool _isDataURIEnabled) external override onlyNounsDAO {
        isDataURIEnabled = _isDataURIEnabled;
    }

    /**
     * @notice Set the base URI for all token IDs. It is automatically
     * added as a prefix to the value returned in {tokenURI}, or to the
     * token ID if {tokenURI} is empty.
     * @dev This can only be called by nounsDAO.
     */
    function setBaseURI(string calldata _baseURI) external override onlyNounsDAO {
        baseURI = _baseURI;
    }

    /**
     * @notice Given a token ID and seed, construct the token URI.
     * @dev The returned value may be a base64 encoded data URI or an API URL.
     */
    function tokenURI(uint256 tokenId, INounsSeeder.Seed memory seed) external view override returns (string memory) {
        if (isDataURIEnabled) {
            return dataURI(tokenId, seed);
        }
        return string(abi.encodePacked(baseURI, tokenId.toString()));
    }

    /**
     * @notice Given a token ID and seed, construct a base64 encoded data URI.
     */
    function dataURI(uint256 tokenId, INounsSeeder.Seed memory seed) public view override returns (string memory) {
        NFTDescriptor.ConstructTokenURIParams memory params = NFTDescriptor.ConstructTokenURIParams({
            tokenId: tokenId,
            parts: _getPartsForSeed(seed),
            background: backgrounds[seed.background]
        });
        return NFTDescriptor.constructTokenURI(params, palettes);
    }

    /**
     * @notice Add a single color to a color palette.
     */
    function _addColorToPalette(uint8 _paletteIndex, string calldata _color) internal {
        palettes[_paletteIndex].push(_color);
    }

    /**
     * @notice Add a Noun background.
     */
    function _addBackground(string calldata _background) internal {
        backgrounds.push(_background);
    }

    /**
     * @notice Add a Noun body.
     */
    function _addBody(bytes calldata _body) internal {
        bodies.push(_body);
    }

    /**
     * @notice Add a Noun accessory.
     */
    function _addAccessory(bytes calldata _accessory) internal {
        accessories.push(_accessory);
    }

    /**
     * @notice Add a Noun head.
     */
    function _addHead(bytes calldata _head) internal {
        heads.push(_head);
    }

    /**
     * @notice Add Noun glasses.
     */
    function _addGlasses(bytes calldata _glasses) internal {
        glasses.push(_glasses);
    }

    /**
     * @notice Get all Noun parts for the passed `seed`.
     */
    function _getPartsForSeed(INounsSeeder.Seed memory seed) internal view returns (bytes[] memory) {
        bytes[] memory _parts = new bytes[](4);
        _parts[0] = bodies[seed.body];
        _parts[1] = accessories[seed.accessory];
        _parts[2] = heads[seed.head];
        _parts[3] = glasses[seed.glasses];
        return _parts;
    }
}
