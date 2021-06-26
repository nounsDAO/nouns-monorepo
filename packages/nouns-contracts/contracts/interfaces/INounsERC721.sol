// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.6;

import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { INounsDescriptor } from './INounsDescriptor.sol';
import { INounsSeeder } from './INounsSeeder.sol';

/**
 * @title Interface for NounsERC721.
 */
interface INounsERC721 is IERC721 {
    event NounCreated(uint256 indexed tokenId, INounsSeeder.Seed seed);

    event NounBurned(uint256 indexed tokenId);

    event DescriptorUpdated(INounsDescriptor descriptor);

    event SeederUpdated(INounsSeeder seeder);

    function mint() external returns (uint256);

    function burn(uint256 tokenId) external;

    function dataURI(uint256 tokenId) external returns (string memory);

    function setDescriptor(INounsDescriptor descriptor) external;

    function lockDescriptor() external;

    function setSeeder(INounsSeeder seeder) external;

    function lockSeeder() external;
}
