import { task } from 'hardhat/config';
import { ContractName, DeployedContract } from './types';
import { printContractsTable } from './utils';

task(
  'deploy-descriptorv2-and-propose-upgrade',
  'Deploy NounsDescriptorV2, populate it with art and submit an upgrade proposal to the DAO',
)
  .addParam('tokenAddress', 'The NounsToken address, used in the descriptor upgrade proposal')
  .addParam('daoAddress', 'The DAO proxy address, where the upgrade proposal is submitted')
  .addParam('executorAddress', "The DAO's deployed timelock address")
  .setAction(async ({ executorAddress, daoAddress, tokenAddress }, { ethers, run }) => {
    const contracts: Record<ContractName, DeployedContract> = {} as Record<
      ContractName,
      DeployedContract
    >;
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying from address ${deployer.address}`);

    const nonce = await deployer.getTransactionCount();
    const expectedNounsArtAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + 3,
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

    const nounsDescriptorFactory = await ethers.getContractFactory('NounsDescriptorV2', {
      libraries: {
        NFTDescriptorV2: library.address,
      },
    });
    const nounsDescriptor = await nounsDescriptorFactory.deploy(
      expectedNounsArtAddress,
      renderer.address,
    );
    contracts.NounsDescriptorV2 = {
      name: 'NounsDescriptorV2',
      address: nounsDescriptor.address,
      constructorArguments: [expectedNounsArtAddress, renderer.address],
      instance: nounsDescriptor,
      libraries: {
        NFTDescriptorV2: library.address,
      },
    };

    const art = await (
      await ethers.getContractFactory('NounsArt', deployer)
    ).deploy(nounsDescriptor.address);
    console.log(`actual art address: ${art.address}`);
    contracts.NounsArt = {
      name: 'NounsArt',
      address: art.address,
      constructorArguments: [nounsDescriptor.address],
      instance: art,
      libraries: {},
    };

    console.log('Deployment complete:');
    printContractsTable(contracts);

    console.log('Verifying contracts on Etherscan...');
    await run('verify-etherscan', {
      contracts,
    });
    console.log('Verify complete.');

    console.log('Populating Descriptor...');
    await run('populate-descriptor', {
      nftDescriptor: contracts.NFTDescriptorV2.address,
      nounsDescriptor: contracts.NounsDescriptorV2.address,
    });
    console.log('Population complete.');

    console.log('Transferring ownership of the descriptor to the executor...');
    await contracts.NounsDescriptorV2.instance!.transferOwnership(executorAddress);
    console.log('Transfer complete.');

    console.log('Submitting the upgrade proposal to the DAO...');
    const dao = (await ethers.getContractFactory('NounsDAOLogicV1', deployer)).attach(daoAddress);
    const propTx = await dao.propose(
      [tokenAddress],
      [0],
      ['setDescriptor(address)'],
      [contracts.NounsDescriptorV2.address],
      'Upgrade NounsToken to use DescriptorV2.',
    );
    await propTx.wait();
    console.log('Submission complete.');
  });
