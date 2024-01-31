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

import { ERC721 } from '@openzeppelin/contracts-v5/token/ERC721/ERC721.sol';
import { Ownable } from '@openzeppelin/contracts-v5/access/Ownable.sol';
import { INounsClientTokenTypes } from './INounsClientTokenTypes.sol';
import { INounsClientTokenDescriptor } from './INounsClientTokenDescriptor.sol';

contract NounsClientToken is INounsClientTokenTypes, ERC721('Nouns Client Token', 'NOUNSCLIENT'), Ownable {
    /// @dev This is a ERC-7201 storage location, calculated using:
    /// @dev keccak256(abi.encode(uint256(keccak256("nounsclienttoken")) - 1)) & ~bytes32(uint256(0xff));
    bytes32 private constant _STORAGE_LOCATION = 0x8cf5ce6e8ba000976223217bb8fd99e6473b9f0c4b7adc07d894a8f739887e00;

    constructor(address owner, address descriptor) Ownable(owner) {
        _getState().nextTokenId = 1;
        _getState().descriptor = descriptor;
    }

    function registerClient(string calldata name, string calldata description) public returns (uint32) {
        TokenState storage s = _getState();
        uint32 tokenId = s.nextTokenId;
        s.nextTokenId++;
        _mint(msg.sender, tokenId);
        s.clientMetadata[tokenId] = ClientMetadata(name, description);
        return tokenId;
    }

    function updateClientMetadata(uint32 tokenId, string calldata name, string calldata description) public {
        require(ownerOf(tokenId) == msg.sender, 'NounsClientToken: not owner');
        _getState().clientMetadata[tokenId] = ClientMetadata(name, description);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return
            INounsClientTokenDescriptor(_getState().descriptor).tokenURI(
                tokenId,
                _getState().clientMetadata[uint32(tokenId)]
            );
    }

    function setDescriptor(address descriptor) public onlyOwner {
        _getState().descriptor = descriptor;
    }

    function STORAGE_LOCATION() external pure returns (bytes32) {
        return _STORAGE_LOCATION;
    }

    function _getState() private pure returns (TokenState storage $) {
        assembly {
            $.slot := _STORAGE_LOCATION
        }
    }
}
