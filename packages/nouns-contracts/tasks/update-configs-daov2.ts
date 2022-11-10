import { task, types } from 'hardhat/config';
import { ContractNamesDAOV2, DeployedContract } from './types';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

task('update-configs-daov2', 'Write the deployed addresses to the SDK and subgraph configs')
  .addParam('contracts', 'Contract objects from the deployment', undefined, types.json)
  .setAction(
    async (
      { contracts }: { contracts: Record<ContractNamesDAOV2, DeployedContract> },
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
        nounsbrDescriptor: contracts.NounsBRDescriptorV2.address,
        nftDescriptor: contracts.NFTDescriptorV2.address,
        nounsbrAuctionHouse: contracts.NounsBRAuctionHouse.address,
        nounsbrAuctionHouseProxy: contracts.NounsBRAuctionHouseProxy.address,
        nounsbrAuctionHouseProxyAdmin: contracts.NounsBRAuctionHouseProxyAdmin.address,
        nounsbrDaoExecutor: contracts.NounsBRDAOExecutor.address,
        nounsbrDAOProxy: contracts.NounsBRDAOProxyV2.address,
        nounsbrDAOLogicV1: contracts.NounsBRDAOLogicV2.address,
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
          address: contracts.NounsBRDAOProxyV2.address,
          startBlock: contracts.NounsBRDAOProxyV2.instance.deployTransaction.blockNumber,
        },
      };
      writeFileSync(subgraphConfigPath, JSON.stringify(subgraphConfig, null, 2));
      console.log('Subgraph config has been generated.');
    },
  );
