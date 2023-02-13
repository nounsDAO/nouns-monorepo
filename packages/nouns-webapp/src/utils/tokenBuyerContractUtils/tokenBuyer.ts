import { useContractCall } from '@usedapp/core';
import { Interface } from 'ethers/lib/utils';
import tokenBuyerABI from './tokenBuyerABI.json';
import { BigNumber as EthersBN } from 'ethers';

const abi = new Interface(tokenBuyerABI);
const BUFFER_BPS = 5_000;

export const useEthNeeded = (address: string, additionalTokens: number, skip?: boolean) => {
  const request = () => {
    if (skip) return false;
    return {
      abi,
      address,
      method: 'ethNeeded',
      args: [additionalTokens, BUFFER_BPS],
    };
  };

  const [ethNeeded] = useContractCall<[EthersBN]>(request()) || [];

  return ethNeeded?.toString();
};
