import { useBalance } from 'wagmi';

import { useReadStEthBalanceOf } from '@/contracts';
import { Address } from '@/utils/types';

/**
 * Hook to get the combined ETH and stETH balance of a fork treasury
 *
 * @param treasuryContractAddress The treasury contract address to check balances for
 * @returns The combined balance of ETH and stETH as a bigint
 */
function useForkTreasuryBalance(treasuryContractAddress?: Address): bigint {
  const { data: ethBalanceData } = useBalance({
    address: treasuryContractAddress,
  });

  // @ts-expect-error - Type instantiation too deep
  const stEthRes: any = (useReadStEthBalanceOf as any)({
    args: treasuryContractAddress ? [treasuryContractAddress] : undefined,
    query: { enabled: !!treasuryContractAddress },
  });
  const stEthBalanceData = (stEthRes as any)?.data as bigint | undefined;

  // Use nullish coalescing to provide a default value of 0n for undefined balances
  const ethBalance = ethBalanceData?.value ?? 0n;
  const stEthBalance = stEthBalanceData ?? 0n;

  return ethBalance + stEthBalance;
}

export default useForkTreasuryBalance;
