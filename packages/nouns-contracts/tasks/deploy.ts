import { task } from 'hardhat/config';
import promptjs from 'prompt';

promptjs.colors = false;
promptjs.message = '> ';
promptjs.delimiter = '';

type ContractName = 'NFTDescriptor' | 'NounsDescriptor' | 'NounsSeeder' | 'NounsERC721';

interface Contract {
  args?: (string | number | (() => string | undefined))[];
  address?: string;
  libraries?: () => Record<string, string>;
}

task('deploy', 'Deploys NFTDescriptor, NounsDescriptor, NounsSeeder, and NounsERC721')
  .addParam('noundersDAO', 'The nounders DAO contract address')
  .addParam('nounsAuctionHouse', 'The NounsAuctionHouse proxy contract address')
  .setAction(async ({ noundersDAO, nounsAuctionHouse }, { ethers }) => {
    const contracts: Record<ContractName, Contract> = {
      NFTDescriptor: {},
      NounsDescriptor: {
        libraries: () => ({
          NFTDescriptor: contracts['NFTDescriptor'].address as string,
        }),
      },
      NounsSeeder: {},
      NounsERC721: {
        args: [
          noundersDAO,
          nounsAuctionHouse,
          () => contracts['NounsDescriptor'].address,
          () => contracts['NounsSeeder'].address,
        ],
      },
    };

    for (const [name, contract] of Object.entries(contracts)) {
      const factory = await ethers.getContractFactory(name, {
        libraries: contract?.libraries?.(),
      });

      let gasPrice = await factory.signer.getGasPrice();
      const gasInGwei = Math.round(Number(ethers.utils.formatUnits(gasPrice, 'gwei')));

      promptjs.start();

      let result = await promptjs.get([
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

      result = await promptjs.get([
        {
          properties: {
            confirm: {
              type: 'string',
              description: 'Type "DEPLOY" to confirm:',
            },
          },
        },
      ]);

      if (result.confirm != 'DEPLOY') {
        console.log('Exiting');
        return;
      }

      console.log('Deploying...');

      const deployedContract = await factory.deploy(
        ...(contract.args?.map(a => (typeof a === 'function' ? a() : a)) ?? []),
        {
          gasPrice,
        },
      );

      contracts[name as ContractName].address = deployedContract.address;

      console.log(`${name} contract deployed to ${deployedContract.address}`);
    }

    return contracts;
  });
