import { task } from 'hardhat/config';
import { ContractName, DeployedContract } from './types';
import { printContractsTable } from './utils';

async function delay(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, 1000 * seconds));
}

task('deploy-descriptor-v2', 'Deploy DescriptorV2 & populate it with art')
  .addParam(
    'daoExecutor',
    'The address of the DAOExecutor that should be the owner of the descriptor.',
  )
  .setAction(async ({ daoExecutor }, { ethers, run, network }) => {
    const contracts: Record<ContractName, DeployedContract> = {} as Record<
      ContractName,
      DeployedContract
    >;
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying from address ${deployer.address}`);

    const nonce = await deployer.getTransactionCount();
    const expectedVrbsArtAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + 4,
    });

    console.log('Deploying contracts...');
    const library = await (await ethers.getContractFactory('NFTDescriptorV2', deployer)).deploy();
    contracts.NFTDescriptorV2 = {
      name: 'NFTDescriptorV2',
      address: library.address,
      instance: library,
      constructorArguments: [],
      libraries: {},
    };

    const renderer = await (await ethers.getContractFactory('SVGRenderer', deployer)).deploy();
    contracts.SVGRenderer = {
      name: 'SVGRenderer',
      address: renderer.address,
      instance: renderer,
      constructorArguments: [],
      libraries: {},
    };

    const DescriptorFactory = await ethers.getContractFactory('DescriptorV2', {
      libraries: {
        NFTDescriptorV2: library.address,
      },
    });
    const vrbsDescriptor = await DescriptorFactory.deploy(
      expectedVrbsArtAddress,
      renderer.address,
    );
    contracts.DescriptorV2 = {
      name: 'DescriptorV2',
      address: vrbsDescriptor.address,
      constructorArguments: [expectedVrbsArtAddress, renderer.address],
      instance: vrbsDescriptor,
      libraries: {
        NFTDescriptorV2: library.address,
      },
    };

    const inflator = await (await ethers.getContractFactory('Inflator', deployer)).deploy();
    contracts.Inflator = {
      name: 'Inflator',
      address: inflator.address,
      instance: inflator,
      constructorArguments: [],
      libraries: {},
    };

    const art = await (
      await ethers.getContractFactory('Art', deployer)
    ).deploy(vrbsDescriptor.address, inflator.address);
    contracts.Art = {
      name: 'Art',
      address: art.address,
      constructorArguments: [vrbsDescriptor.address, inflator.address],
      instance: art,
      libraries: {},
    };

    console.log('Waiting for contracts to be deployed');
    for (const c of Object.values<DeployedContract>(contracts)) {
      console.log(`Waiting for ${c.name} to be deployed`);
      await c.instance.deployTransaction.wait();
      console.log('Done');
    }

    console.log('Deployment complete:');
    printContractsTable(contracts);

    console.log('Populating Descriptor...');
    await run('populate-descriptor', {
      nftDescriptor: contracts.NFTDescriptorV2.address,
      vrbsDescriptor: contracts.DescriptorV2.address,
    });
    console.log('Population complete.');

    console.log('Transfering ownership to DAO Executor...');
    await vrbsDescriptor.transferOwnership(daoExecutor);
    console.log('Transfer complete.');

    if (network.name !== 'localhost') {
      console.log('Waiting 1 minute before verifying contracts on Etherscan');
      await delay(60);

      console.log('Verifying contracts on Etherscan...');
      await run('verify-etherscan', {
        contracts,
      });
      console.log('Verify complete.');
    }
  });
