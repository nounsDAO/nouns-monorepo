import { useCoingeckoPrice } from '@usedapp/coingecko';
import { ethers } from 'ethers';
import { useBalance } from 'wagmi';

import config from '@/config';
import { useReadStEthBalanceOf } from '@/contracts';
import { Address } from '@/utils/types';

import useTokenBuyerBalance from './useTokenBuyerBalance';

/**
 * Computes treasury balance (ETH and Lido)
 *
 * @returns Total balance of treasury (ETH and Lido) as EthersBN
 */
export const useTreasuryBalance = () => {
  const { data: ethBalance } = useBalance({
    address: config.addresses.nounsDaoExecutor as Address,
  });

  const { data: ethBalanceTreasuryV2 } = useBalance({
    address: config.addresses.nounsDaoExecutorProxy as Address,
  });

  // @ts-expect-error - useReadStEthBalanceOf has an incompatible return type
  const { data: lidoBalanceAsETH } = useReadStEthBalanceOf({
    args: config.addresses.nounsDaoExecutor
      ? [config.addresses.nounsDaoExecutor as Address]
      : (undefined as unknown as [Address]),
    query: { enabled: !!config.addresses.nounsDaoExecutor },
  });

  const { data: lidoBalanceTreasuryV2AsETH } = useReadStEthBalanceOf({
    args: config.addresses.nounsDaoExecutorProxy
      ? [config.addresses.nounsDaoExecutorProxy as Address]
      : (undefined as unknown as [Address]),
    query: { enabled: !!config.addresses.nounsDaoExecutorProxy },
  });

  const tokenBuyerBalanceAsETH = useTokenBuyerBalance();

  return (
    (ethBalance?.value ?? 0n) +
    (ethBalanceTreasuryV2?.value ?? 0n) +
    (lidoBalanceAsETH ?? 0n) +
    (lidoBalanceTreasuryV2AsETH ?? 0n) +
    (tokenBuyerBalanceAsETH?.toBigInt() ?? 0n)
  );
};

/**
 * Computes treasury usd value of treasury assets (ETH and Lido) at current ETH-USD exchange rate
 *
 * @returns USD value of treasury assets (ETH and Lido) at current exchange rate
 */
export const useTreasuryUSDValue = () => {
  const etherPrice = Number(useCoingeckoPrice('ethereum', 'usd'));
  const treasuryBalanceETH = Number(
    ethers.utils.formatEther(useTreasuryBalance()?.toString() || '0'),
  );
  return etherPrice * treasuryBalanceETH;
};
