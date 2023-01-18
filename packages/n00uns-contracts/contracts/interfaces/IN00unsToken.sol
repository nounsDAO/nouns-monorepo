// SPDX-License-Identifier: GPL-3.0

/// @title Interface for N00unsToken

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
import { IN00unsDescriptorMinimal } from './IN00unsDescriptorMinimal.sol';
import { IN00unsSeeder } from './IN00unsSeeder.sol';

interface IN00unsToken is IERC721 {
    event N00unCreated(uint256 indexed tokenId, IN00unsSeeder.Seed seed);

    event N00unBurned(uint256 indexed tokenId);

    event N00undersDAOUpdated(address n00undersDAO);

    event MinterUpdated(address minter);

    event MinterLocked();

    event DescriptorUpdated(IN00unsDescriptorMinimal descriptor);

    event DescriptorLocked();

    event SeederUpdated(IN00unsSeeder seeder);

    event SeederLocked();

    function mint() external returns (uint256);

    function burn(uint256 tokenId) external;

    function dataURI(uint256 tokenId) external returns (string memory);

    function setN00undersDAO(address n00undersDAO) external;

    function setMinter(address minter) external;

    function lockMinter() external;

    function setDescriptor(IN00unsDescriptorMinimal descriptor) external;

    function lockDescriptor() external;

    function setSeeder(IN00unsSeeder seeder) external;

    function lockSeeder() external;
}
