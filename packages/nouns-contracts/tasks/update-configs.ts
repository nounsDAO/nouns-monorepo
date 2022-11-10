import { task, types } from 'hardhat/config';
import { ContractName, ContractNameDescriptorV1, DeployedContract } from './types';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

task('update-configs', 'Write the deployed addresses to the SDK and subgraph configs')
  .addParam('contracts', 'Contract objects from the deployment', undefined, types.json)
  .setAction(
    async (
      {
        contracts,
      }: { contracts: Record<ContractName | ContractNameDescriptorV1, DeployedContract> },
      { ethers },
    ) => {
      const { name: network, chainId } = await ethers.provider.getNetwork();

      // Update SDK addresses
      const sdkPath = join(__dirname, '../../nounsbr-sdk');
      const addressesPath = join(sdkPath, 'src/contract/addresses.json');
      const addresses = JSON.parse(readFileSync(addressesPath, 'utf8'));
      addresses[chainId] = {
        nounsbrToken: contracts.NounsBRToken.address,
        nounsbrSeeder: contracts.NounsBRSeeder.address,
        nounsbrDescriptor: contracts.NounsBRDescriptorV2
          ? contracts.NounsBRDescriptorV2.address
          : contracts.NounsBRDescriptor.address,
        nftDescriptor: contracts.NFTDescriptorV2
          ? contracts.NFTDescriptorV2.address
          : contracts.NFTDescriptor.address,
        nounsbrAuctionHouse: contracts.NounsBRAuctionHouse.address,
        nounsbrAuctionHouseProxy: contracts.NounsBRAuctionHouseProxy.address,
        nounsbrAuctionHouseProxyAdmin: contracts.NounsBRAuctionHouseProxyAdmin.address,
        nounsbrDaoExecutor: contracts.NounsBRDAOExecutor.address,
        nounsbrDAOProxy: contracts.NounsBRDAOProxy.address,
        nounsbrDAOLogicV1: contracts.NounsBRDAOLogicV1.address,
      };
      writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
      try {
        execSync('yarn build', {
          cwd: sdkPath,
        });
      } catch {
        console.log('Failed to re-build `@nounsbr/sdk`. Please rebuild manually.');
      }
      console.log('Addresses written to the NounsBR SDK.');

      // Generate subgraph config
      const configName = `${network}-fork`;
      const subgraphConfigPath = join(__dirname, `../../nounsbr-subgraph/config/${configName}.json`);
      const subgraphConfig = {
        network,
        nounsbrToken: {
          address: contracts.NounsBRToken.address,
          startBlock: contracts.NounsBRToken.instance.deployTransaction.blockNumber,
        },
        nounsbrAuctionHouse: {
          address: contracts.NounsBRAuctionHouseProxy.address,
          startBlock: contracts.NounsBRAuctionHouseProxy.instance.deployTransaction.blockNumber,
        },
        nounsbrDAO: {
          address: contracts.NounsBRDAOProxy.address,
          startBlock: contracts.NounsBRDAOProxy.instance.deployTransaction.blockNumber,
        },
      };
      writeFileSync(subgraphConfigPath, JSON.stringify(subgraphConfig, null, 2));
      console.log('Subgraph config has been generated.');
    },
  );
