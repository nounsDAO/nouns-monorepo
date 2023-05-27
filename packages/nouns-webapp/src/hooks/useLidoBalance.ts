import { useMemo, useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useEthers } from '@usedapp/core';
import { utils, BigNumber } from 'ethers';
import config from '../config';
import ERC20 from '../libs/abi/ERC20.json';

const { addresses } = config;
console.log(addresses)

const erc20Interface = new utils.Interface(ERC20);

function useLidoBalance(): BigNumber | undefined {
  const { library } = useEthers();

  const [balance, setBalance] = useState(undefined);

  const lidoContract = useMemo((): Contract | undefined => {
    if (!library || !addresses.lidoToken) return;
    // @ts-ignore
    return new Contract(addresses.lidoToken, erc20Interface, library);
  }, [library]);

  useEffect(() => {
    if (!lidoContract || !addresses.nDaoExecutor) return;
    // console.log(lidoContract)
    // console.log(lidoContract.balanceOf(addresses.nDaoExecutor, { gasLimit: "21432" }))
    lidoContract.balanceOf(addresses.nDaoExecutor).then(setBalance);
  }, [lidoContract]);

  return balance;
}

export default useLidoBalance;
