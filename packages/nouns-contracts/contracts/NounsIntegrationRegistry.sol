// SPDX-License-Identifier: GPL-3.0

/// @title The Nouns Integration Registry

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

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { INounsIntegrationRegistry } from './interfaces/INounsIntegrationRegistry.sol';
import { AddressArrayUtils } from './libs/AddressArrayUtils.sol';

contract NounsIntegrationRegistry is INounsIntegrationRegistry, Ownable {
    using AddressArrayUtils for address[];

    // Integrations
    address[] public integrations;
    mapping(address => bool) public isIntegration;
    mapping(bytes32 => address) private _integrationIds;

    /**
     * Set the owner on deployment
     * @param owner Address of the initial owner
     */
    constructor(address owner) {
        transferOwnership(owner);
    }

    /**
     * Add a new integration
     * @param integrationId The integration id
     * @param integration The integration contract to add
     */
    function addIntegration(bytes32 integrationId, address integration) external onlyOwner {
        require(!isIntegration[integration], 'Integration already exists');
        require(_integrationIds[integrationId] == address(0), 'Integration ID already exists');
        require(integration != address(0), 'Integration address cannot be empty');

        isIntegration[integration] = true;
        integrations.push(integration);
        _integrationIds[integrationId] = integration;

        emit IntegrationAdded(integrationId, integration);
    }

    /**
     * Remove an existing integration
     * @param integrationId The integration id
     */
    function removeIntegration(bytes32 integrationId) external onlyOwner {
        address integrationToRemove = _integrationIds[integrationId];
        require(integrationToRemove != address(0), 'Integration does not exist');

        isIntegration[integrationToRemove] = false;
        integrations = integrations.remove(integrationToRemove);
        delete _integrationIds[integrationId];

        emit IntegrationRemoved(integrationId, integrationToRemove);
    }

    /**
     * Edit an existing integration
     * @param integrationId The integration id
     * @param integration The integration contract to edit
     */
    function editIntegration(bytes32 integrationId, address integration) external onlyOwner {
        address integrationToReplace = _integrationIds[integrationId];

        require(!isIntegration[integration], 'Integration already exists');
        require(integrationToReplace != address(0), 'Integration ID does not exist');
        require(integration != address(0), 'Integration address cannot be empty');

        isIntegration[integrationToReplace] = false;
        integrations = integrations.remove(integrationToReplace);

        isIntegration[integration] = true;
        integrations.push(integration);
        _integrationIds[integrationId] = integration;

        emit IntegrationEdited(integrationId, integrationToReplace, integration);
    }
}
