// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';

abstract contract OptimizedScript is Script {
    function requireDefaultProfile() internal {
        string memory foundryProfile = vm.envOr('FOUNDRY_PROFILE', string('default'));
        console.log('foundry profile: ', foundryProfile);
        require(
            keccak256(abi.encodePacked(foundryProfile)) == keccak256(abi.encodePacked('default')),
            'foundry profile must be default to deploy optimized contracts'
        );
    }
}