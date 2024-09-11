// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../contracts/NounsAuctionHouseV2.sol";

contract DeployNounsAuctionHouseV2 is Script {
    function run() external {
        string memory privateKeyString = vm.envString("WALLET_PRIVATE_KEY");
        uint256 deployerPrivateKey = vm.parseUint(string(abi.encodePacked("0x", privateKeyString)));
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);

        // Constructor arguments
        INounsToken nouns = INounsToken(0x3965839b6F282AEC880ff55aa0ED1F079Cc31198); // Replace with actual Nouns token address
        address weth = 0x7507c1dc16935B82698e4C63f2746A2fCf994dF8; // Replace with actual WETH address
        uint256 duration = 24 hours; // Replace with desired auction duration

        NounsAuctionHouseV2 auctionHouse = new NounsAuctionHouseV2(nouns, weth, duration);
        
        console.log("NounsAuctionHouseV2 deployed at:", address(auctionHouse));

        address owner = NounsAuctionHouseV2(address(auctionHouse)).owner();
        console.log("Contract owner:", owner);

        // Initialize the contract
        // Replace these parameters with the correct ones for your initialize method
        // uint256 timeBuffer = 5 minutes;
        // uint56 reservePrice = 1 ether; // Changed to uint56
        // uint8 minBidIncrementPercentage = 5;
        // auctionHouse.initialize(
        //     84000,
        //     reservePrice,
        //     minBidIncrementPercentage
        // );
        
        // console.log("NounsAuctionHouseV2 initialized");

        vm.stopBroadcast();
    }
}