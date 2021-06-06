//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import { Counters } from "@openzeppelin/contracts/utils/Counters.sol";
import { INounsErc721 } from "./interfaces/INounsErc721.sol";
import "hardhat/console.sol";

contract NounsErc721 is INounsErc721, ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _nounIdTracker;

    constructor() ERC721('Nouns', 'NOUNS') {
        _setBaseURI('ipfs://');
    }

    /**
     * @notice Create an new Noun.
     * @dev Call ERC721 _mint with the current noun id and increment.
     * TODO randomness, de-dup
     */
    function createNoun() public override onlyOwner {
        uint256 nounId = _nounIdTracker.current();
        _nounIdTracker.increment();
        _mint(owner(), nounId);
    }
}
