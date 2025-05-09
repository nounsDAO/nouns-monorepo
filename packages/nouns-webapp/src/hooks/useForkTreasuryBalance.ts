import { useEtherBalance } from '@usedapp/core';
import { BigNumber } from 'ethers';
import useLidoBalance from './useLidoBalance';

function useForkTreasuryBalance(treasuryContractAddress?: string) {
  const ethBalance = useEtherBalance(treasuryContractAddress);
  const lidoBalanceAsETH = useLidoBalance(treasuryContractAddress);

  const zero = BigNumber.from(0);
  return ethBalance?.add(lidoBalanceAsETH ?? zero) ?? zero;
}

export default useForkTreasuryBalance;
