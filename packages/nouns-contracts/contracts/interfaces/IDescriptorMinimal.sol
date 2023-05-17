// SPDX-License-Identifier: GPL-3.0

/// @title Common interface for NounsDescriptor versions, as used by NounsToken and NounsSeeder.

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

import { ISeeder } from './ISeeder.sol';

interface IDescriptorMinimal {
    ///
    /// USED BY TOKEN
    ///

    function tokenURI(uint256 tokenId, ISeeder.Seed memory seed) external view returns (string memory);

    function dataURI(uint256 tokenId, ISeeder.Seed memory seed) external view returns (string memory);

    ///
    /// USED BY SEEDER
    ///

    function punkTypeCount() external view returns (uint256);
    function hatCount() external view returns (uint256);
    function hairCount() external view returns (uint256);
    function beardCount() external view returns (uint256);
    function eyesCount() external view returns (uint256);
    function glassesCount() external view returns (uint256);
    function gogglesCount() external view returns (uint256);
    function mouthCount() external view returns (uint256);
    function teethCount() external view returns (uint256);
    function lipsCount() external view returns (uint256);
    function neckCount() external view returns (uint256);
    function emotionCount() external view returns (uint256);
    function faceCount() external view returns (uint256);
    function earsCount() external view returns (uint256);
    function noseCount() external view returns (uint256);
    function cheeksCount() external view returns (uint256);
}
