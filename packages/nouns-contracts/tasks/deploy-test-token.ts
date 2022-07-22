import { task } from 'hardhat/config';
import { ContractName, DeployedContract } from './types';

async function delay(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, 1000 * seconds));
}

task('deploy-test-token', 'Deploy NounsTokenHarness given a descriptor')
  .addParam('descriptorAddress', 'Address of a deployed descriptor contractor')
  .addParam('seederAddress', 'Address of a deployed seeder contract')
  .setAction(async ({ descriptorAddress, seederAddress }, { ethers, run, network }) => {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying from address ${deployer.address}`);

    const proxyRegistryAddress = '0xa5409ec958c83c3f309868babaca7c86dcb077c1';

    const token = await (
      await ethers.getContractFactory('NounsTokenHarness', deployer)
    ).deploy(
      deployer.address,
      deployer.address,
      descriptorAddress,
      seederAddress,
      proxyRegistryAddress,
    );
    console.log(`NounsTokenHarness deployed to: ${token.address}`);

    if (network.name !== 'localhost') {
      console.log('Waiting 1 minute before verifying contracts on Etherscan');
      await delay(60);

      console.log('Verifying contracts on Etherscan...');
      const contracts: Record<string, DeployedContract> = {} as Record<string, DeployedContract>;

      contracts.NounsTokenHarness = {
        name: 'NounsTokenHarness',
        address: token.address,
        constructorArguments: [
          deployer.address,
          deployer.address,
          descriptorAddress,
          seederAddress,
          proxyRegistryAddress,
        ],
        instance: token,
        libraries: {},
      };

      await run('verify-etherscan', {
        contracts,
      });
      console.log('Verify complete.');
    }

    console.log('Done');
  });
