// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.5;

import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {INounsDescriptor} from './INounsDescriptor.sol';

/**
 * @title Interface for NounsERC721.
 */
interface INounsERC721 is IERC721 {
    event NounCreated(uint256 indexed tokenId);

    event NounBurned(uint256 indexed tokenId);

    event DescriptorUpdated(INounsDescriptor descriptor);

    function mint() external returns (uint256);

    function burn(uint256 tokenId) external;

    function setDescriptor(INounsDescriptor descriptor) external;
}
