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
      const sdkPath = join(__dirname, '../../vrbs-sdk');
      const addressesPath = join(sdkPath, 'src/contract/addresses.json');
      const addresses = JSON.parse(readFileSync(addressesPath, 'utf8'));
      addresses[chainId] = {
        vrbsToken: contracts.VrbsToken.address,
        vrbsSeeder: contracts.Seeder.address,
        vrbsDescriptor: contracts.DescriptorV2
          ? contracts.DescriptorV2.address
          : contracts.Descriptor.address,
        nftDescriptor: contracts.NFTDescriptorV2
          ? contracts.NFTDescriptorV2.address
          : contracts.NFTDescriptor.address,
        vrbsAuctionHouse: contracts.AuctionHouse.address,
        vrbsAuctionHouseProxy: contracts.AuctionHouseProxy.address,
        vrbsAuctionHouseProxyAdmin: contracts.AuctionHouseProxyAdmin.address,
        vrbsDaoExecutor: contracts.DAOExecutor.address,
        vrbsDAOProxy: contracts.DAOProxy.address,
        vrbsDAOLogicV1: contracts.DAOLogicV1.address,
      };
      writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
      try {
        execSync('yarn build', {
          cwd: sdkPath,
        });
      } catch {
        console.log('Failed to re-build `@vrbs/sdk`. Please rebuild manually.');
      }
      console.log('Addresses written to the Vrbs SDK.');

      // Generate subgraph config
      const configName = `${network}-fork`;
      const subgraphConfigPath = join(__dirname, `../../vrbs-subgraph/config/${configName}.json`);
      const subgraphConfig = {
        network,
        vrbsToken: {
          address: contracts.VrbsToken.address,
          startBlock: contracts.VrbsToken.instance.deployTransaction.blockNumber,
        },
        vrbsAuctionHouse: {
          address: contracts.AuctionHouseProxy.address,
          startBlock: contracts.AuctionHouseProxy.instance.deployTransaction.blockNumber,
        },
        vrbsDAO: {
          address: contracts.DAOProxy.address,
          startBlock: contracts.DAOProxy.instance.deployTransaction.blockNumber,
        },
      };
      writeFileSync(subgraphConfigPath, JSON.stringify(subgraphConfig, null, 2));
      console.log('Subgraph config has been generated.');
    },
  );
