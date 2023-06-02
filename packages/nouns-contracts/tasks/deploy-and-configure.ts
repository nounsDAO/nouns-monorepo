import { task, types } from 'hardhat/config';
import { printContractsTable } from './utils';
import probDoc from '../../nouns-assets/src/config/probability.json'

task('deploy-and-configure', 'Deploy and configure all contracts')
  .addFlag('startAuction', 'Start the first auction upon deployment completion')
  .addFlag('autoDeploy', 'Deploy all contracts without user interaction')
  .addFlag('updateConfigs', 'Write the deployed addresses to the SDK and subgraph configs')
  .addOptionalParam('weth', 'The WETH contract address')
  .addOptionalParam('cryptopunksVote', 'The CryptopunksVote contract address', undefined, types.string)
  .addOptionalParam('punkers', 'The punkers (creator org) address')
  .addOptionalParam(
    'auctionTimeBuffer',
    'The auction time buffer (seconds)',
    5 * 60 /* 5 minutes */,
    types.int,
  )
  .addOptionalParam('auctionReservePrice', 'The auction reserve price (wei)')
  .addOptionalParam(
    'auctionMinIncrementBidPercentage',
    'The auction min increment bid percentage (out of 100)',
  )
  .addOptionalParam(
    'auctionDuration',
    'The auction duration (seconds)',
    24 * 60 * 60 /* 24 hours */, /* DEBUG */
    types.int,
  )
  .addOptionalParam('timelockDelay', 'The timelock delay (seconds)')
  .addOptionalParam('votingPeriod', 'The voting period (blocks)')
  .addOptionalParam('votingDelay', 'The voting delay (blocks)')
  .addOptionalParam('proposalThresholdBps', 'The proposal threshold (basis points)')
  .addOptionalParam('quorumVotesBps', 'Votes required for quorum (basis points)')
  .setAction(async (args, { run }) => {
    // Deploy the NDAO contracts and return deployment information
    const contracts = await run('deploy', args);

    // Verify the contracts on Etherscan
    await run('verify-etherscan', {
      contracts,
    });

    // Populate the on-chain art
    await run('populate-descriptor', {
      nftDescriptor: contracts.NFTDescriptorV2.address,
      nDescriptor: contracts.NDescriptorV2.address,
    });

    // Populate the on-chain seeder
    await run('populate-seeder', { nSeeder: contracts.NSeeder.instance, probDoc });

    // Register OG punk hashes to make sure they will not be minted.
    await run('register-og-punks', { nToken: contracts.NToken.instance });

    // Transfer ownership of all contract except for the auction house.
    // We must maintain ownership of the auction house to kick off the first auction.
    const executorAddress = contracts.NDAOExecutor.address;
    await contracts.NDescriptorV2.instance.transferOwnership(executorAddress);
    await contracts.NToken.instance.transferOwnership(executorAddress);
    await contracts.NAuctionHouseProxyAdmin.instance.transferOwnership(executorAddress);
    console.log(
      'Transferred ownership of the descriptor, token, and proxy admin contracts to the executor.',
    );

    // Optionally kick off the first auction and transfer ownership of the auction house
    // to the NDAO executor.
    if (args.startAuction) {
      const auctionHouse = contracts.NAuctionHouse.instance.attach(
        contracts.NAuctionHouseProxy.address,
      );
      await auctionHouse.unpause({
        gasLimit: 5_000_000,
      });
      await auctionHouse.transferOwnership(executorAddress);
      console.log(
        'Started the first auction and transferred ownership of the auction house to the executor.',
      );
      console.log(await auctionHouse.auction())
    }

    // Optionally write the deployed addresses to the SDK and subgraph configs.
    if (args.updateConfigs) {
      await run('update-configs', {
        contracts,
      });
    }

    printContractsTable(contracts);
    console.log('Deployment Complete.');
  });
