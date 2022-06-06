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

pragma solidity ^0.8.6;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { INounsDescriptor } from './interfaces/INounsDescriptor.sol';
import { INounsSeeder } from './interfaces/INounsSeeder.sol';
import { INounsDescriptorWithProperties } from './interfaces/INounsDescriptorWithProperties.sol';
import { NFTDescriptorProperties } from './libs/NFTDescriptorProperties.sol';
import { MultiPartRLEToSVGProperties } from './libs/MultiPartRLEToSVGProperties.sol';
import 'hardhat/console.sol';

contract NounsDescriptorWithProperties is Ownable, INounsDescriptorWithProperties {
    using Strings for uint256;

    // prettier-ignore
    // https://creativecommons.org/publicdomain/zero/1.0/legalcode.txt
    bytes32 constant COPYRIGHT_CC0_1_0_UNIVERSAL_LICENSE = 0xa2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499;

    INounsDescriptor public immutable previousDescriptor;
    address pendingOwner;

    INounsDescriptorWithProperties.ElementTypeValues public elementTypeValues;
    mapping(uint8 => mapping(uint256 => string)) public override names;

    constructor(INounsDescriptor _previousDescriptor) {
        elementTypeValues = ElementTypeValues({
            BODY: 0,
            ACCESSORY: 1,
            HEAD: 2,
            GLASSES: 3,
            BACKGROUND: 4,
            PALETTE: 5
        });
        previousDescriptor = _previousDescriptor;
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        pendingOwner = newOwner;
    }

    function acceptOwnershipTransfer() public {
        if (msg.sender != pendingOwner) {
            revert OwnershipNeedsToBeAcceptedByNewOwner();
        }
        _transferOwnership(pendingOwner);
    }

    function reclaimOriginalOwnership() public onlyOwner {
        Ownable(address(previousDescriptor)).transferOwnership(owner());
    }

    function addNames(INounsDescriptorWithProperties.NameElementData[] calldata newNames) external override onlyOwner {
        ElementTypeValues memory elTypes = elementTypeValues;
        for (uint256 i = 0; i < newNames.length; ) {
            if (newNames[i].elementId >= getSize(newNames[i].elType, elTypes)) {
                revert WrongIndex();
            }
            _addName(newNames[i]);

            unchecked {
                ++i;
            }
        }
    }

    function getSize(uint8 elementType, ElementTypeValues memory elTypes) internal returns (uint256 count) {
        bytes4 selector;
        if (elementType == elTypes.BODY) {
            selector = INounsDescriptor.bodyCount.selector;
        } else if (elementType == elTypes.ACCESSORY) {
            selector = INounsDescriptor.accessoryCount.selector;
        } else if (elementType == elTypes.HEAD) {
            selector = INounsDescriptor.headCount.selector;
        } else if (elementType == elTypes.GLASSES) {
            selector = INounsDescriptor.glassesCount.selector;
        } else if (elementType == elTypes.BACKGROUND) {
            selector = INounsDescriptor.backgroundCount.selector;
        } else {
            revert TypeNotRecognized();
        }
        (bool ok, bytes memory data) = address(previousDescriptor).call(abi.encodeWithSelector(selector));
        require(ok, 'TXN failed');
        (count) = abi.decode(data, (uint256));
    }

    function addElementsWithName(INounsDescriptorWithProperties.NameElementData[] calldata newElements)
        external
        override
        onlyOwner
    {
        ElementTypeValues memory elTypes = elementTypeValues;
        for (uint256 i = 0; i < newElements.length; ) {
            NameElementData calldata newElement = newElements[i];
            if (newElement.elementId != 0) {
                revert WrongIndex();
            }
            _addName(newElement);

            if (newElement.elType == elTypes.BODY) {
                previousDescriptor.addBody(newElement.elementData);
            } else if (newElement.elType == elTypes.ACCESSORY) {
                previousDescriptor.addAccessory(newElement.elementData);
            } else if (newElement.elType == elTypes.HEAD) {
                previousDescriptor.addHead(newElement.elementData);
            } else if (newElement.elType == elTypes.GLASSES) {
                previousDescriptor.addGlasses(newElement.elementData);
            } else if (newElement.elType == elTypes.BACKGROUND) {
                previousDescriptor.addBackground(string(newElement.elementData));
            } else {
                revert TypeNotRecognized();
            }

            unchecked {
                ++i;
            }
        }
    }

    function _addName(NameElementData calldata element) public onlyOwner {
        uint256 elementId = element.elementId == 0 ? getSize(element.elType, elementTypeValues) : element.elementId;
        if (bytes(names[element.elType][elementId]).length > 0) {
            revert CannotRename();
        }

        names[element.elType][elementId] = element.name;
        emit NamedElement(element.elType, elementId, element.name);
    }

    /**
     * @notice Given a token ID and seed, construct a token URI for an official Nouns DAO noun.
     * @dev The returned value may be a base64 encoded data URI or an API URL.
     */
    function tokenURI(uint256 tokenId, INounsSeeder.Seed memory seed) external view returns (string memory) {
        if (previousDescriptor.isDataURIEnabled()) {
            return dataURI(tokenId, seed);
        }
        return string(abi.encodePacked(previousDescriptor.baseURI, tokenId.toString()));
    }

    /**
     * @notice Given a token ID and seed, construct a base64 encoded data URI for an official Nouns DAO noun.
     */
    function dataURI(uint256 tokenId, INounsSeeder.Seed memory seed) public view returns (string memory) {
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
    ) public view returns (string memory) {
        NFTDescriptorProperties.TokenURIParams memory params = NFTDescriptorProperties.TokenURIParams({
            name: name,
            description: description,
            parts: _getPartsAndNamesForSeed(seed),
            background: previousDescriptor.backgrounds(seed.background)
        });
        return NFTDescriptorProperties.constructTokenURI(params, previousDescriptor);
    }

    /**
     * @notice Given a seed, construct a base64 encoded SVG image.
     */
    function generateSVGImage(INounsSeeder.Seed memory seed) external view returns (string memory) {
        MultiPartRLEToSVGProperties.SVGParams memory params = MultiPartRLEToSVGProperties.SVGParams({
            parts: _getPartsAndNamesForSeed(seed),
            background: previousDescriptor.backgrounds(seed.background)
        });
        return NFTDescriptorProperties.generateSVGImage(params, 4, previousDescriptor);
    }

    /*
     * @notice Get all Noun parts and names for the passed `seed`.
     */
    function _getPartsAndNamesForSeed(INounsSeeder.Seed memory seed) internal view returns (bytes[] memory) {
        bytes[] memory _parts = new bytes[](9);
        _parts[0] = previousDescriptor.bodies(seed.body);
        _parts[1] = previousDescriptor.accessories(seed.accessory);
        _parts[2] = previousDescriptor.heads(seed.head);
        _parts[3] = previousDescriptor.glasses(seed.glasses);
        _parts[4] = bytes(names[elementTypeValues.BODY][seed.body]);
        _parts[5] = bytes(names[elementTypeValues.ACCESSORY][seed.accessory]);
        _parts[6] = bytes(names[elementTypeValues.HEAD][seed.head]);
        _parts[7] = bytes(names[elementTypeValues.GLASSES][seed.glasses]);
        _parts[8] = bytes(names[elementTypeValues.BACKGROUND][seed.background]);
        return _parts;
    }

    function _call(address implementation) internal virtual {
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.
            let result := call(gas(), implementation, 0, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    fallback() external {
        bytes4 selector;
        bytes calldata data = msg.data;
        assembly {
            selector := calldataload(data.offset)
        }

        // keep the read functions as-is
        bool isValidReadFn = selector == INounsDescriptor.arePartsLocked.selector ||
            selector == INounsDescriptor.isDataURIEnabled.selector ||
            selector == INounsDescriptor.baseURI.selector ||
            selector == INounsDescriptor.palettes.selector ||
            selector == INounsDescriptor.backgrounds.selector ||
            selector == INounsDescriptor.bodies.selector ||
            selector == INounsDescriptor.accessories.selector ||
            selector == INounsDescriptor.heads.selector ||
            selector == INounsDescriptor.glasses.selector ||
            selector == INounsDescriptor.backgroundCount.selector ||
            selector == INounsDescriptor.bodyCount.selector ||
            selector == INounsDescriptor.accessoryCount.selector ||
            selector == INounsDescriptor.headCount.selector ||
            selector == INounsDescriptor.glassesCount.selector ||
            selector == INounsDescriptor.generateSVGImage.selector;

        bool isValidWriteFn = selector == INounsDescriptor.addManyColorsToPalette.selector ||
            selector == INounsDescriptor.lockParts.selector ||
            selector == INounsDescriptor.addColorToPalette.selector ||
            selector == INounsDescriptor.toggleDataURIEnabled.selector ||
            selector == INounsDescriptor.setBaseURI.selector;

        if (isValidReadFn || (msg.sender == owner() && isValidWriteFn)) {
            _call(address(previousDescriptor));
        }
    }
}
