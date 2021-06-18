// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.5;

/**
 * @title Interface for NounsDescriptor.
 */
interface INounsDescriptor {
    function nounsDAO() external returns (address);

    function isLocked() external returns (bool);

    function tokenURI(uint256 tokenId, uint256[5] memory seed)
        external
        view
        returns (string memory);

    function palettes(uint8 paletteIndex, uint256 colorIndex)
        external
        view
        returns (string memory);

    function bodies(uint256 index) external view returns (bytes memory);

    function accessories(uint256 index) external view returns (bytes memory);

    function heads(uint256 index) external view returns (bytes memory);

    function glasses(uint256 index) external view returns (bytes memory);

    function arms(uint256 index) external view returns (bytes memory);
}
