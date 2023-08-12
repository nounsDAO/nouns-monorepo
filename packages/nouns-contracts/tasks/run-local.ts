import { TASK_COMPILE, TASK_NODE } from 'hardhat/builtin-tasks/task-names';
import { task } from 'hardhat/config';
// import { readFileSync } from 'fs';
// import { MerkleOutput } from './merkle-tree';

task(
  'run-local',
  'Start a hardhat node, deploy contracts, and execute setup transactions',
).setAction(async (_, { ethers, run }) => {
  await run(TASK_COMPILE);

  await Promise.race([
    run(TASK_NODE, { hostname: '0.0.0.0' }),
    new Promise(resolve => setTimeout(resolve, 2_000)),
  ]);

  const contracts = await run('deploy-local');

  await run('populate-descriptor', {
    nftDescriptor: contracts.NFTDescriptorV2.instance.address,
    nounsDescriptor: contracts.NounsDescriptorV2.instance.address,
  });

  await contracts.NounsAuctionHouse.instance
    .attach(contracts.NounsAuctionHouseProxy.instance.address)
    .unpause({
      gasLimit: 1_000_000,
    });

  // Transfer ownership
  const executorAddress = contracts.NounsDAOExecutor.instance.address;
  await contracts.NounsDescriptorV2.instance.transferOwnership(executorAddress);
  await contracts.NounsToken.instance.transferOwnership(executorAddress);
  await contracts.NounsAuctionHouseProxyAdmin.instance.transferOwnership(executorAddress);
  await contracts.NounsAuctionHouse.instance
    .attach(contracts.NounsAuctionHouseProxy.instance.address)
    .transferOwnership(executorAddress);
  console.log(
    'Transferred ownership of the descriptor, token, and proxy admin contracts to the executor.',
  );

  // await run('create-proposal', {
  //   nounsDaoProxy: contracts.NounsDAOProxyV2.instance.address,
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
    `Noun contracts deployed to local node at http://localhost:8545 (Chain ID: ${chainId})`,
  );
  console.log(`Auction House Proxy address: ${contracts.NounsAuctionHouseProxy.instance.address}`);
  console.log(`Nouns ERC721 address: ${contracts.NounsToken.instance.address}`);
  console.log(`Nouns DAO Executor address: ${contracts.NounsDAOExecutor.instance.address}`);
  console.log(`Nouns DAO Proxy address: ${contracts.NounsDAOProxyV2.instance.address}`);
  console.log(`ATX DAO NFT V2 address: ${contracts.ATXDAONFT_V2.instance.address}`);
  console.log(`Rep Tokens address: ${contracts.RepTokens.instance.address}`);
  console.log(`Cadent Rep Distributor address: ${contracts.CadentRepDistributor.instance.address}`);

  // const parsedRoot = (
  //   JSON.parse(
  //     readFileSync(
  //     'metadata/zilker/zilker-merkle-tree.json'
  //     ).toString()
  //   ) as MerkleOutput
  // ).root

  let tx = await contracts.ATXDAONFT_V2.instance.startMint(1000, '');
  tx = await contracts.ATXDAONFT_V2.instance.mint();
  tx = await contracts.ATXDAONFT_V2.instance.mint();
  tx = await contracts.ATXDAONFT_V2.instance.mint();
  console.log(await contracts.ATXDAONFT_V2.instance.ownerOf(1));

  const minterRole = await contracts.RepTokens.instance.MINTER_ROLE();
  const distributorRole = await contracts.RepTokens.instance.DISTRIBUTOR_ROLE();
  await contracts.RepTokens.instance.grantRole(minterRole, accounts[`Account #0`].Address);
  await contracts.RepTokens.instance.grantRole(distributorRole, accounts[`Account #0`].Address);
  await contracts.RepTokens.instance.mint(`0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266`, 5, []);

  await contracts.RepTokens.instance.grantRole(distributorRole, contracts.CadentRepDistributor.instance.address);
  await contracts.RepTokens.instance.mint(contracts.CadentRepDistributor.instance.address, 12, []);

  await ethers.provider.send('evm_setIntervalMining', [12_000]);

  await new Promise(() => {
    /* keep node alive until this process is killed */
  });
});
