import { ethers } from 'ethers';
import { deflateRawSync } from 'zlib';
import { ContractName, ContractRow, DeployedContract } from '../types';

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
