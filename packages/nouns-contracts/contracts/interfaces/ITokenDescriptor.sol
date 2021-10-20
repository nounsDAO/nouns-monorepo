// SPDX-License-Identifier: GPL-3.0

 
pragma solidity ^0.8.6;
 

interface ITokenDescriptor { 
   
    event BaseURIUpdated(string baseURI);
 
    function baseURI() external returns (string memory);
        
    function setBaseURI(string calldata baseURI) external;

    function tokenURI(uint256 tokenId) external view returns (string memory);
  
}