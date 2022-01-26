import { useEtherBalance } from '@usedapp/core';
import useLidoBalance from './useLidoBalance';
import config from '../config';

/**
 * Computes treasury balance (ETH + Lido)
 *
 * @returns Total balance of treasury (ETH + Lido) as EthersBN
 */
export const useTreasuryBalance = () => {
  const ethBalance = useEtherBalance(config.addresses.nounsDaoExecutor);
  const lidoBalanceAsETH = useLidoBalance();
  return ethBalance && lidoBalanceAsETH && ethBalance.add(lidoBalanceAsETH);
};
