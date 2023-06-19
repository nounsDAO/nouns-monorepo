import { default as AuctionHouseABI } from '../abi/contracts/AuctionHouse.sol/AuctionHouse.json';
import { ChainId, ContractDeployment, ContractName, DeployedContract } from './types';
import { Interface } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import promptjs from 'prompt';

promptjs.colors = false;
promptjs.message = '> ';
promptjs.delimiter = '';

const proxyRegistries: Record<number, string> = {
  [ChainId.Mainnet]: '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
  [ChainId.Rinkeby]: '0xf57b2c51ded3a29e6891aba85459d600256cf317',
};
const wethContracts: Record<number, string> = {
  [ChainId.Mainnet]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [ChainId.Ropsten]: '0xc778417e063141139fce010982780140aa0cd5ab',
  [ChainId.Rinkeby]: '0xc778417e063141139fce010982780140aa0cd5ab',
  [ChainId.Kovan]: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
  [ChainId.Goerli]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  [ChainId.Mumbai]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  [ChainId.Polygon]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  [ChainId.BscTestNet]:'0x4DB5a66E937A9F4473fA95b1cAF1d1E1D62E29EA'
};

const NOUNS_ART_NONCE_OFFSET = 4;
const AUCTION_HOUSE_PROXY_NONCE_OFFSET = 9;
const GOVERNOR_N_DELEGATOR_NONCE_OFFSET = 12;

task('deploy', 'Deploys NFTDescriptor, Descriptor, Seeder, and VrbsToken')
  .addFlag('autoDeploy', 'Deploy all contracts without user interaction')
  .addOptionalParam('weth', 'The WETH contract address', undefined, types.string)
  .addOptionalParam('vrbsdao', 'The vrbs DAO contract address', undefined, types.string)
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
    60 * 60 * 24 /* 24 hours */,
    types.int,
  )
  .addOptionalParam(
    'timelockDelay',
    'The timelock delay (seconds)',
    60 * 60 * 24 * 2 /* 2 days */,
    types.int,
  )
  .addOptionalParam(
    'votingPeriod',
    'The voting period (blocks)',
    Math.round(4 * 60 * 24 * (60 / 2)) /* 4 days (2s blocks) */,
    types.int,
  )
  .addOptionalParam(
    'votingDelay',
    'The voting delay (blocks)',
    Math.round(3 * 60 * 24 * (60 / 2)) /* 3 days (2s blocks) */,
    types.int,
  )
  .addOptionalParam(
    'proposalThresholdBps',
    'The proposal threshold (basis points)',
    100 /* 1% */,
    types.int,
  )
  .addOptionalParam(
    'quorumVotesBps',
    'Votes required for quorum (basis points)',
    1_000 /* 10% */,
    types.int,
  )
  .setAction(async (args, { ethers }) => {
    const network = await ethers.provider.getNetwork();
    const [deployer] = await ethers.getSigners();

    // prettier-ignore
    const proxyRegistryAddress = proxyRegistries[network.chainId] ?? proxyRegistries[ChainId.Rinkeby];

    if (!args.vrbsdao) {
      console.log(
        `Vrbs DAO address not provided. Setting to deployer (${deployer.address})...`,
      );
      args.vrbsdao = deployer.address;
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
    const expectedVrbsArtAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + NOUNS_ART_NONCE_OFFSET,
    });
    const expectedAuctionHouseProxyAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + AUCTION_HOUSE_PROXY_NONCE_OFFSET,
    });
    const expectedVrbsDAOProxyAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + GOVERNOR_N_DELEGATOR_NONCE_OFFSET,
    });
    const deployment: Record<ContractName, DeployedContract> = {} as Record<
      ContractName,
      DeployedContract
    >;
    const contracts: Record<ContractName, ContractDeployment> = {
      NFTDescriptorV2: {},
      SVGRenderer: {},
      DescriptorV2: {
        args: [expectedVrbsArtAddress, () => deployment.SVGRenderer.address],
        libraries: () => ({
          NFTDescriptorV2: deployment.NFTDescriptorV2.address,
        }),
      },
      Inflator: {},
      Art: {
        args: [() => deployment.DescriptorV2.address, () => deployment.Inflator.address],
      },
      Seeder2: {},
      VrbsToken: {
        args: [
          args.vrbsdao,
          expectedAuctionHouseProxyAddress,
          () => deployment.DescriptorV2.address,
          () => deployment.Seeder2.address,
          proxyRegistryAddress,
        ],
      },
      AuctionHouse: {
        waitForConfirmation: true,
      },
      AuctionHouseProxyAdmin: {},
      AuctionHouseProxy: {
        args: [
          () => deployment.AuctionHouse.address,
          () => deployment.AuctionHouseProxyAdmin.address,
          () =>
            new Interface(AuctionHouseABI).encodeFunctionData('initialize', [
              deployment.VrbsToken.address,
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
          const actual = deployment.AuctionHouseProxy.address.toLowerCase();
          if (expected !== actual) {
            throw new Error(
              `Unexpected auction house proxy address. Expected: ${expected}. Actual: ${actual}.`,
            );
          }
        },
      },
      DAOExecutor: {
        args: [expectedVrbsDAOProxyAddress, args.timelockDelay],
      },
      DAOLogicV1: {
        waitForConfirmation: true,
      },
      DAOProxy: {
        args: [
          () => deployment.DAOExecutor.address,
          () => deployment.VrbsToken.address,
          args.vrbsdao,
          () => deployment.DAOExecutor.address,
          () => deployment.DAOLogicV1.address,
          args.votingPeriod,
          args.votingDelay,
          args.proposalThresholdBps,
          args.quorumVotesBps,
        ],
        waitForConfirmation: true,
        validateDeployment: () => {
          const expected = expectedVrbsDAOProxyAddress.toLowerCase();
          const actual = deployment.DAOProxy.address.toLowerCase();
          if (expected !== actual) {
            throw new Error(
              `Unexpected Vrbs DAO proxy address. Expected: ${expected}. Actual: ${actual}.`,
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

      deployment[name as ContractName] = {
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
