// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.5;

import { INounsDescriptor } from './interfaces/INounsDescriptor.sol';
import { INounsSeeder } from './interfaces/INounsSeeder.sol';
import { NFTDescriptor } from './libs/NFTDescriptor.sol';

/**
 * @title The Nouns NFT descriptor.
 */
contract NounsDescriptor is INounsDescriptor {
    // The nounsDAO address (avatars org)
    address public immutable override nounsDAO;

    // Whether new Noun parts can be added
    bool public override isLocked;

    // Noun Color Palettes
    mapping(uint8 => string[]) public override palettes;

    // Noun Bodies
    bytes[] public override bodies;

    // Noun Accessories
    bytes[] public override accessories;

    // Noun Heads
    bytes[] public override heads;

    // Noun Glasses
    bytes[] public override glasses;

    /**
     * @notice Require that the contract has not been locked.
     */
    modifier whenNotLocked() {
        require(!isLocked, 'Contract is locked');
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
     * @notice Get the number of Noun available Noun `bodies`.
     */
    function bodyCount() external view override returns (uint256) {
        return bodies.length;
    }

    /**
     * @notice Get the number of Noun available Noun `accessories`.
     */
    function accessoryCount() external view override returns (uint256) {
        return accessories.length;
    }

    /**
     * @notice Get the number of Noun available Noun `heads`.
     */
    function headCount() external view override returns (uint256) {
        return heads.length;
    }

    /**
     * @notice Get the number of Noun available Noun `glasses`.
     */
    function glassesCount() external view override returns (uint256) {
        return glasses.length;
    }

    /**
     * @notice Add colors to a color palette.
     * @dev This function can only be called by nounDAO when not locked.
     */
    function addManyColorsToPalette(uint8 paletteIndex, string[] calldata newColors)
        external
        override
        onlyNounsDAO
        whenNotLocked
    {
        require(palettes[paletteIndex].length + newColors.length <= 256, 'Palettes can only hold 256 colors');
        for (uint256 i = 0; i < newColors.length; i++) {
            _addColorToPalette(paletteIndex, newColors[i]);
        }
    }

    /**
     * @notice Batch add Noun bodies.
     * @dev This function can only be called by nounDAO when not locked.
     */
    function addManyBodies(bytes[] calldata _bodies) external override onlyNounsDAO whenNotLocked {
        for (uint256 i = 0; i < _bodies.length; i++) {
            _addBody(_bodies[i]);
        }
    }

    /**
     * @notice Batch add Noun accessories.
     * @dev This function can only be called by nounDAO when not locked.
     */
    function addManyAccessories(bytes[] calldata _accessories) external override onlyNounsDAO whenNotLocked {
        for (uint256 i = 0; i < _accessories.length; i++) {
            _addAccessory(_accessories[i]);
        }
    }

    /**
     * @notice Batch add Noun heads.
     * @dev This function can only be called by nounDAO when not locked.
     */
    function addManyHeads(bytes[] calldata _heads) external override onlyNounsDAO whenNotLocked {
        for (uint256 i = 0; i < _heads.length; i++) {
            _addHead(_heads[i]);
        }
    }

    /**
     * @notice Batch add Noun glasses.
     * @dev This function can only be called by nounDAO when not locked.
     */
    function addManyGlasses(bytes[] calldata _glasses) external override onlyNounsDAO whenNotLocked {
        for (uint256 i = 0; i < _glasses.length; i++) {
            _addGlasses(_glasses[i]);
        }
    }

    /**
     * @notice Add a single color to a color palette.
     * @dev This function can only be called by nounDAO when not locked.
     */
    function addColorToPalette(uint8 _paletteIndex, string calldata _color)
        external
        override
        onlyNounsDAO
        whenNotLocked
    {
        require(palettes[_paletteIndex].length <= 255, 'Palettes can only hold 256 colors');
        _addColorToPalette(_paletteIndex, _color);
    }

    /**
     * @notice Add a Noun body.
     * @dev This function can only be called by nounDAO when not locked.
     */
    function addBody(bytes calldata _body) external override onlyNounsDAO whenNotLocked {
        _addBody(_body);
    }

    /**
     * @notice Add a Noun accessory.
     * @dev This function can only be called by nounDAO when not locked.
     */
    function addAccessory(bytes calldata _accessory) external override onlyNounsDAO whenNotLocked {
        _addAccessory(_accessory);
    }

    /**
     * @notice Add a Noun head.
     * @dev This function can only be called by nounDAO when not locked.
     */
    function addHead(bytes calldata _head) external override onlyNounsDAO whenNotLocked {
        _addHead(_head);
    }

    /**
     * @notice Add Noun glasses.
     * @dev This function can only be called by nounDAO when not locked.
     */
    function addGlasses(bytes calldata _glasses) external override onlyNounsDAO whenNotLocked {
        _addGlasses(_glasses);
    }

    /**
     * @notice Lock all Noun parts and color palettes.
     * @dev This cannot be reversed and can only be called by nounDAO when not locked.
     */
    function lock() external override onlyNounsDAO whenNotLocked {
        isLocked = true;
    }

    /**
     * @notice Given a token ID and seed, construct the token URI.
     */
    function tokenURI(uint256 tokenId, INounsSeeder.Seed memory seed) external view override returns (string memory) {
        NFTDescriptor.ConstructTokenURIParams memory params = NFTDescriptor.ConstructTokenURIParams({
            tokenId: tokenId,
            parts: _getPartsForSeed(seed)
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
