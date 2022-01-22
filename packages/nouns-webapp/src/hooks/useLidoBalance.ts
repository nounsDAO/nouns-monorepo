import { useMemo, useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { utils, BigNumber } from 'ethers';
import config from '../config';
import ERC20 from '../libs/abi/ERC20.json';
import { useWeb3Context } from './useWeb3';

const { addresses } = config;

const erc20Interface = new utils.Interface(ERC20);

function useLidoBalance(): BigNumber | undefined {
  const { provider } = useWeb3Context();

  const [balance, setBalance] = useState(undefined);

  const lidoContract = useMemo((): Contract | undefined => {
    if (!provider || !addresses.lidoToken) return;
    return new Contract(addresses.lidoToken, erc20Interface, provider);
  }, [provider]);

  useEffect(() => {
    if (!lidoContract || !addresses.nounsDaoExecutor) return;
    lidoContract.balanceOf(addresses.nounsDaoExecutor).then(setBalance);
  }, [lidoContract]);

  return balance;
}

export default useLidoBalance;
