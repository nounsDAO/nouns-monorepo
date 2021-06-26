// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.6;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ERC721Enumerable, ERC721 } from '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import { Counters } from '@openzeppelin/contracts/utils/Counters.sol';
import { INounsDescriptor } from './interfaces/INounsDescriptor.sol';
import { INounsSeeder } from './interfaces/INounsSeeder.sol';
import { INounsERC721 } from './interfaces/INounsERC721.sol';

contract NounsERC721 is INounsERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    // The nounsDAO address (avatars org)
    address public immutable nounsDAO;

    // The Nouns token URI descriptor
    INounsDescriptor public descriptor;

    // The Nouns token seeder
    INounsSeeder public seeder;

    // Whether the descriptor can be updated
    bool public isDescriptorLocked;

    // Whether the seeder can be updated
    bool public isSeederLocked;

    // The internal noun ID tracker
    Counters.Counter private _nounIdTracker;

    // The internal noun seeds
    mapping(uint256 => INounsSeeder.Seed) private _seeds;

    /**
     * @notice Require that the descriptor has not been locked.
     */
    modifier whenDescriptorNotLocked() {
        require(!isDescriptorLocked, 'Descriptor is locked');
        _;
    }

    /**
     * @notice Require that the seeder has not been locked.
     */
    modifier whenSeederNotLocked() {
        require(!isSeederLocked, 'Seeder is locked');
        _;
    }

    /**
     * @notice Require that the sender is the nounsDAO.
     */
    modifier onlyNounsDAO() {
        require(msg.sender == nounsDAO, 'Sender is not the nounsDAO');
        _;
    }

    constructor(
        address _nounsDAO,
        INounsDescriptor _descriptor,
        INounsSeeder _seeder
    ) ERC721('Nouns', 'NOUN') {
        nounsDAO = _nounsDAO;
        descriptor = _descriptor;
        seeder = _seeder;
    }

    /**
     * @notice Mint a Noun.
     * @dev Call ERC721 _mint with the current noun id and increment.
     */
    function mint() public override onlyOwner returns (uint256) {
        uint256 nounId = _nounIdTracker.current();
        _nounIdTracker.increment();

        INounsSeeder.Seed memory seed = _seeds[nounId] = seeder.generateSeed(nounId, descriptor);

        _mint(owner(), nounId);
        emit NounCreated(nounId, seed);

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
     * @notice A distinct Uniform Resource Identifier (URI) for a given asset.
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), 'NounsERC721: URI query for nonexistent token');
        return descriptor.tokenURI(tokenId, _seeds[tokenId]);
    }

    /**
     * @notice Similar to `tokenURI`, but always serves a base64 encoded data URI
     * with the JSON contents directly inlined.
     */
    function dataURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), 'NounsERC721: URI query for nonexistent token');
        return descriptor.dataURI(tokenId, _seeds[tokenId]);
    }

    /**
     * @notice Set the token URI descriptor.
     * @dev Only callable by the nounDAO when not locked.
     */
    function setDescriptor(INounsDescriptor _descriptor) external override onlyNounsDAO whenDescriptorNotLocked {
        descriptor = _descriptor;

        emit DescriptorUpdated(_descriptor);
    }

    /**
     * @notice Lock the descriptor.
     * @dev This cannot be reversed and is only callable by the nounDAO when not locked.
     */
    function lockDescriptor() external override onlyNounsDAO whenDescriptorNotLocked {
        isDescriptorLocked = true;
    }

    /**
     * @notice Set the token seeder.
     * @dev Only callable by the nounDAO when not locked.
     */
    function setSeeder(INounsSeeder _seeder) external override onlyNounsDAO whenSeederNotLocked {
        seeder = _seeder;

        emit SeederUpdated(_seeder);
    }

    /**
     * @notice Lock the seeder.
     * @dev This cannot be reversed and is only callable by the nounDAO when not locked.
     */
    function lockSeeder() external override onlyNounsDAO whenSeederNotLocked {
        isSeederLocked = true;
    }
}
