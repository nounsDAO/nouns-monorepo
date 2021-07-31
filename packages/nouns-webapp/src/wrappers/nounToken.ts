import { useContractCall } from '@usedapp/core';
import { BigNumber, utils } from 'ethers';
import nounsTokenABI from '../abis/NounsToken.json';
import config from '../config';

interface NounToken {
  name: string;
  description: string;
  image: string;
}

interface NounSeed {
  accessory: number;
  background: number;
  body: number;
  glasses: number;
  head: number;
}

export const useNounToken = (nounId: BigNumber) => {
  const noun = useContractCall({
    abi: new utils.Interface(nounsTokenABI),
    address: config.tokenAddress,
    method: 'dataURI',
    args: [nounId],
  }) as { [key: string]: any };

  if (!noun) {
    return;
  }

  const nounImgData = noun[0].split(';base64,').pop();
  let json = JSON.parse(atob(nounImgData));

  return json as NounToken;
};

export const useNounSeed = (nounId: BigNumber) => {
  const seed = useContractCall({
    abi: new utils.Interface(nounsTokenABI),
    address: config.tokenAddress,
    method: 'seeds',
    args: [nounId],
  }) as { [key: string]: any };
  return seed as NounSeed;
};
