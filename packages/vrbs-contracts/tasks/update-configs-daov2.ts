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
      const sdkPath = join(__dirname, '../../vrbs-sdk');
      const addressesPath = join(sdkPath, 'src/contract/addresses.json');
      const addresses = JSON.parse(readFileSync(addressesPath, 'utf8'));
      addresses[chainId] = {
        vrbsToken: contracts.VrbsToken.address,
        vrbsSeeder: contracts.Seeder2.address,
        vrbsDescriptor: contracts.DescriptorV2.address,
        nftDescriptor: contracts.NFTDescriptorV2.address,
        vrbsAuctionHouse: contracts.AuctionHouse.address,
        vrbsAuctionHouseProxy: contracts.AuctionHouseProxy.address,
        vrbsAuctionHouseProxyAdmin: contracts.AuctionHouseProxyAdmin.address,
        vrbsDaoExecutor: contracts.DAOExecutor.address,
        vrbsDAOProxy: contracts.DAOProxyV2.address,
        vrbsDAOLogicV1: contracts.DAOLogicV2.address,
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
          address: contracts.DAOProxyV2.address,
          startBlock: contracts.DAOProxyV2.instance.deployTransaction.blockNumber,
        },
      };
      writeFileSync(subgraphConfigPath, JSON.stringify(subgraphConfig, null, 2));
      console.log('Subgraph config has been generated.');
    },
  );
