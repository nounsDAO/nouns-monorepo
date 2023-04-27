// SPDX-License-Identifier: GPL-3.0

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

import { NounsTokenLike } from '../NounsDAOInterfaces.sol';

interface NounsDAOLike {
    function nouns() external view returns (NounsTokenLike);
}

contract NounsDAOSplitEscrow {

    address public immutable dao;
    NounsTokenLike public immutable nounsToken;

    uint32 splitId;

    /// @dev tokenId => OwnerInfo
    mapping(uint256 => OwnerInfo) public ownerOf;

    /// @dev splitId => count
    mapping(uint32 => uint256) public tokensInEscrowBySplitId;

    uint256 public numTokensOwnedByDAO;

    // TODO: events

    struct OwnerInfo {
        address owner;
        uint32 splitId;
    }

    error OnlyDAO();
    error NotOwner();
    error NotEscrowed();
    error InvalidSplitId();

    constructor(address dao_) {
        dao = dao_;
        nounsToken = NounsDAOLike(dao_).nouns();
    }

    modifier onlyDAO() {
        if (msg.sender != dao) {
            revert OnlyDAO();
        }
        _;
    }

    function markOwner(address owner, uint256[] calldata tokenIds) onlyDAO external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            ownerOf[tokenIds[i]] = OwnerInfo(owner, splitId);
        }
        tokensInEscrowBySplitId[splitId] += tokenIds.length;
    }

    function returnTokensToOwner(address owner, uint256[] calldata tokenIds) onlyDAO external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (currentOwnerOf(tokenIds[i]) != owner) revert NotOwner();

            nounsToken.transferFrom(address(this), owner, tokenIds[i]);
            delete ownerOf[tokenIds[i]];
        }

        tokensInEscrowBySplitId[splitId] -= tokenIds.length;
    }

    function withdrawTokensToDAO(uint256[] calldata tokenIds, address to) onlyDAO external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (currentOwnerOf(tokenIds[i]) != dao) revert NotOwner();

            delete ownerOf[tokenIds[i]];
            nounsToken.transferFrom(address(this), to, tokenIds[i]);
        }

        numTokensOwnedByDAO -= tokenIds.length;
    }

    function closeEscrow() onlyDAO external {
        numTokensOwnedByDAO += tokensInEscrowBySplitId[splitId];
        tokensInEscrowBySplitId[splitId] = 0; // TODO: is this needed?
        splitId++;
    }

    function numTokensInEscrow() external view returns (uint256) {
        return tokensInEscrowBySplitId[splitId];
    }

    /// @dev returns address(0) if this tokenId is not registered as escrowed
    function currentOwnerOf(uint256 tokenId) public view returns (address) {
        OwnerInfo memory ownerInfo = ownerOf[tokenId];
        if (ownerInfo.owner == address(0)) return address(0);

        if (ownerInfo.splitId == splitId) {
            return ownerInfo.owner;
        } else {
            return dao;
        }
    }
}