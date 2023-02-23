// SPDX-License-Identifier: GPL-3.0

/// @title The Punks ERC-721 token

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░██░░░████░░██░░░████░░░ *
 * ░░██████░░░████████░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 *********************************/

pragma solidity ^0.8.6;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ERC721Checkpointable } from './base/ERC721Checkpointable.sol';
import { IDescriptorMinimal } from './interfaces/IDescriptorMinimal.sol';
import { ISeeder } from './interfaces/ISeeder.sol';
import { IToken } from './interfaces/IToken.sol';
import { ERC721 } from './base/ERC721.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { IProxyRegistry } from './external/opensea/IProxyRegistry.sol';


contract NToken is IToken, Ownable, ERC721Checkpointable {
    // The punkers DAO address (creators org)
    address public punkersDAO;

    // An address who has permissions to mint Punks
    address public minter;

    // The Punks token URI descriptor
    IDescriptorMinimal public descriptor;

    // The Punks token seeder
    ISeeder public seeder;
    mapping(bytes32 => uint) seedHashes;

    // Whether the minter can be updated
    bool public isMinterLocked;

    // Whether the descriptor can be updated
    bool public isDescriptorLocked;

    // Whether the seeder can be updated
    bool public isSeederLocked;

    // The punk seeds
    mapping(uint256 => ISeeder.Seed) public seeds;

    // The internal punk ID tracker
    uint256 private _currentPunkId;

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
     * @notice Require that the sender is the punkers DAO.
     */
    modifier onlyPunkersDAO() {
        require(msg.sender == punkersDAO, 'Sender is not the punkers DAO');
        _;
    }

    /**
     * @notice Require that the sender is the minter.
     */
    modifier onlyMinter() {
        require(msg.sender == minter, 'Sender is not the minter');
        _;
    }

    constructor(
        address _punkersDAO,
        address _minter,
        IDescriptorMinimal _descriptor,
        ISeeder _seeder,
        IProxyRegistry _proxyRegistry
    ) ERC721('Cryptopunks', 'PUNK') {
        punkersDAO = _punkersDAO;
        minter = _minter;
        descriptor = _descriptor;
        seeder = _seeder;
        proxyRegistry = _proxyRegistry;
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
     * @notice Mint a Punk to the minter, along with a possible Punkers reward
     * Punks. Punkers reward Punks are minted every 10 Punks, starting at 0,
     * until 183 punkers Punks have been minted (5 years w/ 24 hour auctions).
     * @dev Call _mintTo with the to address(es).
     */
    function mint() public override onlyMinter returns (uint256) {
        if (_currentPunkId <= 1820 && _currentPunkId % 10 == 0) {
            _mintTo(punkersDAO, _currentPunkId++);
        }
        return _mintTo(minter, _currentPunkId++);
    }

    /**
     * @notice Burn a punk.
     */
    function burn(uint256 punkId) public override onlyMinter {
        _burn(punkId);
        emit PunkBurned(punkId);
    }

    /**
     * @notice A distinct Uniform Resource Identifier (URI) for a given asset.
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), 'PunkToken: URI query for nonexistent token');
        return descriptor.tokenURI(tokenId, seeds[tokenId]);
    }

    /**
     * @notice Similar to `tokenURI`, but always serves a base64 encoded data URI
     * with the JSON contents directly inlined.
     */
    function dataURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), 'PunkToken: URI query for nonexistent token');
        return descriptor.dataURI(tokenId, seeds[tokenId]);
    }

    /**
     * @notice Set the punkers DAO.
     * @dev Only callable by the punkers DAO when not locked.
     */
    function setPunkersDAO(address _punkersDAO) external override onlyPunkersDAO {
        punkersDAO = _punkersDAO;

        emit PunkersDAOUpdated(_punkersDAO);
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
     * @notice Set the token URI descriptor.
     * @dev Only callable by the owner when not locked.
     */
    function setDescriptor(IDescriptorMinimal _descriptor) external override onlyOwner whenDescriptorNotLocked {
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
    function setSeeder(ISeeder _seeder) external override onlyOwner whenSeederNotLocked {
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
     * @notice Mint a Punk with `punkId` to the provided `to` address.
     */
    function _mintTo(address to, uint256 punkId) internal returns (uint256) {
        ISeeder.Seed memory seed = seeder.generateSeed(punkId);
        seeds[punkId].punkType = seed.punkType;
        seeds[punkId].skinTone = seed.skinTone;
            
        for(uint i = 0; i < seed.accessories.length; i ++) {
            seeds[punkId].accessories.push(ISeeder.Accessory({
                accType: seed.accessories[i].accType,
                accId: seed.accessories[i].accId
            }));
        }
        
        bytes32 seedHash;
        assembly {
            let accLen := mload(seed)
            seedHash := keccak256(seed, add(0x60, mul(accLen, 0x40)))
        }
//        require(seedHashes[seedHash] == 0, "Already minted"); //TODO seedHash calculation is incorrect
        seedHashes[seedHash] = 1;

        _mint(owner(), to, punkId);
        emit PunkCreated(punkId, seed);

        return punkId;
    }

    function registerOGHashes(bytes32[] calldata hashes) external onlyOwner {
        for(uint i = 0; i < hashes.length; i ++) {
            seedHashes[hashes[i]] = 1;
        }
    }
    function getPunk(uint punkId) external view returns (ISeeder.Seed memory) {
        ISeeder.Seed memory seed;
        seed.punkType = seeds[punkId].punkType;
        seed.skinTone = seeds[punkId].skinTone;
        seed.accessories = new ISeeder.Accessory[](seeds[punkId].accessories.length);

        for(uint i = 0; i < seeds[punkId].accessories.length; i ++) {
            seed.accessories[i].accType = seeds[punkId].accessories[i].accType;
            seed.accessories[i].accId = seeds[punkId].accessories[i].accId;
        }

        return seed;
    }
}