import { useMemo, useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useEthers } from '@usedapp/core';
import { utils, BigNumber } from 'ethers';
import config from '../config';
import ERC20 from '../libs/abi/ERC20.json';

const {
  addresses: { lidoToken, nounsDaoExecutor },
} = config;

const abi = new utils.Interface(ERC20);

function useLidoBalance(): BigNumber | undefined {
  const { library } = useEthers();

  const [balance, setBalance] = useState(undefined);

  const contract = useMemo(() => {
    return library && lidoToken && new Contract(lidoToken, abi, library);
  }, [library]);

  useEffect(() => {
    if (!contract || !nounsDaoExecutor) return;
    contract.balanceOf(nounsDaoExecutor).then(setBalance);
  }, [contract]);

  return balance;
}

export default useLidoBalance;
