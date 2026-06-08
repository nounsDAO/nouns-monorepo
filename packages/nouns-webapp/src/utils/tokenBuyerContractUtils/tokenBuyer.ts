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
