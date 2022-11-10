import { default as NounsBRAuctionHouseABI } from '../abi/contracts/NounsBRAuctionHouse.sol/NounsBRAuctionHouse.json';
import {
  ChainId,
  ContractDeployment,
  ContractName,
  ContractNameDescriptorV1,
  ContractNamesDAOV2,
  DeployedContract,
} from './types';
import { Interface, parseUnits } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import promptjs from 'prompt';

promptjs.colors = false;
promptjs.message = '> ';
promptjs.delimiter = '';

const proxyRegistries: Record<number, string> = {
  [ChainId.Mainnet]: '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
  [ChainId.Rinkeby]: '0xf57b2c51ded3a29e6891aba85459d600256cf317',
  [ChainId.Goerli]: '0x3D8911A6253b1df0e13D49DbAfb130fBA1821FB9',
};
const wethContracts: Record<number, string> = {
  [ChainId.Mainnet]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [ChainId.Ropsten]: '0xc778417e063141139fce010982780140aa0cd5ab',
  [ChainId.Rinkeby]: '0xc778417e063141139fce010982780140aa0cd5ab',
  [ChainId.Kovan]: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
  [ChainId.Goerli]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
};

const NOUNSBR_ART_NONCE_OFFSET = 4;
const AUCTION_HOUSE_PROXY_NONCE_OFFSET = 9;
const GOVERNOR_N_DELEGATOR_NONCE_OFFSET = 12;

task('deploy', 'Deploy all NounsBR contracts with short gov times for testing')
  .addFlag('autoDeploy', 'Deploy all contracts without user interaction')
  .addOptionalParam('weth', 'The WETH contract address', undefined, types.string)
  .addOptionalParam('noundersbrdao', 'The noundersbr DAO contract address', '0x3c68309658218f9eE50E659390b3C23A4F5c1400', types.string)
  .addOptionalParam(
    'auctionTimeBuffer',
    'The auction time buffer (seconds)',
    60 /* 60 seconds */,
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
    60 * 15 /* 15 minutes */,
    types.int,
  )
  .addOptionalParam('timelockDelay', 'The timelock delay (seconds)', 60 /* 1 min */, types.int)
  .addOptionalParam(
    'votingPeriod',
    'The voting period (blocks)',
    80 /* 20 min (15s blocks) */,
    types.int,
  )
  .addOptionalParam('votingDelay', 'The voting delay (blocks)', 1, types.int)
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
  .addOptionalParam('quorumCoefficient', 'Dynamic quorum coefficient (float)', 1, types.float)
  .setAction(async (args, { ethers }) => {
    const network = await ethers.provider.getNetwork();
    const [deployer] = await ethers.getSigners();

    // prettier-ignore
    const proxyRegistryAddress = proxyRegistries[network.chainId] ?? proxyRegistries[ChainId.Goerli];

    if (!args.noundersbrdao) {
      console.log(
        `NoundersBR DAO address not provided. Setting to deployer (${deployer.address})...`,
      );
      args.noundersbrdao = deployer.address;
    }
    if (!args.weth) {
      const deployedWETHContract = wethContracts[network.chainId];
      if (!deployedWETHContract) {
        throw new Error(
          `Can not auto-detect WETH contract on chain ${network.name}. Provide it with the --weth arg.`,
        );
      }
      args.weth = deployedWETHContract;
    }

    const nonce = await deployer.getTransactionCount();
    const expectedNounsBRArtAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + NOUNSBR_ART_NONCE_OFFSET,
    });
    const expectedAuctionHouseProxyAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + AUCTION_HOUSE_PROXY_NONCE_OFFSET,
    });
    const expectedNounsBRDAOProxyAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + GOVERNOR_N_DELEGATOR_NONCE_OFFSET,
    });
    const deployment: Record<ContractNamesDAOV2, DeployedContract> = {} as Record<
      ContractNamesDAOV2,
      DeployedContract
    >;
    const contracts: Record<ContractNamesDAOV2, ContractDeployment> = {
      NFTDescriptorV2: {},
      SVGRenderer: {},
      NounsBRDescriptorV2: {
        args: [expectedNounsBRArtAddress, () => deployment.SVGRenderer.address],
        libraries: () => ({
          NFTDescriptorV2: deployment.NFTDescriptorV2.address,
        }),
      },
      Inflator: {},
      NounsBRArt: {
        args: [() => deployment.NounsBRDescriptorV2.address, () => deployment.Inflator.address],
      },
      NounsBRSeeder: {},
      NounsBRToken: {
        args: [
          args.noundersbrdao,
          expectedAuctionHouseProxyAddress,
          () => deployment.NounsBRDescriptorV2.address,
          () => deployment.NounsBRSeeder.address,
          proxyRegistryAddress,
        ],
      },
      NounsBRAuctionHouse: {
        waitForConfirmation: true,
      },
      NounsBRAuctionHouseProxyAdmin: {},
      NounsBRAuctionHouseProxy: {
        args: [
          () => deployment.NounsBRAuctionHouse.address,
          () => deployment.NounsBRAuctionHouseProxyAdmin.address,
          () =>
            new Interface(NounsBRAuctionHouseABI).encodeFunctionData('initialize', [
              deployment.NounsBRToken.address,
              args.weth,
              args.auctionTimeBuffer,
              args.auctionReservePrice,
              args.auctionMinIncrementBidPercentage,
              args.auctionDuration,
            ]),
        ],
        waitForConfirmation: true,
        validateDeployment: () => {
          const expected = expectedAuctionHouseProxyAddress.toLowerCase();
          const actual = deployment.NounsBRAuctionHouseProxy.address.toLowerCase();
          if (expected !== actual) {
            throw new Error(
              `Unexpected auction house proxy address. Expected: ${expected}. Actual: ${actual}.`,
            );
          }
        },
      },
      NounsBRDAOExecutor: {
        args: [expectedNounsBRDAOProxyAddress, args.timelockDelay],
      },
      NounsBRDAOLogicV2: {
        waitForConfirmation: true,
      },
      NounsBRDAOProxyV2: {
        args: [
          () => deployment.NounsBRDAOExecutor.address,
          () => deployment.NounsBRToken.address,
          args.noundersbrdao,
          () => deployment.NounsBRDAOExecutor.address,
          () => deployment.NounsBRDAOLogicV2.address,
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
        validateDeployment: () => {
          const expected = expectedNounsBRDAOProxyAddress.toLowerCase();
          const actual = deployment.NounsBRDAOProxyV2.address.toLowerCase();
          if (expected !== actual) {
            throw new Error(
              `Unexpected NounsBR DAO proxy address. Expected: ${expected}. Actual: ${actual}.`,
            );
          }
        },
      },
    };

    for (const [name, contract] of Object.entries(contracts)) {
      let gasPrice = await ethers.provider.getGasPrice();
      if (!args.autoDeploy) {
        const gasInGwei = Math.round(Number(ethers.utils.formatUnits(gasPrice, 'gwei')));

        promptjs.start();

        const result = await promptjs.get([
          {
            properties: {
              gasPrice: {
                type: 'integer',
                required: true,
                description: 'Enter a gas price (gwei)',
                default: gasInGwei,
              },
            },
          },
        ]);
        gasPrice = ethers.utils.parseUnits(result.gasPrice.toString(), 'gwei');
      }

      /*
      let nameForFactory: string;
      switch (name) {
        case 'NounsBRDAOExecutor':
          nameForFactory = 'NounsBRDAOExecutorTest';
          break;
        case 'NounsBRDAOLogicV2':
          nameForFactory = 'NounsBRDAOLogicV2Harness';
          break;
        default:
          nameForFactory = name;
          break;
      }
      */

      const factory = await ethers.getContractFactory(name, {
        libraries: contract?.libraries?.(),
      });

      const deploymentGas = await factory.signer.estimateGas(
        factory.getDeployTransaction(
          ...(contract.args?.map(a => (typeof a === 'function' ? a() : a)) ?? []),
          {
            gasPrice,
          },
        ),
      );
      const deploymentCost = deploymentGas.mul(gasPrice);

      console.log(
        `Estimated cost to deploy ${name}: ${ethers.utils.formatUnits(
          deploymentCost,
          'ether',
        )} ETH`,
      );

      if (!args.autoDeploy) {
        const result = await promptjs.get([
          {
            properties: {
              confirm: {
                pattern: /^(DEPLOY|SKIP|EXIT)$/,
                description:
                  'Type "DEPLOY" to confirm, "SKIP" to skip this contract, or "EXIT" to exit.',
              },
            },
          },
        ]);
        if (result.operation === 'SKIP') {
          console.log(`Skipping ${name} deployment...`);
          continue;
        }
        if (result.operation === 'EXIT') {
          console.log('Exiting...');
          return;
        }
      }
      console.log(`Deploying ${name}...`);

      const deployedContract = await factory.deploy(
        ...(contract.args?.map(a => (typeof a === 'function' ? a() : a)) ?? []),
        {
          gasPrice,
        },
      );

      if (contract.waitForConfirmation) {
        await deployedContract.deployed();
      }

      deployment[name as ContractNamesDAOV2] = {
        name,
        instance: deployedContract,
        address: deployedContract.address,
        constructorArguments: contract.args?.map(a => (typeof a === 'function' ? a() : a)) ?? [],
        libraries: contract?.libraries?.() ?? {},
      };

      contract.validateDeployment?.();

      console.log(`${name} contract deployed to ${deployedContract.address}`);
    }

    return deployment;
  });
