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
      const sdkPath = join(__dirname, '../../nouns-sdk');
      const addressesPath = join(sdkPath, 'src/contract/addresses.json');
      const addresses = JSON.parse(readFileSync(addressesPath, 'utf8'));
      addresses[chainId] = {
        nounsToken: contracts.NounsToken.address,
        nounsSeeder: contracts.NounsSeeder.address,
        nounsDescriptor: contracts.NounsDescriptorV2.address,
        nftDescriptor: contracts.NFTDescriptorV2.address,
        nounsAuctionHouse: contracts.NounsAuctionHouse.address,
        nounsAuctionHouseProxy: contracts.NounsAuctionHouseProxy.address,
        nounsAuctionHouseProxyAdmin: contracts.NounsAuctionHouseProxyAdmin.address,
        nounsDaoExecutor: contracts.NounsDAOExecutor.address,
        nounsDAOProxy: contracts.NounsDAOProxyV2.address,
        nounsDAOLogicV1: contracts.NounsDAOLogicV2.address,
      };
      writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
      try {
        execSync('yarn build', {
          cwd: sdkPath,
        });
      } catch {
        console.log('Failed to re-build `@nouns/sdk`. Please rebuild manually.');
      }
      console.log('Addresses written to the Nouns SDK.');

      // Generate subgraph config
      const configName = `${network}-fork`;
      const subgraphConfigPath = join(__dirname, `../../nouns-subgraph/config/${configName}.json`);
      const subgraphConfig = {
        network,
        nounsToken: {
          address: contracts.NounsToken.address,
          startBlock: contracts.NounsToken.instance.deployTransaction.blockNumber,
        },
        nounsAuctionHouse: {
          address: contracts.NounsAuctionHouseProxy.address,
          startBlock: contracts.NounsAuctionHouseProxy.instance.deployTransaction.blockNumber,
        },
        nounsDAO: {
          address: contracts.NounsDAOProxyV2.address,
          startBlock: contracts.NounsDAOProxyV2.instance.deployTransaction.blockNumber,
        },
      };
      writeFileSync(subgraphConfigPath, JSON.stringify(subgraphConfig, null, 2));
      console.log('Subgraph config has been generated.');
    },
  );
