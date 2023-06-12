// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import { INounsDAOForkEscrow, NounsTokenLike } from '../../../contracts/governance/NounsDAOInterfaces.sol';

contract NounsDAOForkEscrowMock is INounsDAOForkEscrow {
    uint32 public forkId;
    address public dao;
    NounsTokenLike public nounsToken;

    /// @dev forkId => tokenId => owner
    mapping(uint32 => mapping(uint256 => address)) public escrowedTokensByForkId;

    constructor(
        uint32 forkId_,
        address dao_,
        NounsTokenLike nounsToken_
    ) {
        forkId = forkId_;
        dao = dao_;
        nounsToken = nounsToken_;
    }

    function markOwner(address owner, uint256[] calldata tokenIds) external {}

    function returnTokensToOwner(address owner, uint256[] calldata tokenIds) external {}

    function closeEscrow() external pure returns (uint32) {
        return 1;
    }

    function numTokensInEscrow() external view returns (uint256) {}

    function numTokensOwnedByDAO() external view returns (uint256) {}

    function withdrawTokens(uint256[] calldata tokenIds, address to) external {}

    function ownerOfEscrowedToken(uint32 forkId_, uint256 tokenId) external view returns (address) {
        return escrowedTokensByForkId[forkId_][tokenId];
    }

    function setOwnerOfTokens(address owner, uint256[] calldata tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; ++i) {
            escrowedTokensByForkId[forkId][tokenIds[i]] = owner;
        }
    }
}
