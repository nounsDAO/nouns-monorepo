import { useBalance } from 'wagmi';

import config from '@/config';
import { useReadEthToUsdPriceOracleLatestAnswer, useReadStEthBalanceOf } from '@/contracts';
import { Address } from '@/utils/types';

import useTokenBuyerBalance from './useTokenBuyerBalance';

/**
 * Computes treasury balance (ETH and Lido)
 *
 * @returns Total balance of treasury (ETH and Lido) as bigint
 */
export const useTreasuryBalance = (): bigint => {
  // Get ETH balance for main treasury
  const { data: ethBalance } = useBalance({
    address: config.addresses.nounsDaoExecutor as Address,
  });

  // Get ETH balance for treasury v2
  const { data: ethBalanceTreasuryV2 } = useBalance({
    address: config.addresses.nounsDaoExecutorProxy as Address,
  });

  // Get Lido (stETH) balance for the main treasury
  // @ts-expect-error - Return type from contract call needs manual casting
  const { data: lidoBalanceAsETH } = useReadStEthBalanceOf({
    args: config.addresses.nounsDaoExecutor
      ? [config.addresses.nounsDaoExecutor as Address]
      : undefined,
    query: {
      enabled: Boolean(config.addresses.nounsDaoExecutor),
    },
  }) as { data: bigint | undefined };

  // Get Lido (stETH) balance for treasury v2
  const { data: lidoBalanceTreasuryV2AsETH } = useReadStEthBalanceOf({
    args: config.addresses.nounsDaoExecutorProxy
      ? [config.addresses.nounsDaoExecutorProxy as Address]
      : undefined,
    query: {
      enabled: Boolean(config.addresses.nounsDaoExecutorProxy),
    },
  }) as { data: bigint | undefined };

  // Get token buyer balance
  const tokenBuyerBalanceAsETH = useTokenBuyerBalance();

  // Sum all balances, using 0n for any undefined values
  return (
    (ethBalance?.value ?? 0n) +
    (ethBalanceTreasuryV2?.value ?? 0n) +
    (lidoBalanceAsETH ?? 0n) +
    (lidoBalanceTreasuryV2AsETH ?? 0n) +
    (tokenBuyerBalanceAsETH ?? 0n)
  );
};

/**
 * Computes treasury USD value of treasury assets (ETH and Lido) at current ETH-USD exchange rate
 *
 * @returns USD value of treasury assets as a number or undefined if data is not available
 */
export const useTreasuryUSDValue = (): number | undefined => {
  // Fetch ETH/USD price for conversion
  const { data: ethUsdcPrice } = useReadEthToUsdPriceOracleLatestAnswer({});

  // Get total treasury balance (ETH and Lido)
  const treasuryBalance = useTreasuryBalance();

  // If either price or balance is not available, return undefined
  if (!ethUsdcPrice || ethUsdcPrice === 0n) {
    return undefined;
  }

  // Convert from bigint to number for easier display
  // Using Number() and formatEther would be another approach if needed
  const usdValue = Number(ethUsdcPrice * treasuryBalance) / 10 ** 8; // Chainlink price feeds typically use 8 decimals

  return usdValue;
};
