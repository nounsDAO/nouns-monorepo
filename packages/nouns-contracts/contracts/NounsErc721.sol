//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract NounsErc721 is ERC721 {
  constructor() ERC721('Nouns', 'NOUNS') {
      _setBaseURI('ipfs://');
    }
}