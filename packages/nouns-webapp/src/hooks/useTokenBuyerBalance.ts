import { useBalance } from 'wagmi';

import { useReadEthToUsdPriceOracleLatestAnswer, useReadUsdcBalanceOf } from '@/contracts';

import config from '../config';

const { addresses } = config;

/**
 * Hook to calculate the total token buyer balance in ETH equivalent
 * Combines ETH balance and USDC balance (converted to ETH using price oracle)
 * @returns Total balance as bigint, or undefined if data is not yet available
 */
function useTokenBuyerBalance(): bigint | undefined {
  // Fetch ETH balance directly
  const { data: ethBalance } = useBalance({
    address: addresses.tokenBuyer,
  });

  // Fetch USDC balance of the payer contract
  const { data: usdcBalance } = useReadUsdcBalanceOf({
    args: addresses.payerContract ? [addresses.payerContract] : undefined,
  });

  // Fetch ETH/USD price for conversion
  const { data: ethUsdcPrice } = useReadEthToUsdPriceOracleLatestAnswer({});

  // If we don't have price data, just return ETH balance without USDC conversion
  if (!ethUsdcPrice) {
    return ethBalance?.value;
  }

  // Default to 0n for any undefined values
  const ethValue = ethBalance?.value ?? 0n;

  // Convert USDC to ETH equivalent if available
  const usdcValueInEth = usdcBalance && ethUsdcPrice ? usdcBalance * ethUsdcPrice : 0n;

  // Return combined balance
  return ethValue + usdcValueInEth;
}

export default useTokenBuyerBalance;
