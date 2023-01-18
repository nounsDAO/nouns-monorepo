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
      const sdkPath = join(__dirname, '../../n00uns-sdk');
      const addressesPath = join(sdkPath, 'src/contract/addresses.json');
      const addresses = JSON.parse(readFileSync(addressesPath, 'utf8'));
      addresses[chainId] = {
        n00unsToken: contracts.N00unsToken.address,
        n00unsSeeder: contracts.N00unsSeeder.address,
        n00unsDescriptor: contracts.N00unsDescriptorV2
          ? contracts.N00unsDescriptorV2.address
          : contracts.N00unsDescriptor.address,
        nftDescriptor: contracts.NFTDescriptorV2
          ? contracts.NFTDescriptorV2.address
          : contracts.NFTDescriptor.address,
        n00unsAuctionHouse: contracts.N00unsAuctionHouse.address,
        n00unsAuctionHouseProxy: contracts.N00unsAuctionHouseProxy.address,
        n00unsAuctionHouseProxyAdmin: contracts.N00unsAuctionHouseProxyAdmin.address,
        n00unsDaoExecutor: contracts.N00unsDAOExecutor.address,
        n00unsDAOProxy: contracts.N00unsDAOProxy.address,
        n00unsDAOLogicV1: contracts.N00unsDAOLogicV1.address,
      };
      writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
      try {
        execSync('yarn build', {
          cwd: sdkPath,
        });
      } catch {
        console.log('Failed to re-build `@n00uns/sdk`. Please rebuild manually.');
      }
      console.log('Addresses written to the N00uns SDK.');

      // Generate subgraph config
      const configName = `${network}-fork`;
      const subgraphConfigPath = join(__dirname, `../../n00uns-subgraph/config/${configName}.json`);
      const subgraphConfig = {
        network,
        n00unsToken: {
          address: contracts.N00unsToken.address,
          startBlock: contracts.N00unsToken.instance.deployTransaction.blockNumber,
        },
        n00unsAuctionHouse: {
          address: contracts.N00unsAuctionHouseProxy.address,
          startBlock: contracts.N00unsAuctionHouseProxy.instance.deployTransaction.blockNumber,
        },
        n00unsDAO: {
          address: contracts.N00unsDAOProxy.address,
          startBlock: contracts.N00unsDAOProxy.instance.deployTransaction.blockNumber,
        },
      };
      writeFileSync(subgraphConfigPath, JSON.stringify(subgraphConfig, null, 2));
      console.log('Subgraph config has been generated.');
    },
  );
