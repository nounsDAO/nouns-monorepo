// SPDX-License-Identifier: GPL-3.0

/// @title ERC-721 token

 

pragma solidity ^0.8.6;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ERC721Checkpointable } from './base/ERC721Checkpointable.sol';
import { ITokenDescriptor } from './interfaces/ITokenDescriptor.sol';
 
import { ITellerToken } from './interfaces/ITellerToken.sol';
import { ERC721 } from './base/ERC721.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { IProxyRegistry } from './external/opensea/IProxyRegistry.sol';

contract TellerToken is ITellerToken, Ownable, ERC721Checkpointable {
    
    // IPFS content hash of contract-level metadata
    string private _contractURIHash = 'QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX';


    // An address who has permissions to mint (auction house)
    address public minter;

    // The Teller token URI descriptor
    ITokenDescriptor public descriptor;

    // The Teller token seeder
    //ITokenSeeder public seeder;

    // Whether the minter can be updated
    bool public isMinterLocked;

    // Whether the descriptor can be updated
    bool public isDescriptorLocked;

    // Whether the seeder can be updated
    //bool public isSeederLocked;

    // The token seeds
    //mapping(uint256 => ITokenSeeder.Seed) public seeds;

    // The internal token ID tracker
    uint256 private _currentTokenId;

    
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
   /* modifier whenSeederNotLocked() {
        require(!isSeederLocked, 'Seeder is locked');
        _;
    }*/

   

    /**
     * @notice Require that the sender is the minter.
     */
    modifier onlyMinter() {
        require(msg.sender == minter, 'Sender is not the minter');
        _;
    }

    constructor(
        
        address _minter,
        ITokenDescriptor _descriptor,
        //ITokenSeeder _seeder,
        IProxyRegistry _proxyRegistry
    ) ERC721('TellerCard', 'TCARD') {
         
        minter = _minter;
        descriptor = _descriptor;
        //seeder = _seeder;
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
     * @notice Mint a token to the minter 
     * @dev Call _mintTo with the to address(es).
     */
    function mint() public override onlyMinter returns (uint256) {
        /*if (_currentTokenId <= 1820 && _currentTokenId % 10 == 0) {
            _mintTo(treasuryDAO, _currentTokenId++);
        }*/
        return _mintTo(minter, _currentTokenId++);
    }

    /**
     * @notice Burn a token.
     */
    function burn(uint256 tokenId) public override {
        require(ownerOf(tokenId) == msg.sender, 'TellerToken: You are not the owner.' );
        _burn(tokenId);
        emit TellerCardBurned(tokenId);
    }

    /**
     * @notice A distinct Uniform Resource Identifier (URI) for a given asset.
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), 'TellerToken: URI query for nonexistent token');
        return descriptor.tokenURI(tokenId);
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
    function setDescriptor(ITokenDescriptor _descriptor) external override onlyOwner whenDescriptorNotLocked {
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
    /*function setSeeder(ITokenSeeder _seeder) external override onlyOwner whenSeederNotLocked {
        seeder = _seeder;

        emit SeederUpdated(_seeder);
    }*/

    /**
     * @notice Lock the seeder.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
     /*
    function lockSeeder() external override onlyOwner whenSeederNotLocked {
        isSeederLocked = true;

        emit SeederLocked();
    }*/

    /**
     * @notice Mint a Token with `tokenId` to the provided `to` address.
     */
    function _mintTo(address to, uint256 tokenId) internal returns (uint256) {
        //ITokenSeeder.Seed memory seed = seeds[tokenId] = seeder.generateSeed(tokenId, descriptor);

        _mint(owner(), to, tokenId);
        emit TellerCardCreated(tokenId);

        return tokenId;
    }
}