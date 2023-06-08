// SPDX-License-Identifier: GPL-3.0

/// @title The N00uns ERC-721 token

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
import { IN00unsDescriptorMinimal } from './interfaces/IN00unsDescriptorMinimal.sol';
import { IN00unsSeeder } from './interfaces/IN00unsSeeder.sol';
import { IN00unsToken } from './interfaces/IN00unsToken.sol';
import { ERC721 } from './base/ERC721.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { IProxyRegistry } from './external/opensea/IProxyRegistry.sol';
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// Import the library for the set data structure
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract N00unsTokenv2 is Ownable, ERC721Checkpointable {
      using Strings for uint256;

     event N00unCreated(uint256 indexed tokenId, IN00unsSeeder.Seed seed);

    event N00unBurned(uint256 indexed tokenId);

    event N00undersDAOUpdated(address n00undersDAO);

    event MinterUpdated(address minter);

    event MinterLocked();

    // Declare the set data structure
    EnumerableSet.UintSet mintedIds;

    // The n00unders DAO address (creators org)
    address public n00undersDAO;

    // Add a mapping to store base64 encoded SVGs
    mapping(uint256 => string) private _tokenSVGB64;

    // An address who has permissions to mint N00uns
    address public minter;

    // The N00uns token URI descriptor
    IN00unsDescriptorMinimal public descriptor;

    // The N00uns token seeder
    IN00unsSeeder public seeder;

    // Whether the minter can be updated
    bool public isMinterLocked;

    // Whether the descriptor can be updated
    bool public isDescriptorLocked;

    // Whether the seeder can be updated
    bool public isSeederLocked;

    // The n00un seeds
    mapping(uint256 => IN00unsSeeder.Seed) public seeds;

    // The internal n00un ID tracker
    uint256 private _currentN00unId;

    // IPFS content hash of contract-level metadata
    string private _contractURIHash = 'QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX';

    // OpenSea's Proxy Registry
    IProxyRegistry public immutable proxyRegistry;

       string private _tokenURISuffix;
    string private _tokenBaseURI = "";


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
     * @notice Require that the sender is the n00unders DAO.
     */
    modifier onlyN00undersDAO() {
        require(msg.sender == n00undersDAO, 'Sender is not the n00unders DAO');
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
        address _n00undersDAO,
        address _minter,
        IProxyRegistry _proxyRegistry
    ) ERC721('N00uns', 'N00UN') {
        n00undersDAO = _n00undersDAO;
        minter = _minter;
      
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

       function svgToImageURI(string memory _svg) public pure returns (string memory){
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(_svg))));
        string memory imageURI = string(abi.encodePacked(baseURL, svgBase64Encoded));
        return imageURI;
    }
    
    function formatTokenURI(string memory _imageURI) public pure returns (string memory) {
        string memory baseURL = "data:application/json;base64,";
        return string(abi.encodePacked(
            baseURL,
            Base64.encode(
                bytes(abi.encodePacked(
                    '{"name": "SVG NFT", ', 
                    '"description": "An NFT based on SVG!", ', 
                    '"attributes": "", ', 
                    '"image": "', _imageURI, '"}'
                )
            ))
        ));
    }
    
      // Function to set SVG base64 for a tokenId
    function setTokenSVG(uint256 tokenId, string calldata svgB64) external onlyOwner {
        _tokenSVGB64[tokenId] = svgB64;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721) returns(string memory) {
        require(_exists(tokenId), "Cannot query non-existent token");

        // Check if this token has an SVG associated with it
        if (bytes(_tokenSVGB64[tokenId]).length > 0) {
            string memory imageURI = svgToImageURI(_tokenSVGB64[tokenId]);
            return formatTokenURI(imageURI);
        } else {
            return string(abi.encodePacked(_tokenBaseURI, tokenId.toString(), _tokenURISuffix
            ));
        }
    }

   // Generate a random number within a range
function random(uint256 _upper) internal view returns (uint256) {
    uint256 randomnumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % _upper;
    return randomnumber;
}

// Mint function
function mint() public onlyMinter returns (uint256) {
    // Generate a random tokenId that does not exist yet
    uint256 newTokenId = random(1e6); // Assuming a cap of 1 million tokens, adjust as needed
    while (EnumerableSet.contains(mintedIds, newTokenId)) {
        newTokenId = random(1e6);
    }
    
    // Add the tokenId to the set of mintedIds
    EnumerableSet.add(mintedIds, newTokenId);
    
    // Continue your minting logic with the newly generated tokenId
    if (newTokenId <= 1820 && newTokenId % 10 == 0) {
        _mintTo(n00undersDAO, newTokenId++);
    }
    return _mintTo(minter, newTokenId);
}

    /**
     * @notice Burn a n00un.
     */
    function burn(uint256 n00unId) public onlyMinter {
        _burn(n00unId);
        emit N00unBurned(n00unId);
    }


    /**
     * @notice Set the n00unders DAO.
     * @dev Only callable by the n00unders DAO when not locked.
     */
    function setN00undersDAO(address _n00undersDAO) external onlyN00undersDAO {
        n00undersDAO = _n00undersDAO;

        emit N00undersDAOUpdated(_n00undersDAO);
    }

    /**
     * @notice Set the token minter.
     * @dev Only callable by the owner when not locked.
     */
    function setMinter(address _minter) external  onlyOwner whenMinterNotLocked {
        minter = _minter;

        emit MinterUpdated(_minter);
    }

    /**
     * @notice Lock the minter.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
    function lockMinter() external  onlyOwner whenMinterNotLocked {
        isMinterLocked = true;

        emit MinterLocked();
    }

 

    /**
     * @notice Mint a N00un with `n00unId` to the provided `to` address.
     */
    function _mintTo(address to, uint256 n00unId) internal returns (uint256) {
       // IN00unsSeeder.Seed memory seed = seeds[n00unId] = seeder.generateSeed(n00unId, descriptor);

        _mint(owner(), to, n00unId);
      //  emit N00unCreated(n00unId, seed);

        return n00unId;
    }
}
