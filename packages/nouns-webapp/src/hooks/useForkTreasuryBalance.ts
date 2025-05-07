import { useBalance } from 'wagmi';

import { useReadStEthBalanceOf } from '@/contracts';
import { Address } from '@/utils/types';

function useForkTreasuryBalance(treasuryContractAddress?: Address) {
  const { data: ethBalanceData } = useBalance({
    address: treasuryContractAddress,
  });

  const { data: stEthBalanceData } = useReadStEthBalanceOf({
    args: treasuryContractAddress ? [treasuryContractAddress] : undefined,
    query: { enabled: !!treasuryContractAddress },
  });

  const eth = (ethBalanceData as bigint | undefined) ?? 0n;
  const stEth = (stEthBalanceData as bigint | undefined) ?? 0n;

  return eth + stEth;
}

export default useForkTreasuryBalance;
