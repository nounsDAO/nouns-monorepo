// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

/**
 * @title Interface for NounsErc721.
 */
interface INounsErc721 {
    event NounCreated(
        uint256 indexed tokenId
    );

    function createNoun() external;
}