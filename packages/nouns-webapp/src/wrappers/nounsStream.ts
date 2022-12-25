import { useContractCall, useContractFunction, useEthers } from '@usedapp/core';
import { utils, BigNumber, Contract } from 'ethers';
import streamABI from '../utils/streamingPaymentUtils/stream.abi.json';

const abi = new utils.Interface(streamABI);

export const useStreamRemaningBalance = (streamAddress: string, userAddress: string) => {
  const [balance] =
    useContractCall<[BigNumber]>({
      abi,
      address: streamAddress,
      method: 'balanceOf',
      args: [userAddress],
    }) || [];

  return balance;
};

export const useStreamRatePerSecond = (streamAddress: string, scaling?: number) => {
  const [rps] = useContractCall<[BigNumber]>({
    abi,
    address: streamAddress,
    method: 'ratePerSecond',
    args: [],
  }) || [BigNumber.from(0)];

  if (!scaling) {
    return rps;
  }
  return rps.div(BigNumber.from(scaling));
};

export const useWithdrawTokens = (streamAddress: string) => {
  const { library } = useEthers();
  const { send: widthdrawTokens, state: widthdrawTokensState } = useContractFunction(
    new Contract(streamAddress, abi, library),
    'withdraw',
  );
  return { widthdrawTokens, widthdrawTokensState };
};
