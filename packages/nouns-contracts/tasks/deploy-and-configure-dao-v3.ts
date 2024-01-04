import { task, types } from 'hardhat/config';
import { printContractsTable } from './utils';
import {BigNumber, Contract} from 'ethers'

task(
  'deploy-and-configure-dao-v3',
  'Deploy and configure all contracts',
)
  .addFlag('startAuction', 'Start the first auction upon deployment completion')
  .addFlag('autoDeploy', 'Deploy all contracts without user interaction')
  .addFlag('updateConfigs', 'Write the deployed addresses to the SDK and subgraph configs')
  .addFlag('changeOwner', 'Transfer owner of some contracts from the deployer address to the contract address')
  .addOptionalParam('weth', 'The WETH contract address')
  .addOptionalParam('noundersdao', 'The nounders DAO contract address')
  .addOptionalParam(
    'auctionTimeBuffer',
    'The auction time buffer (seconds)',
      5 * 60 /* 5 minutes */,
    types.int,
  )
  .addOptionalParam(
    'auctionReservePrice',
    'The auction reserve price (wei)',
    1 /* 1 wei */,
    types.int,
  )
  .addOptionalParam(
    'auctionMinIncrementBidPercentage',
    'The auction min increment bid percentage (out of 100)',
    2 /* 2% */,
    types.int,
  )
  .addOptionalParam(
    'auctionDuration',
    'The auction duration (seconds)',
    60 * 2 /* 1 day */,
    types.int,
  )
  .addOptionalParam('timelockDelay', 'The timelock delay (seconds)', 60 /* 1 min */, types.int)
  .addOptionalParam(
    'votingPeriod',
    'The voting period (blocks)',
    80 /* 20 min (15s blocks) */,
    types.int,
  )
  .addOptionalParam(
    'votingDelay',
    'The voting delay (blocks)',
    1,
    types.int,
  )
  .addOptionalParam(
    'proposalThresholdBps',
    'The proposal threshold (basis points)',
    100 /* 1% */,
    types.int,
  )
  .addOptionalParam(
    'minQuorumVotesBPS',
    'Min basis points input for dynamic quorum',
    1_000,
    types.int,
  ) // Default: 10%
  .addOptionalParam(
    'maxQuorumVotesBPS',
    'Max basis points input for dynamic quorum',
    4_000,
    types.int,
  ) // Default: 40%
  .addOptionalParam(
    'quorumCoefficient',
    'Dynamic quorum coefficient (float)',
    1,
    types.float,
  )
  .addOptionalParam(
    'createCandidateCost',
    'Data contract proposal candidate creation cost in wei',
    100000000000000, // 0.0001 ether
    types.int,
  )
  .addOptionalParam(
    'updateCandidateCost',
    'Data contract proposal candidate update cost in wei',
    0,
    types.int,
  )
  .setAction(async (args, { run, ethers }) => {
    // Deploy the Nouns DAO contracts and return deployment information
    const contracts = await run('deploy-dao-v3', args);

    // Verify the contracts on Etherscan
    await run('verify-etherscan-dao-v3', {
      contracts,
    });

    // Populate the on-chain art
    await run('populate-descriptor', {
      nftDescriptor: contracts.NFTDescriptorV2.address,
      nounsDescriptor: contracts.NounsDescriptorV2.address,
    });

    // Mint for AirDrop only one time

    const expectedNumAirDrops = 10;
    const totalSupply = (await contracts.NounsToken.instance.totalSupply()).toNumber();
    console.log(`totalSupply: ${totalSupply}`)
    const startIndex = totalSupply === 0 ? 0 : totalSupply - Math.floor(totalSupply / 10) + 1
    if (startIndex < expectedNumAirDrops) {
      const deployerAddress = await contracts.NounsToken.instance.owner()
      const nounderAddress = await contracts.NounsToken.instance.noundersDAO()
      console.log(`deployerAddress: ${deployerAddress}, nounderAddress: ${nounderAddress}`)

      for (let i = startIndex; i < expectedNumAirDrops; i++) {
        console.log(`Minting a token for air drops #${i}`);

        let gasLimit: number = (await contracts.NounsToken.instance.estimateGas.mint()).toNumber();
        console.log(`estimateGas: ${gasLimit}`)
        const gasLimitFixed = 300000;
        gasLimit = gasLimit > gasLimitFixed ? gasLimit : gasLimitFixed
        console.log(`gasLimit: ${gasLimit}`)

        let gasPrice = await ethers.provider.getGasPrice();
        // ガス不足(Base gasだけで不足する)になるので、20%足す
        const addGasPrice = gasPrice.div(ethers.BigNumber.from(5));
        gasPrice = gasPrice.add(addGasPrice);

        const options = { gasLimit, gasPrice };
        const response = await contracts.NounsToken.instance.mint(options);
        await response.wait();
        const tokenId = (await contracts.NounsToken.instance.totalSupply()).toNumber() - 1;
        console.log(`Minted a token id #${tokenId}, then transfer owner to ${nounderAddress}`);
        await contracts.NounsToken.instance.transferFrom(deployerAddress, nounderAddress, tokenId, options);
      }
      if (args.changeOwner) {
        console.log(`Setting a minter to ${contracts.NounsAuctionHouseProxy.instance.address}`);
        const gasLimit = contracts.NounsToken.instance.estimateGas.mint();
        let gasPrice = await ethers.provider.getGasPrice();
        // ガス不足(Base gasだけで不足する)になるので、20%足す
        const addGasPrice = gasPrice.div(ethers.BigNumber.from(5));
        gasPrice = gasPrice.add(addGasPrice);
        const options = {gasLimit, gasPrice};
        await contracts.NounsToken.instance.setMinter(contracts.NounsAuctionHouseProxy.instance.address, options);
      }
    }


    // Transfer ownership of all contract except for the auction house.
    // We must maintain ownership of the auction house to kick off the first auction.
    const isOwnerOf = async (contract: Contract, owner: string) => {
      const ownerOfContract = await contract.owner();
      return ownerOfContract === owner;
    }
    const executorAddress = contracts.NounsDAOExecutorProxy.instance.address;

    if (args.changeOwner) {
      if (!(await isOwnerOf(contracts.NounsDescriptorV2.instance, executorAddress))) {
        await contracts.NounsDescriptorV2.instance.transferOwnership(executorAddress);
        console.log(
          'Transferred ownership of the NounsDescriptorV2 to the executor.',
        );
      }
      if (!(await isOwnerOf(contracts.NounsToken.instance, executorAddress))) {
        await contracts.NounsToken.instance.transferOwnership(executorAddress);
        console.log(
            'Transferred ownership of the NounsToken to the executor.',
        );
      }
      if (!(await isOwnerOf(contracts.NounsAuctionHouseProxyAdmin.instance, executorAddress))) {
        await contracts.NounsAuctionHouseProxyAdmin.instance.transferOwnership(executorAddress);
        console.log(
            'Transferred ownership of the NounsAuctionHouseProxyAdmin to the executor.',
        );
      }
    }

    // Optionally kick off the first auction and transfer ownership of the auction house
    // to the Nouns DAO executor.
    const auctionHouse = contracts.NounsAuctionHouse.instance.attach(
      contracts.NounsAuctionHouseProxy.address,
    );
    if (args.startAuction) {
      await auctionHouse.unpause({
        gasLimit: 1_000_000,
      });
      console.log('Started the first auction.');
    }
    if (args.changeOwner) {
      await auctionHouse.transferOwnership(executorAddress);
      console.log('Transferred ownership of the auction house to the executor.');
    }

    // Optionally write the deployed addresses to the SDK and subgraph configs.
    if (args.updateConfigs) {
      await run('update-configs-dao-v3', {
        contracts,
      });
    }

    printContractsTable(contracts);
    console.log('Deployment Complete.');
  });
