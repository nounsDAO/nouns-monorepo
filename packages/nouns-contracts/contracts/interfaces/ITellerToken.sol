// SPDX-License-Identifier: GPL-3.0

  

pragma solidity ^0.8.6;

import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { ITokenDescriptor } from './ITokenDescriptor.sol';
//import { ITokenSeeder } from './ITokenSeeder.sol';

interface ITellerToken is IERC721 {
    event TellerCardCreated(uint256 indexed tokenId);

    event TellerCardBurned(uint256 indexed tokenId);
 
    event MinterUpdated(address minter);

    event MinterLocked();

    event DescriptorUpdated(ITokenDescriptor descriptor);

    event DescriptorLocked();
 
    //event SeederUpdated(ITokenSeeder seeder);

    //event SeederLocked();

    function mint() external returns (uint256);

    function burn(uint256 tokenId) external;

    //function dataURI(uint256 tokenId) external returns (string memory);
  
    function setMinter(address minter) external;

    function lockMinter() external;

    function setDescriptor(ITokenDescriptor descriptor) external;

    function lockDescriptor() external;

    //function setSeeder(ITokenSeeder seeder) external;

    //function lockSeeder() external;
}