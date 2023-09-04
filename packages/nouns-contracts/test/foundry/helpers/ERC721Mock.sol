// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import { ERC721 } from '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract ERC721Mock is ERC721 {
    constructor() ERC721('Mock', 'MOCK') {}

    uint256 counter;

    function mint(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }

    function mintBatch(address to, uint256 numTokens) external returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](numTokens);
        for (uint256 i = 0; i < numTokens; i++) {
            tokenIds[i] = counter;
            _mint(to, counter++);
        }
        return tokenIds;
    }
}
