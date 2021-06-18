// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.5;

import {INounsDescriptor} from './interfaces/INounsDescriptor.sol';
import {NFTDescriptor} from './libs/NFTDescriptor.sol';

/**
 * @title The Nouns NFT descriptor.
 * TODO: Lock down function calls, gas optimizations, consider moving to `NounsERC721`.
 */
contract NounsDescriptor is INounsDescriptor {
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

    // Noun Arms
    bytes[] public override arms;

    /**
     * @notice Get the number of Noun available Noun `bodies`.
     */
    function bodyCount() external view returns (uint256) {
        return bodies.length;
    }

    /**
     * @notice Get the number of Noun available Noun `accessories`.
     */
    function accessoryCount() external view returns (uint256) {
        return accessories.length;
    }

    /**
     * @notice Get the number of Noun available Noun `heads`.
     */
    function headCount() external view returns (uint256) {
        return heads.length;
    }

    /**
     * @notice Get the number of Noun available Noun `glasses`.
     */
    function glassesCount() external view returns (uint256) {
        return glasses.length;
    }

    /**
     * @notice Get the number of Noun available Noun `arms`.
     */
    function armsCount() external view returns (uint256) {
        return arms.length;
    }

    /**
     * Add colors to a color palette
     * @param paletteIndex The color palette index
     * @param newColors The colors to add to the color palette
     */
    function addManyColorsToPalette(
        uint8 paletteIndex,
        string[] calldata newColors
    ) external {
        require(
            palettes[paletteIndex].length + newColors.length <= 256,
            'Palettes can only hold 256 colors'
        );

        for (uint256 i = 0; i < newColors.length; i++) {
            _addColorToPalette(paletteIndex, newColors[i]);
        }
    }

    /**
     * @notice Batch add Noun bodies.
     */
    function addManyBodies(bytes[] calldata _bodies) external {
        for (uint256 i = 0; i < _bodies.length; i++) {
            _addBody(_bodies[i]);
        }
    }

    /**
     * @notice Batch add Noun accessories.
     */
    function addManyAccessories(bytes[] calldata _accessories) external {
        for (uint256 i = 0; i < _accessories.length; i++) {
            _addAccessory(_accessories[i]);
        }
    }

    /**
     * @notice Batch add Noun heads.
     */
    function addManyHeads(bytes[] calldata _heads) external {
        for (uint256 i = 0; i < _heads.length; i++) {
            _addHead(_heads[i]);
        }
    }

    /**
     * @notice Batch add Noun glasses.
     */
    function addManyGlasses(bytes[] calldata _glasses) external {
        for (uint256 i = 0; i < _glasses.length; i++) {
            _addGlasses(_glasses[i]);
        }
    }

    /**
     * @notice Batch add Noun arms.
     */
    function addManyArms(bytes[] calldata _arms) external {
        for (uint256 i = 0; i < _arms.length; i++) {
            _addArms(_arms[i]);
        }
    }

    /**
     * @notice Given a token ID and seed, construct the token URI.
     */
    // prettier-ignore
    function tokenURI(uint256 tokenId, uint256[5] memory seed)
        external
        view
        override
        returns (string memory)
    {
        NFTDescriptor.ConstructTokenURIParams memory params = NFTDescriptor.ConstructTokenURIParams({
            tokenId: tokenId,
            parts: _getPartsForSeed(seed)
        });
        return NFTDescriptor.constructTokenURI(params, palettes);
    }

    function _addColorToPalette(uint8 _paletteIndex, string calldata _color) internal {
        palettes[_paletteIndex].push(_color);
    }

    function _addBody(bytes calldata _body) internal {
        bodies.push(_body);
    }

    function _addAccessory(bytes calldata _accessory) internal {
        accessories.push(_accessory);
    }

    function _addHead(bytes calldata _head) internal {
        heads.push(_head);
    }

    function _addGlasses(bytes calldata _glasses) internal {
        glasses.push(_glasses);
    }

    function _addArms(bytes calldata _arms) internal {
        arms.push(_arms);
    }

    function _getPartsForSeed(uint256[5] memory seed)
        internal
        view
        returns (bytes[] memory)
    {
        bytes[] memory _parts = new bytes[](5);
        _parts[0] = bodies[seed[0]];
        _parts[1] = accessories[seed[1]];
        _parts[2] = heads[seed[2]];
        _parts[3] = glasses[seed[3]];
        _parts[4] = arms[seed[4]];
        return _parts;
    }
}
