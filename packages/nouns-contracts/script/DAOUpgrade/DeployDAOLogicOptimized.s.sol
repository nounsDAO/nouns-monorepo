// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { NounsDAOLogicV3 } from '../../contracts/governance/NounsDAOLogicV3.sol';

contract DeployDAOLogicOptimized is Script {
    function run() public returns (NounsDAOLogicV3 daoLogic) {
        requireDefaultProfile();

        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');
        vm.startBroadcast(deployerKey);

        daoLogic = new NounsDAOLogicV3();

        vm.stopBroadcast();
    }

    function requireDefaultProfile() internal {
        string memory foundryProfile = vm.envOr('FOUNDRY_PROFILE', string('default'));
        console.log('foundry profile: ', foundryProfile);
        require(
            keccak256(abi.encodePacked(foundryProfile)) == keccak256(abi.encodePacked('default')),
            'foundry profile must be default to deploy optimized contracts'
        );
    }
}
