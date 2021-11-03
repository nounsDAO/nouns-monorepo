// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

interface NounsTokenLike {
    function delegate(address delegatee) external;

    function balanceOf(address owner) external view returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);
}
