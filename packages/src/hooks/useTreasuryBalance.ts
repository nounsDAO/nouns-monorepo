import { useEtherBalance } from '@usedapp/core';
import useLidoBalance from './useLidoBalance';
import useTokenBuyerBalance from './useTokenBuyerBalance';
import { useCoingeckoPrice } from '@usedapp/coingecko';
import config from '../config';
import { BigNumber, ethers } from 'ethers';

/**
 * Computes treasury balance (ETH + Lido)
 *
 * @returns Total balance of treasury (ETH + Lido) as EthersBN
 */
export const useTreasuryBalance = () => {
  const ethBalance = useEtherBalance(config.addresses.nounsDaoExecutor);
  const ethBalanceTreasuryV2 = useEtherBalance(config.addresses.nounsDaoExecutorProxy);
  const lidoBalanceAsETH = useLidoBalance(config.addresses.nounsDaoExecutor);
  const lidoBalanceTreasuryV2AsETH = useLidoBalance(config.addresses.nounsDaoExecutorProxy);
  const tokenBuyerBalanceAsETH = useTokenBuyerBalance();

  const zero = BigNumber.from(0);
  return (
    ethBalance
      ?.add(ethBalanceTreasuryV2 ?? zero)
      .add(lidoBalanceAsETH ?? zero)
      .add(lidoBalanceTreasuryV2AsETH ?? zero)
      .add(tokenBuyerBalanceAsETH ?? zero) ?? zero
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
