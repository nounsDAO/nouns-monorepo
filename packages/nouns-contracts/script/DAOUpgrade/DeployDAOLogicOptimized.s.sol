// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { OptimizedScript } from '../OptimizedScript.s.sol';
import { NounsDAOLogicV4 } from '../../contracts/governance/NounsDAOLogicV4.sol';

contract DeployDAOLogicOptimized is OptimizedScript {
    function run() public returns (NounsDAOLogicV4 daoLogic) {
        requireDefaultProfile();

        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');
        vm.startBroadcast(deployerKey);

        daoLogic = new NounsDAOLogicV4();

        vm.stopBroadcast();
    }
}
