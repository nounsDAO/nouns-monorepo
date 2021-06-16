// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.5;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import {Counters} from '@openzeppelin/contracts/utils/Counters.sol';
import {INounsDescriptor} from './interfaces/INounsDescriptor.sol';
import {INounsERC721} from './interfaces/INounsERC721.sol';

contract NounsERC721 is INounsERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    INounsDescriptor public descriptor;

    Counters.Counter private _nounIdTracker;

    mapping(uint256 => uint256[5]) _seeds;

    constructor(INounsDescriptor _descriptor) ERC721('Nouns', 'NOUN') {
        descriptor = _descriptor;
    }

    /**
     * @notice Mint a Noun.
     * @dev Call ERC721 _mint with the current noun id and increment.
     * TODO randomness, de-dup
     */
    function mint() public override onlyOwner returns (uint256) {
        uint256 nounId = _nounIdTracker.current();
        _nounIdTracker.increment();

        _mint(owner(), nounId);
        emit NounCreated(nounId);

        return nounId;
    }

    /**
     * @notice Burn a noun.
     */
    function burn(uint256 nounId) public override onlyOwner {
        _burn(nounId);
        emit NounBurned(nounId);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return descriptor.tokenURI(tokenId, _seeds[tokenId]);
    }

    /**
     * @notice Set the token URI descriptor.
     * @dev Only callable by {TODO}.
     * TODO: Lock down function call, add ability to burn access.
     */
    function setDescriptor(INounsDescriptor _descriptor)
        external
        override
    {
        descriptor = _descriptor;

        emit DescriptorUpdated(_descriptor);
    }
}
