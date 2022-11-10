import { default as NounsBRAuctionHouseABI } from '../abi/contracts/NounsBRAuctionHouse.sol/NounsBRAuctionHouse.json';
import { task, types } from 'hardhat/config';
import { Interface, parseUnits } from 'ethers/lib/utils';
import { Contract as EthersContract } from 'ethers';
import { ContractName } from './types';

type LocalContractName =
  | Exclude<ContractName, 'NounsBRDAOLogicV1' | 'NounsBRDAOProxy'>
  | 'NounsBRDAOLogicV2'
  | 'NounsBRDAOProxyV2'
  | 'WETH'
  | 'Multicall2';

interface Contract {
  args?: (string | number | (() => string | undefined))[];
  instance?: EthersContract;
  libraries?: () => Record<string, string>;
  waitForConfirmation?: boolean;
}

task('deploy-local', 'Deploy contracts to hardhat')
  .addOptionalParam('noundersbrdao', 'The noundersbr DAO contract address')
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
  .setAction(async (args, { ethers }) => {
    const network = await ethers.provider.getNetwork();
    if (network.chainId !== 31337) {
      console.log(`Invalid chain id. Expected 31337. Got: ${network.chainId}.`);
      return;
    }

    const proxyRegistryAddress = '0xa5409ec958c83c3f309868babaca7c86dcb077c1';

    const NOUNSBR_ART_NONCE_OFFSET = 5;
    const AUCTION_HOUSE_PROXY_NONCE_OFFSET = 10;
    const GOVERNOR_N_DELEGATOR_NONCE_OFFSET = 13;

    const [deployer] = await ethers.getSigners();
    const nonce = await deployer.getTransactionCount();
    const expectedNounsBRArtAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + NOUNSBR_ART_NONCE_OFFSET,
    });
    const expectedNounsBRDAOProxyAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + GOVERNOR_N_DELEGATOR_NONCE_OFFSET,
    });
    const expectedAuctionHouseProxyAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + AUCTION_HOUSE_PROXY_NONCE_OFFSET,
    });
    const contracts: Record<LocalContractName, Contract> = {
      WETH: {},
      NFTDescriptorV2: {},
      SVGRenderer: {},
      NounsBRDescriptorV2: {
        args: [expectedNounsBRArtAddress, () => contracts.SVGRenderer.instance?.address],
        libraries: () => ({
          NFTDescriptorV2: contracts.NFTDescriptorV2.instance?.address as string,
        }),
      },
      Inflator: {},
      NounsBRArt: {
        args: [
          () => contracts.NounsBRDescriptorV2.instance?.address,
          () => contracts.Inflator.instance?.address,
        ],
      },
      NounsBRSeeder: {},
      NounsBRToken: {
        args: [
          args.noundersbrdao || deployer.address,
          expectedAuctionHouseProxyAddress,
          () => contracts.NounsBRDescriptorV2.instance?.address,
          () => contracts.NounsBRSeeder.instance?.address,
          proxyRegistryAddress,
        ],
      },
      NounsBRAuctionHouse: {
        waitForConfirmation: true,
      },
      NounsBRAuctionHouseProxyAdmin: {},
      NounsBRAuctionHouseProxy: {
        args: [
          () => contracts.NounsBRAuctionHouse.instance?.address,
          () => contracts.NounsBRAuctionHouseProxyAdmin.instance?.address,
          () =>
            new Interface(NounsBRAuctionHouseABI).encodeFunctionData('initialize', [
              contracts.NounsBRToken.instance?.address,
              contracts.WETH.instance?.address,
              args.auctionTimeBuffer,
              args.auctionReservePrice,
              args.auctionMinIncrementBidPercentage,
              args.auctionDuration,
            ]),
        ],
      },
      NounsBRDAOExecutor: {
        args: [expectedNounsBRDAOProxyAddress, args.timelockDelay],
      },
      NounsBRDAOLogicV2: {
        waitForConfirmation: true,
      },
      NounsBRDAOProxyV2: {
        args: [
          () => contracts.NounsBRDAOExecutor.instance?.address,
          () => contracts.NounsBRToken.instance?.address,
          args.noundersbrdao || deployer.address,
          () => contracts.NounsBRDAOExecutor.instance?.address,
          () => contracts.NounsBRDAOLogicV2.instance?.address,
          args.votingPeriod,
          args.votingDelay,
          args.proposalThresholdBps,
          {
            minQuorumVotesBPS: args.minQuorumVotesBPS,
            maxQuorumVotesBPS: args.maxQuorumVotesBPS,
            quorumCoefficient: parseUnits(args.quorumCoefficient.toString(), 6),
          },
        ],
        waitForConfirmation: true,
      },
      Multicall2: {},
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

    return contracts;
  });
