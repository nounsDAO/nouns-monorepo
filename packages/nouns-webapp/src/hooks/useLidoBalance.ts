import { useMemo, useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useEthers } from '@usedapp/core';
import { utils, BigNumber } from 'ethers';
import config from '../config';
import ERC20 from '../libs/abi/ERC20.json';

const { addresses } = config;

const erc20Interface = new utils.Interface(ERC20);

function useLidoBalance(address: string | undefined): BigNumber | undefined {
  const { library } = useEthers();

  const [balance, setBalance] = useState(undefined);

  const lidoContract = useMemo((): Contract | undefined => {
    if (!library || !addresses.lidoToken) return;
    return new Contract(addresses.lidoToken, erc20Interface, library);
  }, [library]);

  useEffect(() => {
    if (!lidoContract || !address) return;
    lidoContract.balanceOf(address).then(setBalance);
  }, [lidoContract, address]);

  return balance;
}

export default useLidoBalance;
