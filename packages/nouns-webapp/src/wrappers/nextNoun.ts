import { useContractCall } from '@usedapp/core';
import { BigNumber, utils } from 'ethers';
import nounsSeederAbi from '../abis/NounsSeeder.json';
import config from '../config';

export const useNextNoun = (nounId: BigNumber) => {
  const nextSeed = useContractCall({
    abi: new utils.Interface(nounsSeederAbi),
    address: config.seederAddress,
    method: 'generateSeed',
    args: [nounId, config.descriptorAddress],
  })
  return nextSeed
};
