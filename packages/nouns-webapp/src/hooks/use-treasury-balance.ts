import { useBalance } from 'wagmi';

import {
  nounsLegacyTreasuryAddress,
  nounsTreasuryAddress,
  useReadEthToUsdPriceOracleLatestAnswer,
  useReadStEthBalanceOf,
} from '@/contracts';
import { useReadMEthStakingMEthToEth } from '@/contracts/meth-staking.gen';
import { useReadMEthBalanceOf } from '@/contracts/meth.gen';
import { Address } from '@/utils/types';
import { defaultChain } from '@/wagmi';

import useTokenBuyerBalance from './use-token-buyer-balance';

/**
 * Computes treasury balance (ETH and Lido)
 *
 * @returns Total balance of treasury (ETH and Lido) as bigint
 */
export const useTreasuryBalance = (): bigint => {
  const chainId = defaultChain.id;

  // Get ETH balance for the main treasury
  const { data: ethBalance } = useBalance({
    address: nounsLegacyTreasuryAddress[chainId],
  });

  // Get ETH balance for treasury v2
  const { data: ethBalanceTreasuryV2 } = useBalance({
    address: nounsTreasuryAddress[chainId],
  });

  // Get Lido (stETH) balance for the main treasury
  // @ts-expect-error - Return type from contract call needs manual casting
  const { data: lidoBalanceAsETH } = useReadStEthBalanceOf({
    args: nounsLegacyTreasuryAddress[chainId]
      ? [nounsLegacyTreasuryAddress[chainId] as Address]
      : undefined,
    query: {
      enabled: Boolean(nounsLegacyTreasuryAddress[chainId]),
    },
  }) as { data: bigint | undefined };

  // Get Lido (stETH) balance for treasury v2
  const { data: lidoBalanceTreasuryV2AsETH } = useReadStEthBalanceOf({
    args: nounsTreasuryAddress[chainId] ? [nounsTreasuryAddress[chainId]] : undefined,
    query: {
      enabled: Boolean(nounsTreasuryAddress[chainId]),
    },
  }) as { data: bigint | undefined };

  // Get Mantle (mETH) balance for the main treasury
  const { data: mantleBalanceTreasuryV2 } = useReadMEthBalanceOf({
    args: nounsTreasuryAddress[chainId] ? [nounsTreasuryAddress[chainId]] : undefined,
    query: {
      enabled: Boolean(nounsTreasuryAddress[chainId]),
    },
  }) as { data: bigint | undefined };

  const { data: mEthBalanceAsETH } = useReadMEthStakingMEthToEth({
    query: {
      enabled: mantleBalanceTreasuryV2 !== undefined,
    },
    args: [mantleBalanceTreasuryV2!],
  });

  // Get token buyer balance
  const tokenBuyerBalanceAsETH = useTokenBuyerBalance();

  // Sum all balances, using 0n for any undefined values
  return (
    (ethBalance?.value ?? 0n) +
    (ethBalanceTreasuryV2?.value ?? 0n) +
    (lidoBalanceAsETH ?? 0n) +
    (lidoBalanceTreasuryV2AsETH ?? 0n) +
    (tokenBuyerBalanceAsETH ?? 0n) +
    (mEthBalanceAsETH ?? 0n)
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
  if (ethUsdcPrice === undefined || ethUsdcPrice === 0n) {
    return undefined;
  }

  // Convert ETH price from bigint to number with proper scaling
  // The oracle returns price with 8 decimal places (1e8)
  const ethPriceInUsd = Number(ethUsdcPrice) / 1e8;

  // Convert treasury balance from wei to ETH (1 ETH = 1e18 wei)
  const treasuryBalanceInEth = Number(treasuryBalance) / 1e18;

  // Calculate USD value
  return ethPriceInUsd * treasuryBalanceInEth;
};
