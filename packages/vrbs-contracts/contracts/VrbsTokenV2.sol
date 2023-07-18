// SPDX-License-Identifier: GPL-3.0

/// @title The Vrbs ERC-721 token

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
import { IVrbsToken } from './interfaces/IVrbsToken.sol';
import { ERC721 } from './base/ERC721.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { IProxyRegistry } from './external/opensea/IProxyRegistry.sol';
// import "@openzeppelin/contracts/utils/Base64.sol";
import { Base64 } from 'base64-sol/base64.sol';
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// Import the library for the set data structure
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract VrbsTokenV2 is Ownable, ERC721Checkpointable {
      using Strings for uint256;

     event VrbCreated(uint256 indexed tokenId, ISeeder.Seed seed);

    event VrbBurned(uint256 indexed tokenId);

    event VrbsDAOUpdated(address vrbsDAO);

    event MinterUpdated(address minter);

    event MinterLocked();

    // Declare the set data structure
    EnumerableSet.UintSet mintedIds;

    // The vrbs DAO address (creators org)
    address public vrbsDAO;

    // Add a mapping to store base64 encoded SVGs
    mapping(uint256 => string) private _tokenSVGB64;

    // An address who has permissions to mint Vrbs
    address public minter;

    // The Vrbs token URI descriptor
    IDescriptorMinimal public descriptor;

    // The Vrbs token seeder
    ISeeder public seeder;

    // Whether the minter can be updated
    bool public isMinterLocked;

    // Whether the descriptor can be updated
    bool public isDescriptorLocked;

    // Whether the seeder can be updated
    bool public isSeederLocked;

    // The vrb seeds
    mapping(uint256 => ISeeder.Seed) public seeds;

    // The internal vrb ID tracker
    uint256 private _currenVrbId;

    // IPFS content hash of contract-level metadata
    string private _contractURIHash = 'QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX';

    // OpenSea's Proxy Registry
    IProxyRegistry public immutable proxyRegistry;

       string private _tokenURISuffix;
    string private _tokenBaseURI = "";

mapping(uint256 => bool) private _tokenIdMinted;
uint256[] private _existingTokenIds;


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
     * @notice Require that the sender is the vrbs DAO.
     */
    modifier onlyVrbsDAO() {
        require(msg.sender == vrbsDAO, 'Sender is not the vrbs DAO');
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
        address _vrbsDAO,
        address _minter,
        IProxyRegistry _proxyRegistry
    ) ERC721('Vrbs', 'Vrb') {
        vrbsDAO = _vrbsDAO;
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
    
function addToken(uint256 tokenId, string calldata svgB64) external onlyOwner {
    require(!_tokenIdMinted[tokenId], "Token ID is already minted");
    _tokenSVGB64[tokenId] = svgB64;
    _existingTokenIds.push(tokenId);
    _tokenIdMinted[tokenId] = true; // Set this token as minted
}

function setTokenSvg(uint256 tokenId, string calldata svgB64) external onlyOwner {
    require(_tokenIdMinted[tokenId], "Token ID does not exist");
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

// Modify the mint function
function mint() public onlyMinter returns (uint256) {
    // Check if there are any tokenIds left to mint
    require(_existingTokenIds.length > 0, "No token IDs left to mint");

    // Always mint the first tokenId in _existingTokenIds
    uint256 tokenIdToMint = _existingTokenIds[0];

    // Remove the tokenId from _existingTokenIds and mark it as minted
    _removeTokenId(tokenIdToMint);
    _tokenIdMinted[tokenIdToMint] = true;

    // Continue with your minting logic
    _mintTo(minter, tokenIdToMint);

    return tokenIdToMint;
}

// Helper function to remove a tokenId from _existingTokenIds
function _removeTokenId(uint256 tokenIdToRemove) private {
    for (uint256 i = 0; i < _existingTokenIds.length; i++) {
        if (_existingTokenIds[i] == tokenIdToRemove) {
            // If we find the tokenId, we move the last element into its place and then shorten the array by 1
            _existingTokenIds[i] = _existingTokenIds[_existingTokenIds.length - 1];
            _existingTokenIds.pop();
            return;
        }
    }
}

    /**
     * @notice Burn a vrb.
     */
    function burn(uint256 vrbId) public onlyMinter {
        _burn(vrbId);
        emit VrbBurned(vrbId);
    }


    /**
     * @notice Set the vrbs DAO.
     * @dev Only callable by the vrbs DAO when not locked.
     */
    function setVrbsDAO(address _vrbsDAO) external onlyVrbsDAO {
        vrbsDAO = _vrbsDAO;

        emit VrbsDAOUpdated(_vrbsDAO);
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
     * @notice Mint a vrb with `vrbId` to the provided `to` address.
     */
    function _mintTo(address to, uint256 vrbId) internal returns (uint256) {
       // ISeeder.Seed memory seed = seeds[vrbId] = seeder.generateSeed(vrbId, descriptor);

        _mint(owner(), to, vrbId);
      //  emit VrbCreated(vrbId, seed);

        return vrbId;
    }
}
