import { utils, BigNumber } from 'ethers';
import config from '../config';
import ERC20 from '../libs/abi/ERC20.json';
import { useContractCall } from '@usedapp/core';

const { addresses } = config;

const erc20Interface = new utils.Interface(ERC20);

function useUSDTBalance(): BigNumber | undefined {
  const [etherBalance] =
    useContractCall({
          abi: erc20Interface,
          address: addresses.usdtToken,
          method: 'balanceOf',
          args: [addresses.atxDaoTreasury],
        }
    ) ?? []
  return etherBalance
}

export default useUSDTBalance;
