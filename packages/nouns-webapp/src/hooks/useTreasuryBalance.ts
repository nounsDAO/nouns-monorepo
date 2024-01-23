import { useEtherBalance } from '@usedapp/core';
import useLidoBalance from './useLidoBalance';
import useUSDCBalance from './useUSDCBalance';
import useUSDTBalance from './useUSDTBalance';
import useTokenBuyerBalance from './useTokenBuyerBalance';
import { useCoingeckoPrice } from '@usedapp/coingecko';
import config from '../config';
// import { formatEther } from '@ethersproject/units'
import { BigNumber, ethers } from 'ethers';
import { CHAIN_ID } from '../config';
import { useState } from 'react'
import { useEffect } from 'react'

/**
 * Computes treasury balance (ETH + Lido)
 *
 * @returns Total balance of treasury (ETH + Lido) as EthersBN
 */
export const useTreasuryBalance = () => {
  const ethBalance = useEtherBalance('0x407Cf0e5Dd3C2c4bCE5a32B92109c2c6f7f1ce23');
  const lidoBalanceAsETH = useLidoBalance();
  const tokenBuyerBalanceAsETH = useTokenBuyerBalance();

  const zero = BigNumber.from(0);
  return ethBalance?.add(lidoBalanceAsETH ?? zero).add(tokenBuyerBalanceAsETH ?? zero) ?? zero;
};


/**
 * Computes treasury usd value of treasury assets (ETH + Lido) at current ETH-USD exchange rate
 *
 * @returns USD value of treasury assets (ETH + Lido + USDC) at current exchange rate
 */
export const useTreasuryUSDValue = () => {

  const zero = BigNumber.from(0);

  const etherPrice = Number(useCoingeckoPrice('ethereum', 'usd'));

  const treasuryBalanceETH = Number(
    ethers.utils.formatEther(useEtherBalanceUsingEthers(config.addresses.atxDaoTreasury)?.toString() || "1337"),
  );
  const ethValue = Number(etherPrice * treasuryBalanceETH);

  const usdcBalance = useUSDCBalance()?.div(10**6);
  const usdtBalance = useUSDTBalance()?.div(10**6);

  return Number((usdcBalance ?? zero).add(usdtBalance ?? zero)) + ethValue;
};


export function useEtherBalanceUsingEthers(address: string | undefined): BigNumber | undefined {
  const [balance, setBalance] = useState<BigNumber>();

  useEffect(()=> {
    async function get() {
      if (!address)
        return;

      let provider;

      if (CHAIN_ID === 1) {
        provider = ethers.getDefaultProvider("https://eth-mainnet.g.alchemy.com/v2/wEdkAUlsWlrcGPvQseMu2CWlOBuikWd-");
      } else if (CHAIN_ID === 5) {
        provider = ethers.getDefaultProvider("https://eth-goerli.g.alchemy.com/v2/WhEZSVFYZ4deQ07SrL9J0XY33dQLsd9r");
      } else if (CHAIN_ID === 31337) {
        provider = ethers.getDefaultProvider("http://localhost:8545");
      }

      if (provider !== undefined)
      {
        const balance = await provider.getBalance(address);
        setBalance(balance);
      }

    }
      get();
  }, []);

  return balance;
}