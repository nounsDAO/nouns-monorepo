// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../contracts/NounsAuctionHouse.sol";
import "../contracts/NounsToken.sol";
import "../contracts/NounsDescriptorV2.sol";
import "../contracts/NounsSeeder.sol";
import "../contracts/external/opensea/IProxyRegistry.sol";

contract DeployNounsAuctionHouse is Script {
    function run() external {
        string memory privateKeyString = vm.envString("WALLET_PRIVATE_KEY");
        uint256 deployerPrivateKey = vm.parseUint(string(abi.encodePacked("0x", privateKeyString)));
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract without constructor arguments
        NounsAuctionHouse auctionHouse = new NounsAuctionHouse();
        
        console.log("NounsAuctionHouse deployed at:", address(auctionHouse));

        NounsDescriptorV2 descriptor = NounsDescriptorV2(0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9);
        NounsSeeder seeder = NounsSeeder(0xa513E6E4b8f2a923D98304ec87F64353C4D5C853);
        address noundersDAO = 0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82;
        address minter = address(auctionHouse);
        address proxyRegistryAddress = address(0);

        console.log("Descriptor:", address(descriptor));
        console.log("Seeder:", address(seeder));
        console.log("NoundersDAO:", noundersDAO);
        console.log("Minter:", minter);
        console.log("ProxyRegistry:", proxyRegistryAddress);

        console.log("Deploying NounsToken...");

        NounsToken nouns = new NounsToken(
            noundersDAO,
            minter,
            descriptor,
            seeder,
            IProxyRegistry(proxyRegistryAddress)
        );

        // try new NounsToken(
        //     noundersDAO,
        //     minter,
        //     descriptor,
        //     seeder,
        //     IProxyRegistry(proxyRegistryAddress)
        // ) returns (NounsToken nouns) {
        //     console.log("NounsToken deployed at:", address(nouns));
        // } catch Error(string memory reason) {
        //     console.log("Deployment failed. Reason:", reason);
        // } catch (bytes memory lowLevelData) {
        //     console.log("Deployment failed. Low-level error:");
        //     console.logBytes(lowLevelData);
        // }
    
        address weth = 0x7507c1dc16935B82698e4C63f2746A2fCf994dF8; // Replace with actual WETH address
        uint256 timeBuffer = 5 minutes;
        uint256 reservePrice = 1 ether;
        uint8 minBidIncrementPercentage = 5;
        uint256 duration = 24 hours;

        auctionHouse.initialize(
            nouns,
            weth,
            timeBuffer,
            reservePrice,
            minBidIncrementPercentage,
            duration
        );
        
        console.log("NounsAuctionHouse initialized");

        vm.stopBroadcast();

        // Display contract owner (this call is made after deployment)
        address owner = auctionHouse.owner();
        console.log("Contract owner:", owner);
    }
}