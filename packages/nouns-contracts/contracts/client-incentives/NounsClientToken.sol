// SPDX-License-Identifier: GPL-3.0

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
    /// @dev This is a ERC-7201 storage location, calculated using:
    /// @dev keccak256(abi.encode(uint256(keccak256("nounsclienttoken")) - 1)) & ~bytes32(uint256(0xff));
    bytes32 public constant STORAGE_LOCATION = 0x8cf5ce6e8ba000976223217bb8fd99e6473b9f0c4b7adc07d894a8f739887e00;

    event ClientRegistered(uint32 indexed clientId, string name, string description);
    event ClientUpdated(uint32 indexed clientId, string name, string description);

    constructor() initializer {}

    function initialize(address owner, address descriptor_) public initializer {
        __ERC721_init('Nouns Client Token', 'NOUNSCLIENT');
        _transferOwnership(owner);
        _getState().nextTokenId = 1;
        _getState().descriptor = descriptor_;
    }

    function registerClient(string calldata name, string calldata description) public virtual returns (uint32) {
        Storage storage s = _getState();
        uint32 tokenId = s.nextTokenId;
        s.nextTokenId++;
        _mint(msg.sender, tokenId);
        s.clientMetadata[tokenId] = ClientMetadata(name, description);

        emit ClientRegistered(tokenId, name, description);

        return tokenId;
    }

    function updateClientMetadata(uint32 tokenId, string calldata name, string calldata description) public {
        require(ownerOf(tokenId) == msg.sender, 'NounsClientToken: not owner');
        _getState().clientMetadata[tokenId] = ClientMetadata(name, description);

        emit ClientUpdated(tokenId, name, description);
    }

    function setDescriptor(address descriptor_) public onlyOwner {
        _getState().descriptor = descriptor_;
    }

    function clientMetadata(uint32 tokenId) public view returns (ClientMetadata memory) {
        return _getState().clientMetadata[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return
            INounsClientTokenDescriptor(_getState().descriptor).tokenURI(
                tokenId,
                _getState().clientMetadata[uint32(tokenId)]
            );
    }

    function descriptor() public view returns (address) {
        return _getState().descriptor;
    }

    function nextTokenId() public view returns (uint32) {
        return _getState().nextTokenId;
    }

    function _getState() private pure returns (Storage storage $) {
        assembly {
            $.slot := STORAGE_LOCATION
        }
    }
}
