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


contract NToken is IToken, Ownable, ERC721Checkpointable {
    // The punkers address (creators org)
    address public punkers;

    // An address who has permissions to mint Punks
    address public minter;

    // The Punks token URI descriptor
    IDescriptorMinimal public descriptor;

    // The Punks token seeder
    ISeeder public seeder;

    mapping(bytes32 => uint256) seedHashes;

    // Whether the minter can be updated
    bool public isMinterLocked;

    // Whether the descriptor can be updated
    bool public isDescriptorLocked;

    // Whether the seeder can be updated
    bool public isSeederLocked;

    // Whether the owner can register OG Punk hashes
    bool public isRegisterOGHashesLocked;

    // Whether the owner can change metadata
    bool public isMetadataLocked;

    // The punk seeds
    /// @notice The value is the seed hash actually
    mapping(uint256 => bytes32) public seeds;

    // The internal punk ID tracker
    uint256 private _currentPunkId = 10_000;

    // IPFS content hash of contract-level metadata
    string private _contractURIHash = 'QmVgLtMuJ48EueJkqYokqNAGC7AMuknKxNb4AJSEzhUFoU';

    // Token name, a parent contract already declares _name
    string private __name;

    // Token symbol, a parent contract already declares _symbol
    string private __symbol;

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
     * @notice Require that registration of OG Punk hashes is not locked.
     */
    modifier whenRegisterOGHashesNotLocked() {
        require(!isRegisterOGHashesLocked, 'RegisterOGHashes is locked');
        _;
    }

    /**
     * @notice Require that metadata is not locked.
     */
    modifier whenMetadataNotLocked() {
        require(!isMetadataLocked, 'Metadata is locked');
        _;
    }

    /**
     * @notice Require that the sender is the punkers.
     */
    modifier onlyPunkers() {
        require(msg.sender == punkers, 'Sender is not the punkers');
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
        address _punkers,
        address _minter,
        IDescriptorMinimal _descriptor,
        ISeeder _seeder
    ) ERC721('', '') {
        punkers = _punkers;
        minter = _minter;
        descriptor = _descriptor;
        seeder = _seeder;
        __name = 'CRYPTOPUNKS';
        __symbol = '\u03FE';
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
     * @notice Mint a Punk to the minter, along with a possible Punkers reward
     * Punks. Punkers reward Punks are minted every 10 Punks, starting at 10000,
     * until 183 punkers Punks have been minted (5 years w/ 24 hour auctions).
     * @dev Call _mintTo with the to address(es).
     */
    function mint() public override onlyMinter returns (uint256) {
        // punk ids start with 10000
        if (_currentPunkId <= 11820 && _currentPunkId % 10 == 0) {
            _mintTo(punkers, _currentPunkId++);
        }
        return _mintTo(minter, _currentPunkId++);
    }

    /**
     * @notice Burn a punk.
     */
    function burn(uint256 punkId) public override onlyMinter {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), punkId), 'PunkToken: burn caller is not owner nor approved');
        _burn(punkId);
        emit PunkBurned(punkId);
    }

    /**
     * @notice A distinct Uniform Resource Identifier (URI) for a given asset.
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), 'PunkToken: URI query for nonexistent token');
        return descriptor.tokenURI(tokenId, _decodeSeedHash(seeds[tokenId]));
    }

    /**
     * @notice Similar to `tokenURI`, but always serves a base64 encoded data URI
     * with the JSON contents directly inlined.
     */
    function dataURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), 'PunkToken: URI query for nonexistent token');
        return descriptor.dataURI(tokenId, _decodeSeedHash(seeds[tokenId]));
    }

    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() public view virtual override returns (string memory) {
        return __name;
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() public view virtual override returns (string memory) {
        return __symbol;
    }

    /**
     * @notice Set the punkers.
     * @dev Only callable by the punkers when not locked.
     */
    function setPunkers(address _punkers) external override onlyPunkers {
        require(_punkers != address(0), "punkers cannot be null");

        punkers = _punkers;

        emit PunkersUpdated(_punkers);
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
     * @notice Lock the seeder.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
    function lockRegisterOGHashes() external override onlyOwner whenRegisterOGHashesNotLocked {
        isRegisterOGHashesLocked = true;

        emit RegisterOGHashesLocked();
    }

    function setName(string memory name_) external override onlyOwner whenMetadataNotLocked {
        __name = name_;

        emit MetadataUpdated(__name, __symbol);
    }

    function setSymbol(string memory symbol_) external override onlyOwner whenMetadataNotLocked {
        __symbol = symbol_;

        emit MetadataUpdated(__name, __symbol);
    }

    /**
     * @notice Lock the seeder.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
    function lockMetadata() external override onlyOwner whenMetadataNotLocked {
        isMetadataLocked = true;

        emit MetadataLocked();
    }

    /**
     * @dev calculates seed's hash.
     * Public for testing purposes.
     * Accessories are assumed to be sorted by accType!
     * This is not hash actually, rather encoding.
     * It is assumed that there is no more than 14 accessories on a punk, accType and accId does not exceed 255.
     */
    function calculateSeedHash(ISeeder.Seed memory seed) public pure returns (bytes32) {
        unchecked {
            // 1 is non zero marker - valid seedHash is never zero
            uint256 seedHash = 1 + (uint256(seed.punkType) << 8) + (uint256(seed.skinTone) << 16) + (seed.accessories.length << 24);
            assert(seed.accessories.length < 15); // max 14 accessories
            for (uint256 i = 0 ; i < seed.accessories.length ; i ++) {
                seedHash += (uint256(seed.accessories[i].accType) << (16*i + 32)) + (uint256(seed.accessories[i].accId) << (16*i + 40));
            }
            return bytes32(seedHash);
        }
    }

    function _decodeSeedHash(bytes32 seedHash) internal pure returns (ISeeder.Seed memory) {
        uint256 value = uint256(seedHash);
        ISeeder.Seed memory seed;

        // non zero marker goes on the first byte
        seed.punkType = uint8((value >> 8) & 0xff);
        seed.skinTone = uint8((value >> 16) & 0xff);
        seed.accessories = new ISeeder.Accessory[]((value >> 24) & 0xff);

        for(uint i = 0; i < seed.accessories.length; i ++) {
            seed.accessories[i].accType = uint16((value >> (16*i + 32)) & 0xff);
            seed.accessories[i].accId = uint16((value >> (16*i + 40)) & 0xff);
        }

        return seed;
    }

    /**
     * @notice Mint a Punk with `punkId` to the provided `to` address.
     */
    function _mintTo(address to, uint256 punkId) internal returns (uint256) {
        // with sorted accessories
        ISeeder.Seed memory seed = seeder.generateSeed(punkId, 0); // salt 0
        bytes32 seedHash = calculateSeedHash(seed);

        uint256 salt = 1;
        // there is little chance to enter the loop, the probability to make a few steps is almost astronomical
        // so the risk of high gas usage is accepted here
        while (seedHashes[seedHash] != 0) {
            seed = seeder.generateSeed(punkId, salt ++);
            seedHash = calculateSeedHash(seed);
        }

        seedHashes[seedHash] = punkId + 1; // handles tokenId == 0 case
        seeds[punkId] = seedHash;

        _mint(owner(), to, punkId);
        emit PunkCreated(punkId, seed);

        return punkId;
    }

    function registerOGHashes(bytes32[] calldata hashes) external onlyOwner whenRegisterOGHashesNotLocked {
        for(uint i = 0; i < hashes.length; i ++) {
            seedHashes[hashes[i]] = 1;
        }
    }

    function getPunk(uint punkId) external view returns (ISeeder.Seed memory) {
        return _decodeSeedHash(seeds[punkId]);
    }
}