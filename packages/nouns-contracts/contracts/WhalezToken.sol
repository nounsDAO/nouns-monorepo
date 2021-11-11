// SPDX-License-Identifier: GPL-3.0

/// @title The Whales ERC-721 token

pragma solidity ^0.8.6;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { ERC721Enumerable } from './base/ERC721Enumerable.sol';
import { IERC721Enumerable } from '@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol';
import { IERC165 } from '@openzeppelin/contracts/utils/introspection/IERC165.sol';
import { IWhalezToken } from './interfaces/IWhalezToken.sol';
import { ERC721 } from './base/ERC721.sol';
import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { IProxyRegistry } from './external/opensea/IProxyRegistry.sol';

contract WhalezToken is IWhalezToken, Ownable, ERC721Enumerable {
    using Strings for uint256;

    // The diatom DAO address (creators org)
    address public diatomDAO;

    // An address who has permissions to mint Whales
    address public minter;

    // Whether the minter can be updated
    bool public isMinterLocked;

    // The internal whale ID tracker
    uint256 private _currentWhaleId;

    // OpenSea's Proxy Registry
    IProxyRegistry public immutable proxyRegistry;

    // IPFS content hash of contract-level metadata
    string private _contractURIHash = 'changeThis';

    // max supply
    uint256 private maxSupply;

    /**
     * @notice Require that the minter has not been locked.
     */
    modifier whenMinterNotLocked() {
        require(!isMinterLocked, 'Minter is locked');
        _;
    }

    /**
     * @notice Require that the sender is the diatom DAO.
     */
    modifier onlyDiatomDAO() {
        require(msg.sender == diatomDAO, 'Sender is not the diatom DAO');
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
        address _diatomDAO,
        address _minter,
        IProxyRegistry _proxyRegistry
    ) ERC721('whalez', 'WHALEZ') {
        diatomDAO = _diatomDAO;
        minter = _minter;
        proxyRegistry = _proxyRegistry;
        maxSupply = 50;
    }

    function getMaxSupply() external view override returns (uint256) {
        return maxSupply;
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
     * @notice Mint a Whale to the minter
     * @dev Call _mintTo with the to address(es).
     */
    function mint() public override onlyMinter returns (uint256) {
        _currentWhaleId = _currentWhaleId + 1;
        require(_currentWhaleId <= maxSupply, 'max supply reached');
        return _mintTo(minter, _currentWhaleId);
    }

    /**
     * @notice Burn a whale.
     */
    function burn(uint256 whaleId) public override onlyMinter {
        _burn(whaleId);
        emit WhaleBurned(whaleId);
    }

    /**
     * @dev overrides default base url
     */
    function _baseURI() internal pure override returns (string memory) {
        return 'ipfs://';
    }

    /**
     * @notice Set the diatom DAO.
     * @dev Only callable by the diatom DAO when not locked.
     */
    function setDiatomDAO(address _diatomDAO) external override onlyDiatomDAO {
        diatomDAO = _diatomDAO;

        emit DiatomDAOUpdated(_diatomDAO);
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
     * @notice Mint a Whale with `whaleId` to the provided `to` address.
     */
    function _mintTo(address to, uint256 whaleId) internal returns (uint256) {
        _mint(owner(), to, whaleId);
        emit WhaleCreated(whaleId);

        return whaleId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), 'WhalezToken: URI query for nonexistent token');
        return string(abi.encodePacked('ipfs://', _contractURIHash, '/', tokenId.toString()));
    }
}
