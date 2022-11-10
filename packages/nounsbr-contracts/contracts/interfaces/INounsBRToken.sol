// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NounsBRToken

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
import { INounsBRDescriptorMinimal } from './INounsBRDescriptorMinimal.sol';
import { INounsBRSeeder } from './INounsBRSeeder.sol';

interface INounsBRToken is IERC721 {
    event NounBRCreated(uint256 indexed tokenId, INounsBRSeeder.Seed seed);

    event NounBRBurned(uint256 indexed tokenId);

    event NoundersBRDAOUpdated(address noundersbrDAO);

    event MinterUpdated(address minter);

    event MinterLocked();

    event DescriptorUpdated(INounsBRDescriptorMinimal descriptor);

    event DescriptorLocked();

    event SeederUpdated(INounsBRSeeder seeder);

    event SeederLocked();

    function mint() external returns (uint256);

    function burn(uint256 tokenId) external;

    function dataURI(uint256 tokenId) external returns (string memory);

    function setNoundersBRDAO(address noundersbrDAO) external;

    function setMinter(address minter) external;

    function lockMinter() external;

    function setDescriptor(INounsBRDescriptorMinimal descriptor) external;

    function lockDescriptor() external;

    function setSeeder(INounsBRSeeder seeder) external;

    function lockSeeder() external;
}
