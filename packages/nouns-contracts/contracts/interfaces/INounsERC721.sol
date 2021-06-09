// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {IERC721Metadata} from '@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol';
import {IERC721Enumerable} from '@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol';

/**
 * @title Interface for NounsERC721.
 */
interface INounsERC721 is IERC721, IERC721Metadata, IERC721Enumerable {
    event NounCreated(uint256 indexed tokenId);

    event NounBurned(uint256 indexed tokenId);

    function mint() external returns (uint256);

    function burn(uint256 tokenId) external;
}
