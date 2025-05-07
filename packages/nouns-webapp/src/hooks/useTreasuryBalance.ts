import { useCoingeckoPrice } from '@usedapp/coingecko';
import { ethers } from 'ethers';
import { useBalance } from 'wagmi';

import config from '@/config';
import { useReadStEthBalanceOf } from '@/contracts';

import useTokenBuyerBalance from './useTokenBuyerBalance';

/**
 * Computes treasury balance (ETH + Lido)
 *
 * @returns Total balance of treasury (ETH + Lido) as EthersBN
 */
export const useTreasuryBalance = () => {
  const { data: ethBalance } = useBalance({
    address: config.addresses.nounsDaoExecutor as `0x${string}`,
  });

  const { data: ethBalanceTreasuryV2 } = useBalance({
    address: config.addresses.nounsDaoExecutorProxy as `0x${string}`,
  });

  // @ts-expect-error - Type definition for useReadStEthBalanceOf doesn't match actual implementation
  const { data: lidoBalanceAsETH } = useReadStEthBalanceOf({
    args: config.addresses.nounsDaoExecutor
      ? [config.addresses.nounsDaoExecutor as `0x${string}`]
      : undefined,
    query: { enabled: !!config.addresses.nounsDaoExecutor },
  });

  const { data: lidoBalanceTreasuryV2AsETH } = useReadStEthBalanceOf({
    args: config.addresses.nounsDaoExecutorProxy
      ? [config.addresses.nounsDaoExecutorProxy as `0x${string}`]
      : undefined,
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
 * Computes treasury usd value of treasury assets (ETH + Lido) at current ETH-USD exchange rate
 *
 * @returns USD value of treasury assets (ETH + Lido) at current exchange rate
 */
export const useTreasuryUSDValue = () => {
  const etherPrice = Number(useCoingeckoPrice('ethereum', 'usd'));
  const treasuryBalanceETH = Number(
    ethers.utils.formatEther(useTreasuryBalance()?.toString() || '0'),
  );
  return etherPrice * treasuryBalanceETH;
};
