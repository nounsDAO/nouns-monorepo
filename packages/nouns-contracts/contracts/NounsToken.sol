// SPDX-License-Identifier: GPL-3.0

/// @title The NounsBR ERC-721 token

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
import { INounsBRDescriptorMinimal } from './interfaces/INounsBRDescriptorMinimal.sol';
import { INounsBRSeeder } from './interfaces/INounsBRSeeder.sol';
import { INounsBRToken } from './interfaces/INounsBRToken.sol';
import { ERC721 } from './base/ERC721.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { IProxyRegistry } from './external/opensea/IProxyRegistry.sol';

contract NounsBRToken is INounsBRToken, Ownable, ERC721Checkpointable {
    // The noundersbr DAO address (creators org)
    address public noundersbrDAO;

    // An address who has permissions to mint NounsBR
    address public minter;

    // The NounsBR token URI descriptor
    INounsBRDescriptorMinimal public descriptor;

    // The NounsBR token seeder
    INounsBRSeeder public seeder;

    // Whether the minter can be updated
    bool public isMinterLocked;

    // Whether the descriptor can be updated
    bool public isDescriptorLocked;

    // Whether the seeder can be updated
    bool public isSeederLocked;

    // The nounbr seeds
    mapping(uint256 => INounsBRSeeder.Seed) public seeds;

    // The internal nounbr ID tracker
    uint256 private _currentNounBRId;

    // IPFS content hash of contract-level metadata
    string private _contractURIHash = 'bafkreidlljxwtx4a26kkapf3gxnrfho2lug3vwlbrmztb5rsyubw3fvpce';

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
     * @notice Require that the sender is the noundersbr DAO.
     */
    modifier onlyNoundersBRBRDAO() {
        require(msg.sender == noundersbrDAO, 'Sender is not the noundersbr DAO');
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
        address _noundersbrDAO,
        address _minter,
        INounsBRDescriptorMinimal _descriptor,
        INounsBRSeeder _seeder,
        IProxyRegistry _proxyRegistry
    ) ERC721('NounsBR', 'NOUNBR') {
        noundersbrDAO = _noundersbrDAO;
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
     * @notice Mint a NounBR to the minter, along with a possible noundersbr reward
     * NounBR. NoundersBRBR reward NounsBR are minted every 10 NounsBR, starting at 0,
     * until 175201 nounderbr NounsBR have been minted (5 years w/ 15 minutes auctions).
     * @dev Call _mintTo with the to address(es).
     */
    function mint() public override onlyMinter returns (uint256) {
        if (_currentNounBRId <= 175200 && _currentNounBRId % 10 == 0) {
            _mintTo(noundersbrDAO, _currentNounBRId++);
        }
        return _mintTo(minter, _currentNounBRId++);
    }

    /**
     * @notice Burn a nounbr.
     */
    function burn(uint256 nounbrId) public override onlyMinter {
        _burn(nounbrId);
        emit NounBRBurned(nounbrId);
    }

    /**
     * @notice A distinct Uniform Resource Identifier (URI) for a given asset.
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), 'NounsBRToken: URI query for nonexistent token');
        return descriptor.tokenURI(tokenId, seeds[tokenId]);
    }

    /**
     * @notice Similar to `tokenURI`, but always serves a base64 encoded data URI
     * with the JSON contents directly inlined.
     */
    function dataURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), 'NounsBRToken: URI query for nonexistent token');
        return descriptor.dataURI(tokenId, seeds[tokenId]);
    }

    /**
     * @notice Set the noundersbr DAO.
     * @dev Only callable by the noundersbr DAO when not locked.
     */
    function setNoundersBRBRDAO(address _noundersbrDAO) external override onlyNoundersBRBRDAO {
        noundersbrDAO = _noundersbrDAO;

        emit NoundersBRBRDAOUpdated(_noundersbrDAO);
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
    function setDescriptor(INounsBRDescriptorMinimal _descriptor) external override onlyOwner whenDescriptorNotLocked {
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
    function setSeeder(INounsBRSeeder _seeder) external override onlyOwner whenSeederNotLocked {
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
     * @notice Mint a NounBR with `nounbrId` to the provided `to` address.
     */
    function _mintTo(address to, uint256 nounbrId) internal returns (uint256) {
        INounsBRSeeder.Seed memory seed = seeds[nounbrId] = seeder.generateSeed(nounbrId, descriptor);

        _mint(owner(), to, nounbrId);
        emit NounBRCreated(nounbrId, seed);

        return nounbrId;
    }
}
