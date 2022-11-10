import { task } from 'hardhat/config';
import { ContractName, DeployedContract } from './types';
import { printContractsTable } from './utils';

async function delay(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, 1000 * seconds));
}

task('deploy-descriptor-v2', 'Deploy NounsBRDescriptorV2 & populate it with art')
  .addParam(
    'daoExecutor',
    'The address of the NounsBRDAOExecutor that should be the owner of the descriptor.',
  )
  .setAction(async ({ daoExecutor }, { ethers, run, network }) => {
    const contracts: Record<ContractName, DeployedContract> = {} as Record<
      ContractName,
      DeployedContract
    >;
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying from address ${deployer.address}`);

    const nonce = await deployer.getTransactionCount();
    const expectedNounsBRArtAddress = ethers.utils.getContractAddress({
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

    const nounsbrDescriptorFactory = await ethers.getContractFactory('NounsBRDescriptorV2', {
      libraries: {
        NFTDescriptorV2: library.address,
      },
    });
    const nounsbrDescriptor = await nounsbrDescriptorFactory.deploy(
      expectedNounsBRArtAddress,
      renderer.address,
    );
    contracts.NounsBRDescriptorV2 = {
      name: 'NounsBRDescriptorV2',
      address: nounsbrDescriptor.address,
      constructorArguments: [expectedNounsBRArtAddress, renderer.address],
      instance: nounsbrDescriptor,
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
      await ethers.getContractFactory('NounsBRArt', deployer)
    ).deploy(nounsbrDescriptor.address, inflator.address);
    contracts.NounsBRArt = {
      name: 'NounsBRArt',
      address: art.address,
      constructorArguments: [nounsbrDescriptor.address, inflator.address],
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
      nounsbrDescriptor: contracts.NounsBRDescriptorV2.address,
    });
    console.log('Population complete.');

    console.log('Transfering ownership to DAO Executor...');
    await nounsbrDescriptor.transferOwnership(daoExecutor);
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
