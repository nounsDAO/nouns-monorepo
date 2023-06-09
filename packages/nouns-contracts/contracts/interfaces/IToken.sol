// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NToken

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

import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { IDescriptorMinimal } from './IDescriptorMinimal.sol';
import { ISeeder } from './ISeeder.sol';

interface IToken is IERC721 {
    event PunkCreated(uint256 indexed tokenId, ISeeder.Seed seed);

    event PunkBurned(uint256 indexed tokenId);

    event PunkersUpdated(address punkers);

    event MinterUpdated(address minter);

    event MinterLocked();

    event DescriptorUpdated(IDescriptorMinimal descriptor);

    event DescriptorLocked();

    event SeederUpdated(ISeeder seeder);

    event SeederLocked();

    event RegisterOGHashesLocked();

    event MetadataUpdated(string name, string symbol);

    event MetadataLocked();

    function mint() external returns (uint256);

    function burn(uint256 tokenId) external;

    function dataURI(uint256 tokenId) external returns (string memory);

    function setPunkers(address punkers) external;

    function setMinter(address minter) external;

    function lockMinter() external;

    function setDescriptor(IDescriptorMinimal descriptor) external;

    function lockDescriptor() external;

    function setSeeder(ISeeder seeder) external;

    function lockSeeder() external;

    function lockRegisterOGHashes() external;

    function setName(string memory name_) external;

    function setSymbol(string memory symbol_) external;

    function lockMetadata() external;
}
