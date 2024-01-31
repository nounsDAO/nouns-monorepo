// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { NounsDAOLogicV3 } from '../../contracts/governance/NounsDAOLogicV3.sol';

contract DeployDAOV3LogicMainnet is Script {
    function run() public returns (NounsDAOLogicV3 daoLogic) {
        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');
        vm.startBroadcast(deployerKey);

        daoLogic = new NounsDAOLogicV3();

        vm.stopBroadcast();
    }
}
