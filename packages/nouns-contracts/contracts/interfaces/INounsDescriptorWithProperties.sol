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

// Extends INounsDescriptor
interface INounsDescriptorWithProperties {
    event NamedElement(uint8 elementType, uint256 elementId, string name);

    error OwnershipNeedsToBeAcceptedByNewOwner();
    error CannotRename();
    error TypeNotRecognized();

    function addNames(NameElementData[] calldata newNames) external;

    function addElementsWithName(NameElementData[] calldata newElements) external;

    struct ElementTypeValues {
        uint8 BODY;
        uint8 ACCESSORY;
        uint8 HEAD;
        uint8 GLASSES;
        uint8 BACKGROUND;
        uint8 PALETTE;
    }

    struct NameElementData {
        uint8 elType;
        string name;
        uint256 elementId;
        bytes elementData;
    }

    function names(uint8, uint256) external returns (string memory);
}
