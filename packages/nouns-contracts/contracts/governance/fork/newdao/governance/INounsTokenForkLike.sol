// SPDX-License-Identifier: BSD-3-Clause

pragma solidity ^0.8.19;

interface INounsTokenForkLike {
    function getPriorVotes(address account, uint256 blockNumber) external view returns (uint96);

    function totalSupply() external view returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function balanceOf(address owner) external view returns (uint256 balance);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function remainingTokensToClaim() external view returns (uint256);

    function forkingPeriodEndTimestamp() external view returns (uint256);
}
