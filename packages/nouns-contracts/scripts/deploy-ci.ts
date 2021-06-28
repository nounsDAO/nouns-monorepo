import { ethers } from 'hardhat';
import fs from 'fs';

type ContractName = 'NFTDescriptor' | 'NounsDescriptor' | 'NounsSeeder' | 'NounsERC721';

interface Contract {
  args?: (string | number | (() => string | undefined))[];
  address?: string;
  libraries?: () => Record<string, string>;
}

async function main() {
  const [nounsDAO] = await ethers.getSigners(); // Use during development only

  const contracts: Record<ContractName, Contract> = {
    NFTDescriptor: {},
    NounsDescriptor: {
      args: [nounsDAO.address],
      libraries: () => ({
        NFTDescriptor: contracts['NFTDescriptor'].address as string,
      }),
    },
    NounsSeeder: {},
    NounsERC721: {
      args: [
        nounsDAO.address,
        () => contracts['NounsDescriptor'].address,
        () => contracts['NounsSeeder'].address,
      ],
    },
  };

  for (const [name, contract] of Object.entries(contracts)) {
    const factory = await ethers.getContractFactory(name, {
      libraries: contract?.libraries?.(),
    });

    const gasPrice = await factory.signer.getGasPrice();

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
      `Estimated cost to deploy ${name}: ${ethers.utils.formatUnits(deploymentCost, 'ether')} ETH`,
    );

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

  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
  }
  fs.writeFileSync(
    'logs/deploy.json',
    JSON.stringify({
      contractAddresses: {
        NFTDescriptor: contracts.NFTDescriptor.address,
        NounsDescriptor: contracts.NounsDescriptor.address,
        NounsSeeder: contracts.NounsSeeder.address,
        NounsERC721: contracts.NounsERC721.address,
      },
      gitHub: {
        // Get the commit sha when running in CI
        sha: process.env.GITHUB_SHA,
      },
    }),
    { flag: 'w' },
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
