// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';

/**
 * @title Interface for NounsERC721.
 */
interface INounsERC721 is IERC721 {
    event NounCreated(uint256 indexed tokenId);

    event NounBurned(uint256 indexed tokenId);

    function mint() external returns (uint256);

    function burn(uint256 tokenId) external;
}
