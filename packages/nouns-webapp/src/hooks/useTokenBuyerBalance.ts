import { useMemo, useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useEthers } from '@usedapp/core';
import { utils, BigNumber } from 'ethers';
import ERC20 from '../libs/abi/ERC20.json';
import config from '../config';

const { addresses } = config;

const erc20Interface = new utils.Interface(ERC20);
const chainlinkInterface = ['function latestAnswer() external view returns (int256)'];

function useTokenBuyerBalance(): BigNumber | undefined {
  const { library } = useEthers();

  const [ethBalance, setETHBalance] = useState<BigNumber | undefined>();
  const [usdcBalance, setUSDCBalance] = useState<BigNumber | undefined>();
  const [ethUsdcPrice, setETHUSDCPrice] = useState<BigNumber | undefined>();

  const usdcContract = useMemo((): Contract | undefined => {
    if (!library || !addresses.usdcToken) return;
    return new Contract(addresses.usdcToken, erc20Interface, library);
  }, [library]);
  const chainlinkEthUsdcContract = useMemo((): Contract | undefined => {
    if (!library || !addresses.chainlinkEthUsdc) return;
    return new Contract(addresses.chainlinkEthUsdc, chainlinkInterface, library);
  }, [library]);

  useEffect(() => {
    if (!library || !addresses.tokenBuyer) return;
    library.getBalance(addresses.tokenBuyer).then(setETHBalance);
  }, [library]);

  useEffect(() => {
    if (!usdcContract || !addresses.payerContract) return;
    usdcContract.balanceOf(addresses.payerContract).then(setUSDCBalance);
  }, [usdcContract]);

  useEffect(() => {
    if (!chainlinkEthUsdcContract) return;
    chainlinkEthUsdcContract.latestAnswer().then(setETHUSDCPrice);
  }, [chainlinkEthUsdcContract]);

  if (!ethUsdcPrice) {
    return ethBalance;
  }
  return ethBalance?.add(
    usdcBalance?.mul(BigNumber.from(10).pow(20)).div(ethUsdcPrice) ?? BigNumber.from(0),
  );
}

export default useTokenBuyerBalance;
