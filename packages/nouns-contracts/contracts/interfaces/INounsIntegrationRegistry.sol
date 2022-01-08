// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NounsIntegrationRegistry

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

interface INounsIntegrationRegistry {
    event IntegrationAdded(bytes32 integrationId, address integration);
    event IntegrationRemoved(bytes32 integrationId, address integration);
    event IntegrationEdited(bytes32 integrationId, address oldIntegration, address newIntegration);

    function integrations(uint256) external view returns (address);

    function isIntegration(address integration) external view returns (bool);

    function addIntegration(bytes32 integrationId, address integration) external;

    function removeIntegration(bytes32 integrationId) external;

    function editIntegration(bytes32 integrationId, address integration) external;
}
