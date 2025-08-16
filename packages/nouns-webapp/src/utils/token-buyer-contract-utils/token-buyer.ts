import { useReadNounsTokenBuyerEthNeeded } from '@/contracts';

const BUFFER_BPS = 5_000n;

export const useEthNeeded = (address: string, additionalTokens: number, skip?: boolean) => {
  const { data: ethNeeded } = useReadNounsTokenBuyerEthNeeded({
    args: [BigInt(additionalTokens), BUFFER_BPS],
    query: { enabled: skip !== true && Boolean(address) },
  });

  return ethNeeded !== undefined ? ethNeeded.toString() : undefined;
};
