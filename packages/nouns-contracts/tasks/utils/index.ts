import { HardhatEthersHelpers } from '@nomiclabs/hardhat-ethers/types';
import type { BigNumber, ContractFactory, ethers as ethersType } from 'ethers';
import { ethers, utils } from 'ethers';
import promptjs from 'prompt';
import { deflateRawSync } from 'zlib';
import { ContractName, ContractRow, DeployedContract } from '../types';

promptjs.colors = false;
promptjs.message = '> ';
promptjs.delimiter = '';

export async function getGasPriceWithPrompt(
  ethers: typeof ethersType & HardhatEthersHelpers,
): Promise<BigNumber> {
  const gasPrice = await ethers.provider.getGasPrice();
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

  return ethers.utils.parseUnits(result.gasPrice.toString(), 'gwei');
}

export async function getDeploymentConfirmationWithPrompt(): Promise<boolean> {
  const result = await promptjs.get([
    {
      properties: {
        confirm: {
          type: 'string',
          description: 'Type "DEPLOY" to confirm:',
        },
      },
    },
  ]);

  return result.confirm == 'DEPLOY';
}

export async function printEstimatedCost(factory: ContractFactory, gasPrice: BigNumber) {
  const deploymentGas = await factory.signer.estimateGas(
    factory.getDeployTransaction({ gasPrice }),
  );
  const deploymentCost = deploymentGas.mul(gasPrice);
  console.log(
    `Estimated cost to deploy NounsDAOLogicV2: ${utils.formatUnits(deploymentCost, 'ether')} ETH`,
  );
}

export function dataToDescriptorInput(data: string[]): {
  encodedCompressed: string;
  originalLength: number;
  itemCount: number;
} {
  const abiEncoded = ethers.utils.defaultAbiCoder.encode(['bytes[]'], [data]);
  const encodedCompressed = `0x${deflateRawSync(
    Buffer.from(abiEncoded.substring(2), 'hex'),
  ).toString('hex')}`;

  const originalLength = abiEncoded.substring(2).length / 2;
  const itemCount = data.length;

  return {
    encodedCompressed,
    originalLength,
    itemCount,
  };
}

export function printContractsTable(contracts: Record<ContractName, DeployedContract>) {
  console.table(
    Object.values<DeployedContract>(contracts).reduce(
      (acc: Record<string, ContractRow>, contract: DeployedContract) => {
        acc[contract.name] = {
          Address: contract.address,
        };
        if (contract.instance?.deployTransaction) {
          acc[contract.name]['Deployment Hash'] = contract.instance.deployTransaction.hash;
        }
        return acc;
      },
      {},
    ),
  );
}
