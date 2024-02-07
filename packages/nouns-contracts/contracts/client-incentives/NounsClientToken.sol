// SPDX-License-Identifier: GPL-3.0

/// @title The client NFT Nouns clients use as their identity in the client incentives system

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

pragma solidity ^0.8.19;

import { ERC721Upgradeable } from '@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { INounsClientTokenTypes } from './INounsClientTokenTypes.sol';
import { INounsClientTokenDescriptor } from './INounsClientTokenDescriptor.sol';

contract NounsClientToken is INounsClientTokenTypes, ERC721Upgradeable, OwnableUpgradeable {
    /// @custom:storage-location erc7201:nouns.nounsclienttoken
    struct NounsClientTokenStorage {
        uint32 nextTokenId;
        address descriptor;
        mapping(uint32 => ClientMetadata) clientMetadata;
    }

    /// @dev This is a ERC-7201 storage location, calculated using:
    /// @dev keccak256(abi.encode(uint256(keccak256("nouns.nounsclienttoken")) - 1)) & ~bytes32(uint256(0xff));
    bytes32 public constant NounsClientTokenStorageLocation =
        0xb5ff9f2ad3ce9c5f981fca1b696d577b6a7f3491afe19108b82d4fbb7f611600;

    event ClientRegistered(uint32 indexed clientId, string name, string description);
    event ClientUpdated(uint32 indexed clientId, string name, string description);

    constructor() initializer {}

    function initialize(address owner, address descriptor_) public initializer {
        NounsClientTokenStorage storage $ = _getNounsClientTokenStorage();

        __ERC721_init('Nouns Client Token', 'NOUNSCLIENT');
        _transferOwnership(owner);
        $.nextTokenId = 1;
        $.descriptor = descriptor_;
    }

    function registerClient(string calldata name, string calldata description) public virtual returns (uint32) {
        NounsClientTokenStorage storage $ = _getNounsClientTokenStorage();
        uint32 tokenId = $.nextTokenId;
        $.nextTokenId++;
        _mint(msg.sender, tokenId);
        $.clientMetadata[tokenId] = ClientMetadata(name, description);

        emit ClientRegistered(tokenId, name, description);

        return tokenId;
    }

    function updateClientMetadata(uint32 tokenId, string calldata name, string calldata description) public {
        NounsClientTokenStorage storage $ = _getNounsClientTokenStorage();

        require(ownerOf(tokenId) == msg.sender, 'NounsClientToken: not owner');
        $.clientMetadata[tokenId] = ClientMetadata(name, description);

        emit ClientUpdated(tokenId, name, description);
    }

    function setDescriptor(address descriptor_) public onlyOwner {
        NounsClientTokenStorage storage $ = _getNounsClientTokenStorage();
        $.descriptor = descriptor_;
    }

    function clientMetadata(uint32 tokenId) public view returns (ClientMetadata memory) {
        NounsClientTokenStorage storage $ = _getNounsClientTokenStorage();
        return $.clientMetadata[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        NounsClientTokenStorage storage $ = _getNounsClientTokenStorage();
        return INounsClientTokenDescriptor($.descriptor).tokenURI(tokenId, $.clientMetadata[uint32(tokenId)]);
    }

    function descriptor() public view returns (address) {
        NounsClientTokenStorage storage $ = _getNounsClientTokenStorage();
        return $.descriptor;
    }

    function nextTokenId() public view returns (uint32) {
        NounsClientTokenStorage storage $ = _getNounsClientTokenStorage();
        return $.nextTokenId;
    }

    function _getNounsClientTokenStorage() private pure returns (NounsClientTokenStorage storage $) {
        assembly {
            $.slot := NounsClientTokenStorageLocation
        }
    }
}
