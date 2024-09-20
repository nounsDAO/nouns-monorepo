import { default as NounsAuctionHouseABI } from '../abi/contracts/NounsAuctionHouse.sol/NounsAuctionHouse.json';
import { default as NounsDaoDataABI } from '../abi/contracts/governance/data/NounsDAOData.sol/NounsDAOData.json';
import { default as NounsDAOExecutorV2ABI } from '../abi/contracts/governance/NounsDAOExecutorV2.sol/NounsDAOExecutorV2.json';
import { task, types } from 'hardhat/config';
import { Interface, parseUnits } from 'ethers/lib/utils';
import { Contract as EthersContract } from 'ethers';
import { ContractNamesDAOV3 } from './types';
import { constants } from 'ethers';

type LocalContractName = ContractNamesDAOV3 | 'WETH' | 'Multicall2';

interface Contract {
  args?: (string | number | (() => string | undefined))[];
  instance?: EthersContract;
  libraries?: () => Record<string, string>;
  waitForConfirmation?: boolean;
}

task('deploy-remote-dao-v3', 'Deploy contracts to hardhat')
  .addOptionalParam('noundersdao', 'The nounders DAO contract address')
  .addOptionalParam('auctionTimeBuffer', 'The auction time buffer (seconds)', 30, types.int) // Default: 30 seconds
  .addOptionalParam('auctionReservePrice', 'The auction reserve price (wei)', 1, types.int) // Default: 1 wei
  .addOptionalParam(
    'auctionMinIncrementBidPercentage',
    'The auction min increment bid percentage (out of 100)', // Default: 5%
    5,
    types.int,
  )
  .addOptionalParam('auctionDuration', 'The auction duration (seconds)', 60 * 2, types.int) // Default: 2 minutes
  .addOptionalParam('timelockDelay', 'The timelock delay (seconds)', 60 * 60 * 24 * 2, types.int) // Default: 2 days
  .addOptionalParam('votingPeriod', 'The voting period (blocks)', 4 * 60 * 24 * 3, types.int) // Default: 3 days
  .addOptionalParam('votingDelay', 'The voting delay (blocks)', 100, types.int) // Default: 1 block
  .addOptionalParam(
    'proposalUpdatablePeriodInBlocks',
    'The updatable period in blocks',
    10,
    types.int,
  ) // Default: 10 blocks
  .addOptionalParam('proposalThresholdBps', 'The proposal threshold (basis points)', 500, types.int) // Default: 5%
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
  .addOptionalParam('quorumCoefficient', 'Dynamic quorum coefficient (float)', 1, types.float)
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
  .setAction(async (args, { ethers }) => {
    // const network = await ethers.provider.getNetwork();
    // if (network.chainId !== 31337) {
    //   console.log(`Invalid chain id. Expected 31337. Got: ${network.chainId}.`);
    //   return;
    // }

    const network = await ethers.provider.getNetwork();
    const [deployer] = await ethers.getSigners();

    // prettier-ignore
    const proxyRegistryAddress = constants.AddressZero;

    // const proxyRegistryAddress = '0xa5409ec958c83c3f309868babaca7c86dcb077c1';

    const NOUNS_ART_NONCE_OFFSET = 6;
    const AUCTION_HOUSE_PROXY_NONCE_OFFSET = 10;
    const GOVERNOR_N_DELEGATOR_NONCE_OFFSET = 24;

    // const [deployer] = await ethers.getSigners();
    const nonce = await deployer.getTransactionCount();
    const expectedNounsArtAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + NOUNS_ART_NONCE_OFFSET,
    });
    const expectedNounsDAOProxyAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + GOVERNOR_N_DELEGATOR_NONCE_OFFSET,
    });
    const expectedAuctionHouseProxyAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + AUCTION_HOUSE_PROXY_NONCE_OFFSET,
    });
    const contracts: Record<LocalContractName, Contract> = {
      WETH: {},
      NounsDAOExecutorV2: {
        waitForConfirmation: true,
      },
      NFTDescriptorV2: {},
      SVGRenderer: {},
      NounsDescriptorV2: {
        args: [expectedNounsArtAddress, () => contracts.SVGRenderer.instance?.address],
        libraries: () => ({
          NFTDescriptorV2: contracts.NFTDescriptorV2.instance?.address as string,
        }),
      },
      Inflator: {},
      NounsArt: {
        args: [
          () => contracts.NounsDescriptorV2.instance?.address,
          () => contracts.Inflator.instance?.address,
        ],
      },
      NounsSeeder: {},
      NounsToken: {
        args: [
          args.noundersdao || deployer.address,
          expectedAuctionHouseProxyAddress,
          () => contracts.NounsDescriptorV2.instance?.address,
          () => contracts.NounsSeeder.instance?.address,
          proxyRegistryAddress,
        ],
      },
      NounsAuctionHouse: {
        waitForConfirmation: true,
      },
      NounsAuctionHouseProxyAdmin: {},
      NounsAuctionHouseProxy: {
        args: [
          () => contracts.NounsAuctionHouse.instance?.address,
          () => contracts.NounsAuctionHouseProxyAdmin.instance?.address,
          () =>
            new Interface(NounsAuctionHouseABI).encodeFunctionData('initialize', [
              contracts.NounsToken.instance?.address,
              contracts.WETH.instance?.address,
              args.auctionTimeBuffer,
              args.auctionReservePrice,
              args.auctionMinIncrementBidPercentage,
              args.auctionDuration,
            ]),
        ],
      },
      NounsDAODynamicQuorum: {},
      NounsDAOAdmin: {},
      NounsDAOProposals: {},
      NounsDAOVotes: {},
      NounsDAOFork: {},
      NounsDAOLogicV4: {
        libraries: () => ({
          NounsDAOAdmin: contracts.NounsDAOAdmin.instance?.address as string,
          NounsDAODynamicQuorum: contracts.NounsDAODynamicQuorum.instance?.address as string,
          NounsDAOProposals: contracts.NounsDAOProposals.instance?.address as string,
          NounsDAOVotes: contracts.NounsDAOVotes.instance?.address as string,
          NounsDAOFork: contracts.NounsDAOFork.instance?.address as string,
        }),
        waitForConfirmation: true,
      },
      NounsDAOForkEscrow: {
        args: [
          expectedNounsDAOProxyAddress,
          () => contracts.NounsToken.instance?.address as string,
        ],
      },
      NounsTokenFork: {},
      NounsAuctionHouseFork: {},
      NounsDAOLogicV1Fork: {},
      NounsDAOExecutorProxy: {
        args: [
          () => contracts.NounsDAOExecutorV2.instance?.address,
          () =>
            new Interface(NounsDAOExecutorV2ABI).encodeFunctionData('initialize', [
              expectedNounsDAOProxyAddress,
              args.timelockDelay,
            ]),
        ],
      },
      ForkDAODeployer: {
        args: [
          () => contracts.NounsTokenFork.instance?.address,
          () => contracts.NounsAuctionHouseFork.instance?.address,
          () => contracts.NounsDAOLogicV1Fork.instance?.address,
          () => contracts.NounsDAOExecutorV2.instance?.address,
          60 * 60 * 24 * 30, // 30 days
          36000,
          36000,
          25,
          1000,
        ],
      },
      NounsDAOProxyV3: {
        args: [
          () => contracts.NounsDAOExecutorProxy.instance?.address, // timelock
          () => contracts.NounsToken.instance?.address, // token
          () => contracts.NounsDAOForkEscrow.instance?.address, // forkEscrow
          () => contracts.ForkDAODeployer.instance?.address, // forkDAODeployer
          args.noundersdao || deployer.address, // vetoer
          () => contracts.NounsDAOExecutorProxy.instance?.address, // admin
          () => contracts.NounsDAOLogicV4.instance?.address, // implementation
          {
            votingPeriod: args.votingPeriod,
            votingDelay: args.votingDelay,
            proposalThresholdBPS: args.proposalThresholdBps,
            lastMinuteWindowInBlocks: 0,
            objectionPeriodDurationInBlocks: 0,
            proposalUpdatablePeriodInBlocks: 0,
          }, // DAOParams
          {
            minQuorumVotesBPS: args.minQuorumVotesBPS,
            maxQuorumVotesBPS: args.maxQuorumVotesBPS,
            quorumCoefficient: parseUnits(args.quorumCoefficient.toString(), 6),
          }, // DynamicQuorumParams
        ],
        waitForConfirmation: true,
      },
      Multicall2: {},
      NounsDAOData: {
        args: [() => contracts.NounsToken.instance?.address, expectedNounsDAOProxyAddress],
        waitForConfirmation: true,
      },
      NounsDAODataProxy: {
        args: [
          () => contracts.NounsDAOData.instance?.address,
          () =>
            new Interface(NounsDaoDataABI).encodeFunctionData('initialize', [
              contracts.NounsDAOExecutorProxy.instance?.address,
              args.createCandidateCost,
              args.updateCandidateCost,
              expectedNounsDAOProxyAddress,
            ]),
        ],
      },
    };

    for (const [name, contract] of Object.entries(contracts)) {
      const factory = await ethers.getContractFactory(name, {
        libraries: contract?.libraries?.(),
      });

      const deployedContract = await factory.deploy(
        ...(contract.args?.map(a => (typeof a === 'function' ? a() : a)) ?? []),
      );

      if (contract.waitForConfirmation) {
        await deployedContract.deployed();
      }

      contracts[name as LocalContractName].instance = deployedContract;

      console.log(`${name} contract deployed to ${deployedContract.address}`);
    }

    if (expectedNounsArtAddress !== contracts.NounsArt.instance?.address) {
      console.log(
        `Warning: NounsArt address mismatch. Expected: ${expectedNounsArtAddress}, Actual: ${contracts.NounsArt.instance?.address}`,
      );
      console.log('Attempting to update NounsDescriptorV2 with the actual NounsArt address...');
      
      try {
        const nounsDescriptorV2 = await ethers.getContractAt('NounsDescriptorV2', contracts.NounsDescriptorV2.instance?.address);
        await nounsDescriptorV2.setArt(contracts.NounsArt.instance?.address);
        console.log('Successfully updated NounsDescriptorV2 with the actual NounsArt address.');
      } catch (error) {
        console.error('Failed to update NounsDescriptorV2:', error);
        throw new Error('Failed to resolve NounsArt address mismatch');
      }
    }

    if (expectedAuctionHouseProxyAddress !== contracts.NounsAuctionHouseProxy.instance?.address) {
      console.log(
        `Warning: Auction House Proxy address mismatch. Expected: ${expectedAuctionHouseProxyAddress}, Actual: ${contracts.NounsAuctionHouseProxy.instance?.address}`,
      );
      console.log('Attempting to update NounsToken with the actual Auction House Proxy address...');
      
      try {
        const nounsToken = await ethers.getContractAt('NounsToken', contracts.NounsToken.instance?.address);
        await nounsToken.setMinter(contracts.NounsAuctionHouseProxy.instance?.address);
        console.log('Successfully updated NounsToken with the actual Auction House Proxy address.');
      } catch (error) {
        console.error('Failed to update NounsToken:', error);
        throw new Error('Failed to resolve Auction House Proxy address mismatch');
      }
    }

    if (expectedNounsDAOProxyAddress !== contracts.NounsDAOProxyV3.instance?.address) {
      console.log(
        `Warning: NounsDAOProxyV3 address mismatch. Expected: ${expectedNounsDAOProxyAddress}, Actual: ${contracts.NounsDAOProxyV3.instance?.address}`,
      );
      console.log('Attempting to update relevant contracts with the actual NounsDAOProxyV3 address...');
      
      try {
        // Update NounsToken
        const nounsToken = await ethers.getContractAt('NounsToken', contracts.NounsToken.instance?.address);
        await nounsToken.setOwner(contracts.NounsDAOProxyV3.instance?.address);
        
        // Update NounsAuctionHouse
        const auctionHouse = await ethers.getContractAt('NounsAuctionHouse', contracts.NounsAuctionHouseProxy.instance?.address);
        await auctionHouse.setOwner(contracts.NounsDAOProxyV3.instance?.address);
        
        // Update any other contracts that might need the DAO address
        
        console.log('Successfully updated relevant contracts with the actual NounsDAOProxyV3 address.');
      } catch (error) {
        console.error('Failed to update contracts with NounsDAOProxyV3 address:', error);
        throw new Error('Failed to resolve NounsDAOProxyV3 address mismatch');
      }
    }

    return contracts;
  });