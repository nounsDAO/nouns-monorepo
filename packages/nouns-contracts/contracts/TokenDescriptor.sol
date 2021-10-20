// SPDX-License-Identifier: GPL-3.0

 

pragma solidity ^0.8.6;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { ITokenDescriptor } from './interfaces/ITokenDescriptor.sol';
  

contract TokenDescriptor is ITokenDescriptor, Ownable {
    using Strings for uint256;

    // prettier-ignore
    // https://creativecommons.org/publicdomain/zero/1.0/legalcode.txt
    bytes32 constant COPYRIGHT_CC0_1_0_UNIVERSAL_LICENSE = 0xa2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499;

      
    // Base URI
    string public override baseURI;
 
 
    
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
     * @notice Given a token ID and seed, construct a token URI  
     * @dev The returned value may be a base64 encoded data URI or an API URL.
     */
    function tokenURI(uint256 tokenId) external view override returns (string memory) {
        
        return string(abi.encodePacked(baseURI, tokenId.toString()));
    }

    
}