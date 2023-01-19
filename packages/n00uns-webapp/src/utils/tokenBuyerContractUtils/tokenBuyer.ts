import { useContractCall } from '@usedapp/core';
import { Interface } from 'ethers/lib/utils';
import tokenBuyerABI from './tokenBuyerABI.json';
import { BigNumber as EthersBN } from 'ethers';

const abi = new Interface(tokenBuyerABI);
const BUFFER_BPS = 5_000;

export const useEthNeeded = (address: string, additionalTokens: number) => {
  const [ethNeeded] =
    useContractCall<[EthersBN]>({
      abi,
      address,
      method: 'ethNeeded',
      args: [additionalTokens, BUFFER_BPS],
    }) || [];

  return ethNeeded?.toString();
};
