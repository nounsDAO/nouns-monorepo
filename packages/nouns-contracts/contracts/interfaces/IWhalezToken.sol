// SPDX-License-Identifier: GPL-3.0

/// @title Interface for WhalezToken

pragma solidity ^0.8.6;

import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface IWhalezToken is IERC721 {
    event WhaleCreated(uint256 indexed tokenId);

    event WhaleBurned(uint256 indexed tokenId);

    event DiatomDAOUpdated(address diatomDAO);

    event MinterUpdated(address minter);

    event MinterLocked();

    function getMaxSupply() external view returns (uint256);

    function mint(string memory tokenId) external returns (uint256);

    function burn(uint256 tokenId) external;

    function setDiatomDAO(address diatomDAO) external;

    function setMinter(address minter) external;

    function lockMinter() external;
}
