import { useContractCall, useContractFunction, useEthers } from '@usedapp/core';
import { utils, BigNumber, Contract } from 'ethers';
import streamABI from '../utils/streamingPaymentUtils/stream.abi.json';

const abi = new utils.Interface(streamABI);

export const useStreamRemaningBalance = (streamAddress: string, userAddress: string) => {

  const [balance] =
    useContractCall<[BigNumber]>({
      abi,
      address: streamAddress,
      method: 'recipientBalance',
    }) || [];

  return balance?.toString();
};

export const useWithdrawTokens = (streamAddress: string) => {
  const { library } = useEthers();
  const { send: widthdrawTokens, state: widthdrawTokensState } = useContractFunction(
    new Contract(streamAddress, abi, library),
    'withdraw',
  );
  return { widthdrawTokens, widthdrawTokensState };
};
