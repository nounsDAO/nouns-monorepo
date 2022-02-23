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

contract NounsArt is INounsArt {
    // prettier-ignore
    // https://creativecommons.org/publicdomain/zero/1.0/legalcode.txt
    bytes32 constant COPYRIGHT_CC0_1_0_UNIVERSAL_LICENSE = 0xa2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499;

    // Noun Color Palette Pointers (Palette Index => Pointer)
    mapping(uint8 => address) public palettes;

    // Noun Backgrounds (Hex Colors)
    string[] public backgrounds;

    // Noun Bodies (Custom RLE)
    bytes[] public bodies;

    // Noun Accessories (Custom RLE)
    bytes[] public accessories;

    // Noun Heads (Custom RLE)
    bytes[] public heads;

    // Noun Glasses (Custom RLE)
    bytes[] public glasses;

    // Current Nouns Descriptor address
    address public descriptor;

    // Pending Nouns Descriptor address
    address public pendingDescriptor;

    /**
     * @notice Require that the sender is the descriptor.
     */
    modifier onlyDescriptor() {
        require(msg.sender == descriptor, 'Sender is not the descriptor');
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
    function setDescriptor(address _pendingDescriptor) external onlyDescriptor {
        pendingDescriptor = _pendingDescriptor;
    }

    /**
     * @notice Confirm the pending descriptor.
     * @dev This function can only be called by the pending descriptor.
     */
    function confirmDescriptor() external {
        require(msg.sender == pendingDescriptor, 'Sender is not the pending descriptor');

        address oldDescriptor = descriptor;
        descriptor = pendingDescriptor;
        delete pendingDescriptor;

        emit DescriptorUpdated(oldDescriptor, descriptor);
    }

    /**
     * @notice Get the number of available Noun `backgrounds`.
     */
    function backgroundCount() external view returns (uint256) {
        return backgrounds.length;
    }

    /**
     * @notice Get the number of available Noun `bodies`.
     */
    function bodyCount() external view returns (uint256) {
        return bodies.length;
    }

    /**
     * @notice Get the number of available Noun `accessories`.
     */
    function accessoryCount() external view returns (uint256) {
        return accessories.length;
    }

    /**
     * @notice Get the number of available Noun `heads`.
     */
    function headCount() external view returns (uint256) {
        return heads.length;
    }

    /**
     * @notice Get the number of available Noun `glasses`.
     */
    function glassesCount() external view returns (uint256) {
        return glasses.length;
    }

    /**
     * @notice Update a single color palette pointer. This function can be used to
     * add a new color palette or update an existing palette.
     * @dev This function can only be called by the descriptor.
     */
    function setPalette(uint8 paletteIndex, address palette) external onlyDescriptor {
        _setPalette(paletteIndex, palette);
    }

    /**
     * @notice Batch add Noun backgrounds.
     * @dev This function can only be called by the descriptor.
     */
    function addManyBackgrounds(string[] calldata _backgrounds) external onlyDescriptor {
        for (uint256 i = 0; i < _backgrounds.length; i++) {
            _addBackground(_backgrounds[i]);
        }
    }

    /**
     * @notice Batch add Noun bodies.
     * @dev This function can only be called by the descriptor.
     */
    function addManyBodies(bytes[] calldata _bodies) external onlyDescriptor {
        for (uint256 i = 0; i < _bodies.length; i++) {
            _addBody(_bodies[i]);
        }
    }

    /**
     * @notice Batch add Noun accessories.
     * @dev This function can only be called by the descriptor.
     */
    function addManyAccessories(bytes[] calldata _accessories) external onlyDescriptor {
        for (uint256 i = 0; i < _accessories.length; i++) {
            _addAccessory(_accessories[i]);
        }
    }

    /**
     * @notice Batch add Noun heads.
     * @dev This function can only be called by the descriptor.
     */
    function addManyHeads(bytes[] calldata _heads) external onlyDescriptor {
        for (uint256 i = 0; i < _heads.length; i++) {
            _addHead(_heads[i]);
        }
    }

    /**
     * @notice Batch add Noun glasses.
     * @dev This function can only be called by the descriptor.
     */
    function addManyGlasses(bytes[] calldata _glasses) external onlyDescriptor {
        for (uint256 i = 0; i < _glasses.length; i++) {
            _addGlasses(_glasses[i]);
        }
    }

    /**
     * @notice Add a Noun background.
     * @dev This function can only be called by the descriptor.
     */
    function addBackground(string calldata _background) external onlyDescriptor {
        _addBackground(_background);
    }

    /**
     * @notice Add a Noun body.
     * @dev This function can only be called by the descriptor.
     */
    function addBody(bytes calldata _body) external onlyDescriptor {
        _addBody(_body);
    }

    /**
     * @notice Add a Noun accessory.
     * @dev This function can only be called by the descriptor.
     */
    function addAccessory(bytes calldata _accessory) external onlyDescriptor {
        _addAccessory(_accessory);
    }

    /**
     * @notice Add a Noun head.
     * @dev This function can only be called by the descriptor.
     */
    function addHead(bytes calldata _head) external onlyDescriptor {
        _addHead(_head);
    }

    /**
     * @notice Add Noun glasses.
     * @dev This function can only be called by the descriptor.
     */
    function addGlasses(bytes calldata _glasses) external onlyDescriptor {
        _addGlasses(_glasses);
    }

    /**
     * @notice Update a single color palette pointer. This function can be used to
     * add a new color palette or update an existing palette.
     */
    function _setPalette(uint8 paletteIndex, address palette) internal {
        palettes[paletteIndex] = palette;
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
}
