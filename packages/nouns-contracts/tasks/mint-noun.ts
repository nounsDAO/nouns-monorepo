import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("mint-noun", "Mints a noun")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { ethers, network } = hre;
    
    console.log(`Network: ${network.name}`);

    const [signer] = await ethers.getSigners();
    console.log("Minting with the account:", signer.address);

    const nounsTokenAddress = "0xa203CB3A78AFb24D42ADd94d1A058Ce9C8c9f3A8";
    const NounsToken = await ethers.getContractFactory("NounsToken");
    const nounsToken = NounsToken.attach(nounsTokenAddress);

    try {
      // Check signer's BERA balance
      const balance = await signer.getBalance();
      console.log("Signer BERA balance:", ethers.utils.formatEther(balance), "ETH");

      // Check minter role
      const minter = await nounsToken.minter();
      console.log("Current minter address:", minter);

      if (minter.toLowerCase() !== signer.address.toLowerCase()) {
        console.log("WARNING: Signer is not set as minter.");
      }

      // Set a manual gas limit
      const gasLimit = ethers.utils.parseUnits("300000", "wei");

      console.log("Using manual gas limit:", gasLimit.toString());

      const tx = await nounsToken.connect(signer).mint({ gasLimit });
      console.log("Transaction sent. Waiting for confirmation...");
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        console.log("Noun minted successfully!");
        console.log("Transaction hash:", receipt.transactionHash);
        
        const mintedTokenId = receipt.events?.find(e => e.event === 'Transfer')?.args?.tokenId;
        if (mintedTokenId) {
          console.log("Minted Noun ID:", mintedTokenId.toString());
        }
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error: any) {
      // console.error("Error minting Noun:", error.message);
      if (error.message.includes("division or modulo by zero")) {
        console.log("The contract encountered a division by zero error. This might be due to an issue in the contract's logic.");
      } else if (error.message.includes("Sender is not the minter")) {
        console.log("Make sure the signer account is set as the minter on the NounsToken contract.");
      } else if (error.message.includes("transaction failed")) {
        console.log("The transaction failed. Check the contract state and ensure you have enough BERA for gas fees.");
        console.log("You might also need to check if the minter role is correctly set.");
      }
      // Log more detailed error information
      if (error.transaction) {
        // console.log("Failed transaction details:", error.transaction);
      }
      if (error.receipt) {
        console.log("Transaction receipt:", error.receipt);
      }
      // Additional error handling for specific Berachain issues
      if (error.message.includes("CALL_EXCEPTION")) {
        console.log("A call exception occurred. This might be due to contract state or permissions on Berachain.");
      }
      if (network.name === "berachain") {
        console.log("Note: You're on Berachain. Ensure your contract is properly deployed and configured for this network.");
      }
    }
  });
