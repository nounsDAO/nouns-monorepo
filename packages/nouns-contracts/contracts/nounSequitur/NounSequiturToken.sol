// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NounSequiturToken
/// Based on NounsDAO

// @krel img here

pragma solidity ^0.8.6;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ERC721Checkpointable } from './../base/ERC721Checkpointable.sol';
import { INounSequiturToken } from './interfaces/INounSequiturToken.sol';
// `_safeMint` and `_mint` contain an additional `creator` argument and
// emit two `Transfer` logs, rather than one
import { ERC721 } from './../base/ERC721.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { IProxyRegistry } from './../external/opensea/IProxyRegistry.sol';

// TODO: @enx ERC721Checkpointable ?
contract NounSequiturToken is INounSequiturToken, Ownable, ERC721Checkpointable {
    // The noun sequiturs DAO address (creators org)
    address public soundersDAO;

    // An address who has permissions to mint NounSequiturs
    address public minter;

    // Whether the minter can be updated
    bool public isMinterLocked;

    // The internal noun sequitur ID tracker
    uint256 private _currentNounSequiturId;

    // IPFS content hash of contract-level metadata
    string private _contractURIHash = 'QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX'; // TODO: @enx

    // OpenSea's Proxy Registry
    IProxyRegistry public proxyRegistry;

    /**
     * @notice Require that the minter has not been locked.
     */
    modifier whenMinterNotLocked() {
        require(!isMinterLocked, 'Minter is locked');
        _;
    }

    /**
     * @notice Require that the sender is the Noun Sequitur Founders DAO.
     */
    modifier onlySoundersDAO() {
        require(msg.sender == soundersDAO, 'Sender is not the Noun Sequitur Founders DAO');
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
     * @notice Construct a new NounSequiturToken contract.
     * @param _proxyRegistry The address of the OpenSea proxy registry.
     */
    constructor(
        address _soundersDAO,
        address _minter,
        IProxyRegistry _proxyRegistry
    ) ERC721('Noun Sequiturs', 'NOUNSEQUITER') {
        soundersDAO = _soundersDAO;
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

    /**
     * @notice Mint a Noun Sequitur to the minter, along with a possible noun sequitur founders
     * reward Noun Sequitur. Noun Sequitur Founders reward Noun Sequitur are minted every 10 Nouns, starting at 0,
     * until 183 nounder Noun Sequiturs have been minted (5 years w/ 24 hour auctions).
     * @dev Call _mintTo with the to address(es).
     */
    function mint() public override onlyMinter returns (uint256) {
        if (_currentNounSequiturId <= 1820 && _currentNounSequiturId % 10 == 0) {
            _mintTo(soundersDAO, _currentNounSequiturId++);
        }
        return _mintTo(minter, _currentNounSequiturId++);
    }

    /**
     * @notice Burn a Noun Sequitur.
     */
    function burn(uint256 tokenId) public override onlyMinter {
        _burn(tokenId);
        emit NounSequiturBurned(tokenId);
    }

    /**
     * @notice Set the sounders DAO.
     * @dev Only callable by the nounders DAO when not locked.
     */
    function setNounSequiturFoundersDAO(address _soundersDAO) external override onlySoundersDAO {
        soundersDAO = _soundersDAO;

        emit NounSequiturFoundersDAOUpdated(_soundersDAO);
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
     * @notice Mint a Noun Sequitur with `nounSequiturId` to the provided `to` address.
     */
    function _mintTo(address to, uint256 nounSequiturId) internal returns (uint256) {
        _mint(owner(), to, nounSequiturId);

        emit NounSequiturCreated(nounSequiturId);

        return nounSequiturId;
    }
}
