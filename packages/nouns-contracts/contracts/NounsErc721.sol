// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import {Counters} from '@openzeppelin/contracts/utils/Counters.sol';
import {INounsERC721} from './interfaces/INounsERC721.sol';

contract NounsERC721 is INounsERC721, ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _nounIdTracker;

    constructor() ERC721('Nouns', 'NOUNS') {}

    /**
     * @dev Base URI for computing {tokenURI}. Empty by default, can be overriden
     * in child contracts.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return 'ipfs://';
    }

    /**
     * @notice Create an new Noun.
     * @dev Call ERC721 _mint with the current noun id and increment.
     * TODO randomness, de-dup
     */
    function createNoun() public override onlyOwner returns (uint256) {
        uint256 nounId = _nounIdTracker.current();
        _nounIdTracker.increment();

        _mint(owner(), nounId);
        emit NounCreated(nounId);

        return nounId;
    }
}
