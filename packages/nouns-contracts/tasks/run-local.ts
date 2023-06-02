import { TASK_COMPILE, TASK_NODE } from 'hardhat/builtin-tasks/task-names';
import { task } from 'hardhat/config';
import probDoc from '../../nouns-assets/src/config/probability.json'

task(
  'run-local',
  'Start a hardhat node, deploy contracts, and execute setup transactions',
).setAction(async (_, { ethers, run }) => {
  await run(TASK_COMPILE);

  await Promise.race([run(TASK_NODE), new Promise(resolve => setTimeout(resolve, 2_000))]);

  const contracts = await run('deploy-local');

  await run('populate-descriptor', {
    nftDescriptor: contracts.NFTDescriptorV2.instance.address,
    nDescriptor: contracts.NDescriptorV2.instance.address,
  });
    // Populate the on-chain seeder
  await run('populate-seeder', { nSeeder: contracts.NSeeder.instance, probDoc });

  await contracts.NAuctionHouse.instance
    .attach(contracts.NAuctionHouseProxy.instance.address)
    .unpause({
      gasLimit: 10_000_000,
    });

  // Transfer ownership
  const [deployer] = await ethers.getSigners();
  const executorAddress = contracts.NDAOExecutor.instance.address;
  await contracts.NDescriptorV2.instance.transferOwnership(deployer.address);
  await contracts.NToken.instance.transferOwnership(deployer.address);
  await contracts.NSeeder.instance.transferOwnership(deployer.address);
  await contracts.NAuctionHouseProxyAdmin.instance.transferOwnership(deployer.address);
  await contracts.NAuctionHouse.instance
    .attach(contracts.NAuctionHouseProxy.instance.address)
    .transferOwnership(deployer.address);
  console.log(
    'Transferred ownership of the descriptor, token, and proxy admin contracts to the deployer.',
  );

  // await run('create-proposal', {
  //   nDaoProxy: contracts.NDAOProxy.instance.address,
  // });

  const { chainId } = await ethers.provider.getNetwork();

  const accounts = {
    'Account #0': {
      Address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      'Private Key': '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    },
    'Account #1': {
      Address: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      'Private Key': '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    },
  };

  console.table(accounts);
  console.log(
    `Punk contracts deployed to local node at http://localhost:8545 (Chain ID: ${chainId})`,
  );
  console.log(`Auction House Proxy address: ${contracts.NAuctionHouseProxy.instance.address}`);
  console.log(`Punk ERC721 address: ${contracts.NToken.instance.address}`);
  console.log(`Punk DAO Executor address: ${contracts.NDAOExecutor.instance.address}`);
  console.log(`Punk DAO Proxy address: ${contracts.NDAOProxy.instance.address}`);

  await ethers.provider.send('evm_setIntervalMining', [12_000]);

  await new Promise(() => {
    /* keep node alive until this process is killed */
  });
});
