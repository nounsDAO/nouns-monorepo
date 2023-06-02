// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NSeeder

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

interface ISeeder {
    struct Accessory {
        uint16 accType;
        uint16 accId;
    }
    struct Seed {
        uint8 punkType;
        uint8 skinTone;
        Accessory[] accessories;
    }

    event ProbabilitiesLocked();

    function generateSeed(uint256 punkId, uint256 salt) external view returns (Seed memory);

    function lockSProbabilities() external;
}
