import { Contract } from '@ethersproject/contracts'
import axios from 'axios';
import config, { CHAIN_ID } from '../../config';
import { ethers } from 'ethers';
import repTokensABI from "../../wrappers/repTokensAbi";
import CadentRepDistributorABI from "./CadentRepDistributorABI";

let rpcProvider;
let repContractAddress;
let cadentRepContractAddress;

if (CHAIN_ID === 1 || CHAIN_ID === 137) {
  let url = "https://polygon-mainnet.g.alchemy.com/v2/QlAdcu2qrGohrGeg-D5Wk5jdsLwARS0H";
  repContractAddress = '0x57AA5fd0914A46b8A426cC33DB842D1BB1aeADa2';
  cadentRepContractAddress = '';
  rpcProvider = new ethers.providers.JsonRpcProvider(url);
} else {
  rpcProvider = new ethers.providers.JsonRpcProvider();
  repContractAddress = config.addresses.repTokensAddress;
  cadentRepContractAddress = config.addresses.cadentDistributorAddress;
}

const readableRepContract = new ethers.Contract(
    repContractAddress as string,
    repTokensABI,
    rpcProvider
  );

// keep in case we want to use user's provider
// const walletProvider = new ethers.providers.Web3Provider(window.ethereum)

const readableCadentRepContract = new ethers.Contract(
cadentRepContractAddress as string,
CadentRepDistributorABI,
rpcProvider
//walletProvider
);

async function getCanClaim(contract: Contract) {
    const result = await contract.canClaim();
    // setCanClaim(result);
  }

  async function getRemainingTime(contract: Contract) {
    const result = await contract.getRemainingTime();
    // setRemainingTime(result.toNumber());
  }

  async function getAmountDistributed(contract: Contract) {
    const result = await contract.getAmountDistributedPerCadenceCycle();
    // setAmountPerCadence(result.toNumber());
  }


async function getBalances(contract: Contract, activeAccount: String) {
    const result = await contract.balanceOf(activeAccount, 0);
    // setBalanceOf0(result);
    const result2 = await contract.balanceOf(activeAccount, 1);
    // setBalanceOf1(result2);
}

async function getJson(contract: Contract) {
    const uri0 = await contract.uri(0);
    const uri1 = await contract.uri(1);

    let finalURL0 = uri0.replace("ipfs://", "https://ipfs.io/ipfs/");
    let finalJson0 = await axios.get(finalURL0);
    // setJson0Name(finalJson0.data.name);
    // setJson0Description(finalJson0.data.description);
    // setJson0Image(finalJson0.data.image);

    let finalURL1 = uri1.replace("ipfs://", "https://ipfs.io/ipfs/");
    let finalJson1 = await axios.get(finalURL1);
    // setJson1Name(finalJson1.data.name);
    // setJson1Description(finalJson1.data.description);
    // setJson1Image(finalJson1.data.image);
}