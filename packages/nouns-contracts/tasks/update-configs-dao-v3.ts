import { task, types } from 'hardhat/config';
import { ContractNamesDAOV3, DeployedContract } from './types';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

task('update-configs-dao-v3', 'Write the deployed addresses to the SDK and subgraph configs')
  .addParam('contracts', 'Contract objects from the deployment', undefined, types.json)
  .setAction(
    async (
      { contracts }: { contracts: Record<ContractNamesDAOV3, DeployedContract> },
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
        nounsDaoExecutor: contracts.NounsDAOExecutorProxy.address,
        nounsDAOProxy: contracts.NounsDAOProxyV3.address,
        nounsDAOLogicV1: contracts.NounsDAOLogicV3.address,
        nounsDAOData: contracts.NounsDAODataProxy.address,
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
          address: contracts.NounsDAOProxyV3.address,
          startBlock: contracts.NounsDAOProxyV3.instance.deployTransaction.blockNumber,
        },
        nounsDAOData: {
          addresses: contracts.NounsDAODataProxy.address,
          startBlock: contracts.NounsDAODataProxy.instance.deployTransaction.blockNumber,
        },
      };
      writeFileSync(subgraphConfigPath, JSON.stringify(subgraphConfig, null, 2));
      console.log('Subgraph config has been generated.');
    },
  );
