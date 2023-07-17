import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { utils } from 'ethers';

function useForkTreasuryBalance(treasuryContractAddress?: string) {
  const { library } = useEthers();

  const [balance, setBalance] = useState<number | undefined>();

  useEffect(() => {
    if (!library || !treasuryContractAddress) return;
    library.getBalance(treasuryContractAddress).then((value) => setBalance(+utils.formatEther(value)));
  }, [library, treasuryContractAddress]);

  return balance?.toFixed(2);
}

export default useForkTreasuryBalance;
