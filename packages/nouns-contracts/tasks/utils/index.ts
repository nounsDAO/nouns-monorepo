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

export interface Acc {
  accType: number;
  accId: number;
}

export interface Seed {
  punkType: number;
  skinTone: number;
  accessories: Array<Acc>;
}

// this function must be the same as test/nouns.test.ts/calculateSeedHash()
// the above function is tested against contract logic
// if changed please update here
export function calculateSeedHash(seed: Seed) {
  const data = [];

  if (seed.punkType > 255) {
    throw new Error('Invalid value');
  }
  data.push(seed.punkType);
  if (seed.skinTone > 255) {
    throw new Error('Invalid value');
  }
  data.push(seed.skinTone);
  if (seed.accessories.length > 14) {
    throw new Error('Invalid value');
  }
  data.push(seed.accessories.length);
  seed.accessories.sort((acc1, acc2) => acc1.accType - acc2.accType);
  let prevAccType = -1; // check if acc types repeat
  seed.accessories.forEach( acc => {
    if (acc.accType > 255 || acc.accId > 255 || acc.accType == prevAccType) {
      throw new Error('Invalid value');
    }
    prevAccType = acc.accType;
    data.push(acc.accType);
    data.push(acc.accId);
  });

  let seedHash = '';
  data.forEach(n => { seedHash = (n > 15 ? '' : '0') + n.toString(16) + seedHash; });
  seedHash = '0x' + seedHash.padStart(64, '0');

  return seedHash;
}
