import { useMemo, useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useEthers } from '@usedapp/core';
import { utils, BigNumber } from 'ethers';
import config from '../config';
import ERC20 from '../libs/abi/ERC20.json';

const { addresses } = config;

const erc20Interface = new utils.Interface(ERC20);

function useUSDCBalance(): BigNumber | undefined {
  const { library } = useEthers();

  const [balance, setBalance] = useState(undefined);

  const usdcContract = useMemo((): Contract | undefined => {
    if (!library || !addresses.usdcToken) return;
    return new Contract(addresses.usdcToken, erc20Interface, library);
  }, [library]);

  useEffect(() => {
    if (!usdcContract || !addresses.atxDaoTreasury) return;
    usdcContract.balanceOf(addresses.atxDaoTreasury).then(setBalance);
  }, [usdcContract]);

  return balance;
}

export default useUSDCBalance;
