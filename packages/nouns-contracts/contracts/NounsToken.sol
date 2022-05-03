// SPDX-License-Identifier: GPL-3.0

/// @title The Nouns ERC-721 token

// TODO: Add NounsDAO tribute and upgrades made

pragma solidity ^0.8.6;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ERC721Checkpointable } from './base/ERC721Checkpointable.sol';
import { ERC721URIStorage } from './base/ERC721URIStorage.sol';
import { ERC721Enumerable } from './base/ERC721Enumerable.sol';
import { INounsDescriptor } from './interfaces/INounsDescriptor.sol';
import { INounsSeeder } from './interfaces/INounsSeeder.sol';
import { INounsToken } from './interfaces/INounsToken.sol';
import { ERC721 } from './base/ERC721.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { IProxyRegistry } from './external/opensea/IProxyRegistry.sol';
import '@openzeppelin/contracts/utils/introspection/ERC165.sol';

contract NounsToken is INounsToken, Ownable, ERC721URIStorage, ERC721Checkpointable {
    // The nounders DAO address (creators org)
    address public noundersDAO;

    // An address who has permissions to mint Noun
    address public minter;

    // An address who has permissions to update token URIs
    address public uriUpdater;

    // The Nouns token URI descriptor
    INounsDescriptor public descriptor;

    // The Nouns token seeder
    INounsSeeder public seeder;

    // Whether the minter can be updated
    bool public isMinterLocked;

    // Whether the uri updater can be updated
    bool public isUriUpdaterLocked;

    // Whether the descriptor can be updated
    bool public isDescriptorLocked;

    // Whether the seeder can be updated
    bool public isSeederLocked;

    // The nouns seeds
    mapping(uint256 => INounsSeeder.Seed) public seeds;

    // The internal nouns ID tracker
    uint256 private _currentNounsId;

    // IPFS content hash of contract-level metadata
    string private _contractURIHash = 'QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX';

    // OpenSea's Proxy Registry
    IProxyRegistry public immutable proxyRegistry;

    /**
     * @notice Require that the minter has not been locked.
     */
    modifier whenMinterNotLocked() {
        require(!isMinterLocked, 'Minter is locked');
        _;
    }

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
     * @notice Require that the seeder has not been locked.
     */
    modifier whenUriUpdaterNotLocked() {
        require(!isUriUpdaterLocked, 'URI Updater is locked');
        _;
    }

    /**
     * @notice Require that the sender is the nounders DAO.
     */
    modifier onlyNoundersDAO() {
        require(msg.sender == noundersDAO, 'Sender is not the nounders DAO');
        _;
    }

    /**
     * @notice Require that the sender is the minter.
     */
    modifier onlyMinter() {
        require(msg.sender == minter, 'Sender is not the minter');
        _;
    }

    /**
     * @notice Require that the sender is the uri updater.
     */
    modifier onlyUriUpdater() {
        require(msg.sender == uriUpdater, 'Sender is not the URI updater');
        _;
    }

    constructor(
        address _noundersDAO,
        address _minter,
        address _uriUpdater,
        INounsDescriptor _descriptor,
        INounsSeeder _seeder,
        IProxyRegistry _proxyRegistry
    ) ERC721('Nouns', 'NOUN') {
        noundersDAO = _noundersDAO;
        minter = _minter;
        uriUpdater = _uriUpdater;
        descriptor = _descriptor;
        seeder = _seeder;
        proxyRegistry = _proxyRegistry;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(IERC165, ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Checkpointable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
        ERC721URIStorage._burn(tokenId);
    }

    /**
     * @notice The IPFS URI of contract-level metadata.
     */
    function contractURI() public view returns (string memory) {
        return string(abi.encodePacked('ipfs://', _contractURIHash));
    }

    /**
     * @notice Set the _contractURIHash.
     * @dev Only callable by the owner.
     */
    function setContractURIHash(string memory newContractURIHash) external onlyOwner {
        _contractURIHash = newContractURIHash;
    }

    /**
     * @notice Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
     */
    function isApprovedForAll(address owner, address operator) public view override(IERC721, ERC721) returns (bool) {
        // Whitelist OpenSea proxy contract for easy trading.
        if (proxyRegistry.proxies(owner) == operator) {
            return true;
        }
        return super.isApprovedForAll(owner, operator);
    }

    /**
     * @notice Mint a Noun to the minter, along with a possible nounders reward
     * Nouns. Nounders reward Nouns are minted every 10 Nouns, starting at 0,
     * until 183 nounsder Nouns have been minted (5 years w/ 24 hour auctions).
     * @dev Call _mintTo with the to address(es).
     */
    function mint() public override onlyMinter returns (uint256) {
        if (_currentNounsId <= 1820 && _currentNounsId % 10 == 0) {
            _mintTo(noundersDAO, _currentNounsId++);
        }
        return _mintTo(minter, _currentNounsId++);
    }

    /**
     * @notice Burn a Noun.
     */
    function burn(uint256 nounId) public override onlyMinter {
        _burn(nounId);
        emit NounBurned(nounId);
    }

    /**
     * @notice A distinct Uniform Resource Identifier (URI) for a given asset.
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(tokenId), 'NounsToken: URI query for nonexistent token');
        return super.tokenURI(tokenId);
    }

    /**
     * @notice Set the nounders DAO.
     * @dev Only callable by the nounders DAO when not locked.
     */
    function setNoundersDAO(address _noundersDAO) external override onlyNoundersDAO {
        noundersDAO = _noundersDAO;

        emit NoundersDAOUpdated(_noundersDAO);
    }

    /**
     * @notice Set the token minter.
     * @dev Only callable by the owner when not locked.
     */
    function setMinter(address _minter) external override onlyOwner whenMinterNotLocked {
        minter = _minter;

        emit MinterUpdated(_minter);
    }

    /**
     * @notice Lock the minter.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
    function lockMinter() external override onlyOwner whenMinterNotLocked {
        isMinterLocked = true;

        emit MinterLocked();
    }

    /**
     * @notice Set the token minter.
     * @dev Only callable by the owner when not locked.
     */
    function setUriUpdater(address _updater) external override onlyOwner whenUriUpdaterNotLocked {
        uriUpdater = _updater;

        emit UriUpdaterUpdated(_updater);
    }

    function lockUriUpdater() external override onlyOwner whenUriUpdaterNotLocked {
        isUriUpdaterLocked = true;

        emit UriUpdaterLocked();
    }

    /**
     * @notice Set the token URI descriptor.
     * @dev Only callable by the owner when not locked.
     */
    function setDescriptor(INounsDescriptor _descriptor) external override onlyOwner whenDescriptorNotLocked {
        descriptor = _descriptor;

        emit DescriptorUpdated(_descriptor);
    }

    /**
     * @notice Lock the descriptor.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
    function lockDescriptor() external override onlyOwner whenDescriptorNotLocked {
        isDescriptorLocked = true;

        emit DescriptorLocked();
    }

    /**
     * @notice Set the token seeder.
     * @dev Only callable by the owner when not locked.
     */
    function setSeeder(INounsSeeder _seeder) external override onlyOwner whenSeederNotLocked {
        seeder = _seeder;

        emit SeederUpdated(_seeder);
    }

    /**
     * @notice Lock the seeder.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
    function lockSeeder() external override onlyOwner whenSeederNotLocked {
        isSeederLocked = true;

        emit SeederLocked();
    }

    /**
     * @notice Set the token URI of provided tokenId
     * @dev See {ERC721URIStorage-_setTokenURI}
     */
    function setTokenURI(uint256 tokenId, string memory uri) external onlyUriUpdater {
        require(_exists(tokenId), 'NounsToken: URI set for nonexistent token');
        super._setTokenURI(tokenId, uri);

        emit TokenUriSet(tokenId, uri);
    }

    /**
     * @notice Mint a Noun with `nounId` to the provided `to` address.
     */
    function _mintTo(address to, uint256 nounId) internal returns (uint256) {
        INounsSeeder.Seed memory seed = seeds[nounId] = seeder.generateSeed(nounId, descriptor);

        _mint(owner(), to, nounId);
        emit NounCreated(nounId, seed);

        return nounId;
    }
}
