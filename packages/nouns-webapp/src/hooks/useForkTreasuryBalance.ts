import { useBalance } from 'wagmi';

import { useReadStEthBalanceOf } from '@/contracts';

function useForkTreasuryBalance(treasuryContractAddress?: `0x${string}`) {
  const { data: ethBalanceData } = useBalance({
    address: treasuryContractAddress,
  });

  // @ts-expect-error - Type definition for useReadStEthBalanceOf doesn't match actual implementation
  const { data: stEthBalanceData } = useReadStEthBalanceOf({
    args: treasuryContractAddress ? [treasuryContractAddress] : undefined,
    query: { enabled: !!treasuryContractAddress },
  });

  const eth = (ethBalanceData as bigint | undefined) ?? 0n;
  const stEth = (stEthBalanceData as bigint | undefined) ?? 0n;

  return eth + stEth;
}

export default useForkTreasuryBalance;
