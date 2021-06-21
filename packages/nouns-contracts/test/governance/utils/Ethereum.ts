// Adapted from `https://github.com/compound-finance/compound-protocol/blob/master/tests/Utils/Ethereum.js`

const hardhat = require('hardhat');

// const BigNumber = require('bignumber.js');
const ethers = hardhat.ethers;
export async function minerStop(): Promise<void> {
  await hardhat.network.provider.send("evm_setAutomine", [false])
  await hardhat.network.provider.send("evm_setIntervalMining", [0])
}

export async function minerStart(): Promise<void> {
  await hardhat.network.provider.send("evm_setAutomine", [true])
}

export async function mineBlock(): Promise<void> {
  await hardhat.network.provider.send("evm_mine")
}

export async function chainId(): Promise<number> {
  return parseInt(await hardhat.network.provider.send("eth_chainId"), 16);
}

export function address(n: number): string {
  return `0x${n.toString(16).padStart(40, '0')}`;
}
