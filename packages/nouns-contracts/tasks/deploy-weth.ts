import { default as NAuctionHouseABI } from '../abi/contracts/NAuctionHouse.sol/NAuctionHouse.json';
import { task, types } from 'hardhat/config';
import { Interface } from 'ethers/lib/utils';
import { Contract as EthersContract } from 'ethers';
import { ContractName } from './types';

type LocalContractName = ContractName | 'WETH';

interface Contract {
  args?: (string | number | (() => string | undefined))[];
  instance?: EthersContract;
  libraries?: () => Record<string, string>;
  waitForConfirmation?: boolean;
}

task('deploy-weth', 'Deploy WETH to hardhat, for tests only')
  .setAction(async (args, { ethers }) => {

      const factory = await ethers.getContractFactory('WETH');

      const deployedContract = await factory.deploy();

      await deployedContract.deployed();

      console.log(`WETH contract deployed to ${deployedContract.address}`);

  });
