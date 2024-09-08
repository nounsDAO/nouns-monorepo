import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("deploy-nouns-token", "Deploys a new instance of the NounsToken contract")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { ethers, network } = hre;
    
    console.log(`Network: ${network.name}`);

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // You may need to deploy these contracts first or use existing addresses
    const noundersDAO = "0x10A8F12dF3dC1bBd50011D5F5df91AbC88602Ba6"; // placeholder
    const minter = deployer.address; // placeholder
    const descriptor = "0x8f4198b4A28D5cbd49390A5142348Bf546dE274b"; // placeholder
    const seeder = "0xF644397B84EeB224c4302c4C06569C16C1731919"; // placeholder
    const proxyAdmin = "0xd9fEE12E0253B66a8cb42130aa97cab39fedB049"; // placeholder

    const NounsToken = await ethers.getContractFactory("NounsToken");
    const nounsToken = await NounsToken.deploy(
      noundersDAO,
      minter,
      descriptor,
      seeder,
      proxyAdmin
    );

    await nounsToken.deployed();

    console.log("NounsToken deployed to:", nounsToken.address);

    // Set the deployer as the minter if it's different from the initial minter
    if (minter.toLowerCase() !== deployer.address.toLowerCase()) {
      const currentMinter = await nounsToken.minter();
      if (currentMinter.toLowerCase() === deployer.address.toLowerCase()) {
        await nounsToken.setMinter(deployer.address);
        console.log("Minter set to:", deployer.address);
      } else {
        console.log("Cannot set minter. Current minter is:", currentMinter);
      }
    }

    console.log("Deployment and initial setup completed.");

    // Return the contract address and other relevant info
    return {
      contractAddress: nounsToken.address,
      noundersDAO,
      minter,
      descriptor,
      seeder,
      proxyAdmin
    };
  });