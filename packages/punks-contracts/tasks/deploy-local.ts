import { default as NAuctionHouseABI } from '../abi/contracts/NAuctionHouse.sol/NAuctionHouse.json';
import { task, types } from 'hardhat/config';
import { Interface } from 'ethers/lib/utils';
import { Contract as EthersContract } from 'ethers';
import { ContractName } from './types';

type LocalContractName = ContractName | 'WETH' | 'CryptopunksMock' | 'WrappedPunkMock' |  'CryptopunksVote';

interface Contract {
  args?: (string | number | (() => string | undefined))[];
  instance?: EthersContract;
  libraries?: () => Record<string, string>;
  waitForConfirmation?: boolean;
}

task('deploy-local', 'Deploy contracts to hardhat')
  .addOptionalParam('punkers', 'The punkers (creator org) address')
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
  .addOptionalParam('votingDelay', 'The voting delay (blocks)', 1, types.int) // Default: 1 block
  .addOptionalParam('proposalThresholdBps', 'The proposal threshold (basis points)', 500, types.int) // Default: 5%
  .addOptionalParam('quorumVotesBps', 'Votes required for quorum (basis points)', 1_000, types.int) // Default: 10%
  .setAction(async (args, { ethers }) => {
    const network = await ethers.provider.getNetwork();
    if (network.chainId !== 31337) {
      console.log(`Invalid chain id. Expected 31337. Got: ${network.chainId}.`);
      return;
    }

    const N_ART_NONCE_OFFSET = 8;
    const AUCTION_HOUSE_PROXY_NONCE_OFFSET = 13;
    const GOVERNOR_N_DELEGATOR_NONCE_OFFSET = 16;

    const [deployer] = await ethers.getSigners();
    const nonce = await deployer.getTransactionCount();
    const expectedNArtAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + N_ART_NONCE_OFFSET,
    });
    const expectedNDAOProxyAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + GOVERNOR_N_DELEGATOR_NONCE_OFFSET,
    });
    const expectedAuctionHouseProxyAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + AUCTION_HOUSE_PROXY_NONCE_OFFSET,
    });
    const contracts: Record<LocalContractName, Contract> = {
      WETH: {},
      CryptopunksMock: {},
      WrappedPunkMock: {
        args: [() => contracts.CryptopunksMock.instance?.address]
      },
      CryptopunksVote: {
        args: [() => contracts.CryptopunksMock.instance?.address, () => contracts.WrappedPunkMock.instance?.address]
      },
      NFTDescriptorV2: {},
      SVGRenderer: {},
      NDescriptorV2: {
        args: [expectedNArtAddress, () => contracts.SVGRenderer.instance?.address],
        libraries: () => ({
          NFTDescriptorV2: contracts.NFTDescriptorV2.instance?.address as string,
        }),
      },
      Inflator: {},
      NArt: {
        args: [
          () => contracts.NDescriptorV2.instance?.address,
          () => contracts.Inflator.instance?.address,
        ],
      },
      NSeeder: {},
      NToken: {
        args: [
          args.punkers || deployer.address,
          expectedAuctionHouseProxyAddress,
          () => contracts.NDescriptorV2.instance?.address,
          () => contracts.NSeeder.instance?.address,
        ],
      },
      NAuctionHouse: {
        waitForConfirmation: true,
      },
      NAuctionHouseProxyAdmin: {},
      NAuctionHouseProxy: {
        args: [
          () => contracts.NAuctionHouse.instance?.address,
          () => contracts.NAuctionHouseProxyAdmin.instance?.address,
          () =>
            new Interface(NAuctionHouseABI).encodeFunctionData('initialize', [
              contracts.NToken.instance?.address,
              contracts.WETH.instance?.address,
              args.auctionTimeBuffer,
              args.auctionReservePrice,
              args.auctionMinIncrementBidPercentage,
              args.auctionDuration,
            ]),
        ],
      },
      NDAOExecutor: {
        args: [expectedNDAOProxyAddress, args.timelockDelay],
      },
      NDAOLogicV1: {
        waitForConfirmation: true,
      },
      NDAOProxy: {
        args: [
          () => contracts.NDAOExecutor.instance?.address,
          () => contracts.NToken.instance?.address,
          () => contracts.CryptopunksVote.instance?.address,
          args.punkers || deployer.address,
          () => contracts.NDAOExecutor.instance?.address,
          () => contracts.NDAOLogicV1.instance?.address,
          args.votingPeriod,
          args.votingDelay,
          args.proposalThresholdBps,
          args.quorumVotesBps,
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

      contracts[name as ContractName].instance = deployedContract;

      console.log(`${name} contract deployed to ${deployedContract.address}`);
    }

    return contracts;
  });
