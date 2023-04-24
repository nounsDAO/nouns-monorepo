// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import { NounsTokenLike } from '../../../contracts/governance/NounsDAOInterfaces.sol';

contract NounsTokenLikeMock is NounsTokenLike {
    mapping(address => mapping(uint256 => uint96)) priorVotes;

    function getPriorVotes(address account, uint256 blockNumber) external view returns (uint96) {
        return priorVotes[account][blockNumber];
    }

    function totalSupply() external pure returns (uint256) {
        return 0;
    }

    function setPriorVotes(
        address account,
        uint256 blockNumber,
        uint96 votes
    ) external {
        priorVotes[account][blockNumber] = votes;
    }

    function transferFrom(address from, address to, uint256 tokenId) external {
        // noop
    }
}
