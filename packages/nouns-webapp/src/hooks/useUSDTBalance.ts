import { useMemo, useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useEthers } from '@usedapp/core';
import { utils, BigNumber } from 'ethers';
import config from '../config';
import ERC20 from '../libs/abi/ERC20.json';

const { addresses } = config;

const erc20Interface = new utils.Interface(ERC20);

function useUSDTBalance(): BigNumber | undefined {
  const { library } = useEthers();

  const [balance, setBalance] = useState(undefined);

  const usdtContract = useMemo((): Contract | undefined => {
    if (!library || !addresses.usdtToken) return;
    return new Contract(addresses.usdtToken, erc20Interface, library);
  }, [library]);

  useEffect(() => {
    if (!usdtContract || !addresses.atxDaoTreasury) return;
    usdtContract.balanceOf(addresses.atxDaoTreasury).then(setBalance);
  }, [usdtContract]);

  return balance;
}

export default useUSDTBalance;
