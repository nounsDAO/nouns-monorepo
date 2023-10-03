// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { NounsDAOLogicV3 } from '../../contracts/governance/NounsDAOLogicV3.sol';

abstract contract ProposeExecutorV3UpgradeBase is Script {
    uint256 proposerKey;
    string description;
    NounsDAOLogicV3 daoProxy;
    address executorProxy;
    address executorV3Impl;

    function run() public returns (uint256 proposalId) {
        vm.startBroadcast(proposerKey);

        uint8 numTxs = 1;
        address[] memory targets = new address[](numTxs);
        uint256[] memory values = new uint256[](numTxs);
        string[] memory signatures = new string[](numTxs);
        bytes[] memory calldatas = new bytes[](numTxs);

        // Upgrade to executor V3
        uint256 i = 0;
        targets[i] = executorProxy;
        values[i] = 0;
        signatures[i] = 'upgradeTo(address)';
        calldatas[i] = abi.encode(executorV3Impl);

        proposalId = daoProxy.propose(targets, values, signatures, calldatas, description);
        console.log('Proposed proposalId: %d', proposalId);

        vm.stopBroadcast();
    }
}
