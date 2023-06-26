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
      const sdkPath = join(__dirname, '../../nouns-sdk');
      const addressesPath = join(sdkPath, 'src/contract/addresses.json');
      const addresses = JSON.parse(readFileSync(addressesPath, 'utf8'));
      addresses[chainId] = {
        nToken: contracts.NToken.address,
        nSeeder: contracts.NSeeder.address,
        nDescriptor: contracts.NDescriptorV2
          ? contracts.NDescriptorV2.address
          : contracts.NDescriptor.address,
        nftDescriptor: contracts.NFTDescriptorV2
          ? contracts.NFTDescriptorV2.address
          : contracts.NFTDescriptor.address,
        nAuctionHouse: contracts.NAuctionHouse.address,
        nAuctionHouseProxy: contracts.NAuctionHouseProxy.address,
        nAuctionHouseProxyAdmin: contracts.NAuctionHouseProxyAdmin.address,
        nDaoExecutor: contracts.NDAOExecutor.address,
        nDAOProxy: contracts.NDAOProxy.address,
        nDAOLogicV1: contracts.NDAOLogicV1.address,
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
      const subgraphConfigPath = join(__dirname, `../../punks-subgraph/config/${configName}.json`);
      const subgraphConfig = {
        network,
        nToken: {
          address: contracts.NToken.address,
          startBlock: contracts.NToken.instance.deployTransaction.blockNumber,
        },
        nAuctionHouse: {
          address: contracts.NAuctionHouseProxy.address,
          startBlock: contracts.NAuctionHouseProxy.instance.deployTransaction.blockNumber,
        },
        nDAO: {
          address: contracts.NDAOProxy.address,
          startBlock: contracts.NDAOProxy.instance.deployTransaction.blockNumber,
        },
      };
      writeFileSync(subgraphConfigPath, JSON.stringify(subgraphConfig, null, 2));
      console.log('Subgraph config has been generated.');
    },
  );
