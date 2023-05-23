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
import { IERC721Receiver } from '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';

contract NounsDAOForkEscrow is IERC721Receiver {
    address public immutable dao;
    NounsTokenLike public immutable nounsToken;

    uint32 public forkId;

    /// @dev forkId => tokenId => owner
    mapping(uint32 => mapping(uint256 => address)) public escrowedTokensByForkId;

    /// @notice Number of tokens in escrow contributing to the fork threshold. They can be unescrowed.
    uint256 public numTokensInEscrow;

    // TODO: events

    error OnlyDAO();
    error OnlyNounsToken();
    error NotOwner();

    constructor(address dao_, address nounsToken_) {
        dao = dao_;
        nounsToken = NounsTokenLike(nounsToken_);
    }

    modifier onlyDAO() {
        if (msg.sender != dao) {
            revert OnlyDAO();
        }
        _;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory
    ) public override returns (bytes4) {
        if (msg.sender != address(nounsToken)) revert OnlyNounsToken();
        if (operator != dao) revert OnlyDAO();

        escrowedTokensByForkId[forkId][tokenId] = from;

        numTokensInEscrow++;

        return IERC721Receiver.onERC721Received.selector;
    }

    function returnTokensToOwner(address owner, uint256[] calldata tokenIds) external onlyDAO {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (currentOwnerOf(tokenIds[i]) != owner) revert NotOwner();

            nounsToken.transferFrom(address(this), owner, tokenIds[i]);
            escrowedTokensByForkId[forkId][tokenIds[i]] = address(0);
        }

        numTokensInEscrow -= tokenIds.length;
    }

    function withdrawTokensToDAO(uint256[] calldata tokenIds, address to) external onlyDAO {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (currentOwnerOf(tokenIds[i]) != dao) revert NotOwner();

            nounsToken.transferFrom(address(this), to, tokenIds[i]);
        }
    }

    function closeEscrow() external onlyDAO returns (uint32 closedForkId) {
        numTokensInEscrow = 0;

        closedForkId = forkId;

        forkId++;
    }

    function numTokensOwnedByDAO() external view returns (uint256) {
        return nounsToken.balanceOf(address(this)) - numTokensInEscrow;
    }

    function ownerOfEscrowedToken(uint32 forkId_, uint256 tokenId) external view returns (address) {
        return escrowedTokensByForkId[forkId_][tokenId];
    }

    function currentOwnerOf(uint256 tokenId) public view returns (address) {
        address owner = escrowedTokensByForkId[forkId][tokenId];
        if (owner == address(0)) {
            return dao;
        } else {
            return owner;
        }
    }
}
