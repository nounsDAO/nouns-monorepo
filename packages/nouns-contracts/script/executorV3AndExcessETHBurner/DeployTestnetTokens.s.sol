// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Script.sol';
import { RocketETHTestnet } from '../../contracts/test/RocketETHTestnet.sol';
import { ERC20Testnet } from '../../contracts/test/ERC20Testnet.sol';

contract DeployTestnetTokens is Script {
    function run() public {
        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');
        address owner = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        ERC20Testnet stETH = new ERC20Testnet(owner, 'Test Staked Ether', 'stETH');
        RocketETHTestnet rETH = new RocketETHTestnet(owner);

        console.log('Owner: %s', owner);
        console.log('stETH: %s', address(stETH));
        console.log('rETH: %s', address(rETH));

        vm.stopBroadcast();
    }
}
