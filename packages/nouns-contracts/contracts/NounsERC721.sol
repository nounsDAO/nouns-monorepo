// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.5;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ERC721Enumerable, ERC721 } from '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import { Counters } from '@openzeppelin/contracts/utils/Counters.sol';
import { INounsDescriptor } from './interfaces/INounsDescriptor.sol';
import { INounsERC721 } from './interfaces/INounsERC721.sol';

contract NounsERC721 is INounsERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    // The nounsDAO address (avatars org)
    address public immutable nounsDAO;

    // The Nouns token URI descriptor
    INounsDescriptor public descriptor;

    // Whether the descriptor can be updated
    bool public isDescriptorLocked;

    // The internal noun ID tracker
    Counters.Counter private _nounIdTracker;

    mapping(uint256 => uint256[4]) _seeds;

    /**
     * @notice Require that the descriptor has not been locked.
     */
    modifier whenDescriptorNotLocked() {
        require(!isDescriptorLocked, 'Descriptor is locked');
        _;
    }

    /**
     * @notice Require that the sender is the nounsDAO.
     */
    modifier onlyNounsDAO() {
        require(msg.sender == nounsDAO, 'Sender is not the nounsDAO');
        _;
    }

    constructor(address _nounsDAO, INounsDescriptor _descriptor) ERC721('Nouns', 'NOUN') {
        nounsDAO = _nounsDAO;
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
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return descriptor.tokenURI(tokenId, _seeds[tokenId]);
    }

    /**
     * @notice Set the token URI descriptor.
     * @dev Only callable by the nounsDAO.
     */
    function setDescriptor(INounsDescriptor _descriptor) external override onlyNounsDAO whenDescriptorNotLocked {
        descriptor = _descriptor;

        emit DescriptorUpdated(_descriptor);
    }

    /**
     * @notice Lock the descriptor.
     * @dev This cannot be reversed.
     */
    function lockDescriptor() external onlyNounsDAO whenDescriptorNotLocked {
        isDescriptorLocked = true;
    }
}
