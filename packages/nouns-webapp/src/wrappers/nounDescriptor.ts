import { useContractCall } from '@usedapp/core';
import { BigNumber, utils } from 'ethers';
import nounsDescriptorAbi from '../abis/NounsDescriptor.json';
import config from '../config';
import { NounToken } from './nounToken';


export const useNounDescriptor = (nounId: BigNumber, seed: number[] ) => {
  const nextSeed = useContractCall({
    abi: new utils.Interface(nounsDescriptorAbi),
    address: config.descriptorAddress,
    method: 'tokenURI',
    args: [nounId, seed],
  }) as { [key: string]: any };

  if (!nextSeed) {
    return;
  }

  const nounImgData = nextSeed[0].split(';base64,').pop();
  let json = JSON.parse(atob(nounImgData));

  return json as NounToken;
};
