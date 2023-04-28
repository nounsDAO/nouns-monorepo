// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import { ERC721 } from '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract ERC721Mock is ERC721 {
    constructor() ERC721('Mock', 'MOCK') {}

    function mint(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }
}