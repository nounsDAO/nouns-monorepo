/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useReadNounsTokenBuyerEthNeeded } from '@/contracts';

export const TOKEN_BUYER_BUFFER_BPS = 1_000n;

export const useEthNeeded = (address: string, additionalTokens: number, skip?: boolean) => {
  const { data: ethNeeded } = useReadNounsTokenBuyerEthNeeded({
    args: [BigInt(additionalTokens), TOKEN_BUYER_BUFFER_BPS],
    query: { enabled: !skip && !!address },
  });

  return ethNeeded ? ethNeeded.toString() : undefined;
};

type TokenBuyerTransaction = {
  address: string;
  value?: bigint;
};

export const isTokenBuyerTopUpTransaction = (
  transaction: TokenBuyerTransaction | undefined,
  tokenBuyerAddress: string | undefined,
) =>
  transaction !== undefined &&
  tokenBuyerAddress !== undefined &&
  transaction.address.toLowerCase() === tokenBuyerAddress.toLowerCase();

export const getTokenBuyerTopUpTransactionEth = (
  transactions: TokenBuyerTransaction[],
  tokenBuyerAddress: string | undefined,
  fallbackEth: string,
) => {
  const tokenBuyerTopUp = transactions.find(transaction =>
    isTokenBuyerTopUpTransaction(transaction, tokenBuyerAddress),
  );

  return tokenBuyerTopUp === undefined ? fallbackEth : String(tokenBuyerTopUp.value ?? 0n);
};
