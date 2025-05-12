import { useReadContract, useWriteContract } from 'wagmi';

import streamABI from '@/utils/streamingPaymentUtils/stream.abi.json';
import { Address } from '@/utils/types';

const abi = streamABI;

export const useStreamRemainingBalance = (streamAddress: Address) => {
  const { data: balance } = useReadContract({
    abi,
    address: streamAddress,
    functionName: 'recipientBalance',
    query: { enabled: Boolean(streamAddress) },
  });

  return BigInt(balance?.toString() ?? 0);
};

export const useWithdrawTokens = (streamAddress: Address) => {
  const { writeContract, isPending, status, error } = useWriteContract();

  const withdrawTokens = (amount: bigint) => {
    writeContract({
      abi,
      address: streamAddress,
      functionName: 'withdraw',
      args: [amount],
    });
  };

  const withdrawTokensState = {
    status: isPending ? 'Mining' : status || 'None',
    errorMessage: error?.message,
  };

  return { withdrawTokens, withdrawTokensState };
};

export const useElapsedTime = (streamAddress: Address) => {
  const { data: elapsedTime } = useReadContract({
    abi,
    address: streamAddress,
    functionName: 'elapsedTime',
    query: { enabled: Boolean(streamAddress) },
  });

  return BigInt(Number(elapsedTime?.toString() ?? 0));
};
