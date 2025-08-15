import { isNullish } from 'remeda';
import { useBalance } from 'wagmi';

import {
  nounsPayerAddress,
  nounsTokenBuyerAddress,
  useReadEthToUsdPriceOracleLatestAnswer,
  useReadUsdcBalanceOf,
} from '@/contracts';
import { defaultChain } from '@/wagmi';

/**
 * Hook to calculate the total token buyer balance in ETH equivalent
 * Combines ETH balance and USDC balance (converted to ETH using price oracle)
 * @returns Total balance as bigint, or undefined if data is not yet available
 */
function useTokenBuyerBalance(): bigint | undefined {
  const chainId = defaultChain.id;

  // Fetch ETH balance directly
  const { data: ethBalance } = useBalance({
    address: nounsTokenBuyerAddress[chainId],
  });

  // Fetch USDC balance of the payer contract
  const { data: usdcBalance } = useReadUsdcBalanceOf({
    args: nounsPayerAddress[chainId] ? [nounsPayerAddress[chainId]] : undefined,
  });

  // Fetch ETH/USD price for conversion
  const { data: ethUsdcPrice } = useReadEthToUsdPriceOracleLatestAnswer({});

  // If we don't have price data, just return ETH balance without USDC conversion
  if (isNullish(ethUsdcPrice)) {
    return ethBalance?.value;
  }

  // Default to 0n for any undefined values
  const ethValue = ethBalance?.value ?? 0n;

  // Convert USDC to ETH equivalent if available
  const usdcValueInEth =
    !isNullish(usdcBalance) && !isNullish(ethUsdcPrice)
      ? (usdcBalance * 10n ** 20n) / ethUsdcPrice
      : 0n;

  // Return combined balance
  return ethValue + usdcValueInEth;
}

export default useTokenBuyerBalance;
