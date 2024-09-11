// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../contracts/NounsToken.sol";
import "../contracts/NounsDescriptorV2.sol";
import "../contracts/NounsSeeder.sol";
import "../contracts/external/opensea/IProxyRegistry.sol";

contract DeployNounsToken is Script {
    function run() external {
        string memory privateKeyString = vm.envString("WALLET_PRIVATE_KEY");
        uint256 deployerPrivateKey = vm.parseUint(string(abi.encodePacked("0x", privateKeyString)));
        
        address deployer = vm.addr(deployerPrivateKey);
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);

        NounsDescriptorV2 descriptor = NounsDescriptorV2(0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9);
        NounsSeeder seeder = NounsSeeder(0xa513E6E4b8f2a923D98304ec87F64353C4D5C853);
        address noundersDAO = 0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82;
        address minter = 0x20DaB549138bE53dB98c962B568bA91F31FD3F8e;
        address proxyRegistryAddress = address(0);

        console.log("Descriptor:", address(descriptor));
        console.log("Seeder:", address(seeder));
        console.log("NoundersDAO:", noundersDAO);
        console.log("Minter:", minter);
        console.log("ProxyRegistry:", proxyRegistryAddress);

        console.log("Deploying NounsToken...");
        try new NounsToken(
            noundersDAO,
            minter,
            descriptor,
            seeder,
            IProxyRegistry(proxyRegistryAddress)
        ) returns (NounsToken nounsToken) {
            console.log("NounsToken deployed at:", address(nounsToken));
        } catch Error(string memory reason) {
            console.log("Deployment failed. Reason:", reason);
        } catch (bytes memory lowLevelData) {
            console.log("Deployment failed. Low-level error:");
            console.logBytes(lowLevelData);
        }

        vm.stopBroadcast();
    }
}