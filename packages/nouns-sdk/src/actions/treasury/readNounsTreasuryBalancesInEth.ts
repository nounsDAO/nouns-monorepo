import { getBalance, getChainId, type Config } from '@wagmi/core';

import { readEthToUsdPriceOracleLatestAnswer } from '../treasury-assets/eth-usd-price-oracle.gen.js';
import { readMEthStakingMEthToEth } from '../treasury-assets/meth-staking.gen.js';
import { readMEthBalanceOf } from '../treasury-assets/meth.gen.js';
import { readREthBalanceOf, readREthGetExchangeRate } from '../treasury-assets/reth.gen.js';
import { readStEthBalanceOf } from '../treasury-assets/steth.gen.js';
import { readUsdcBalanceOf } from '../treasury-assets/usdc.gen.js';
import { readWethBalanceOf } from '../treasury-assets/weth.gen.js';
import { readWstEthBalanceOf } from '../treasury-assets/wsteth.gen.js';
import { nounsTreasuryAddress } from '../treasury.gen.js';
import { nounsUsdcPayerAddress } from '../usdc-payer.gen.js';

export type TreasuryBalancesInEthData = {
  ETH: bigint;
  wETH: bigint;
  mETH: bigint;
  rETH: bigint;
  stETH: bigint;
  wstETH: bigint;
  USDC: bigint;
  payerContractUSDC: bigint;
  total: bigint;
};

export interface ReadNounsTreasuryBalancesInEthOptions {
  blockNumber?: bigint;
  chainId?: keyof typeof nounsTreasuryAddress;
}

export const readNounsTreasuryBalancesInEth = async (
  config: Config,
  { blockNumber, chainId: chainIdOverride }: ReadNounsTreasuryBalancesInEthOptions = {},
): Promise<TreasuryBalancesInEthData> => {
  const chainId = (chainIdOverride ?? getChainId(config)) as keyof typeof nounsTreasuryAddress;
  if (!nounsTreasuryAddress[chainId]) throw new Error(`chain id ${chainId} is not supported`);

  const treasuryAddress = nounsTreasuryAddress[chainId];
  const oneMeth = 10n ** 18n;

  // Check if rETH is supported on this chain
  const isREthSupported = chainId === 1;

  const [
    ethBalance,
    methBalance,
    stEthBalance,
    usdcBalance,
    payerUsdcBalance,
    wethBalance,
    wstEthBalance,
    rethBalance,
    rethExchangeRate,
    methToEthRate,
    ethToUsdPrice,
  ] = await Promise.all([
    getBalance(config, { address: treasuryAddress, blockNumber, chainId }).then(r => r.value),
    readMEthBalanceOf(config, { args: [treasuryAddress], blockNumber, chainId }),
    readStEthBalanceOf(config, { args: [treasuryAddress], blockNumber, chainId }),
    readUsdcBalanceOf(config, { args: [treasuryAddress], blockNumber, chainId }),
    readUsdcBalanceOf(config, { args: [nounsUsdcPayerAddress[chainId]], blockNumber, chainId }),
    readWethBalanceOf(config, { args: [treasuryAddress], blockNumber, chainId }),
    readWstEthBalanceOf(config, { args: [treasuryAddress], blockNumber, chainId }),
    isREthSupported
      ? readREthBalanceOf(config, { args: [treasuryAddress], blockNumber, chainId })
      : Promise.resolve(0n),
    isREthSupported
      ? readREthGetExchangeRate(config, { blockNumber, chainId })
      : Promise.resolve(0n),
    readMEthStakingMEthToEth(config, { args: [oneMeth], blockNumber, chainId }),
    readEthToUsdPriceOracleLatestAnswer(config, { blockNumber, chainId }),
  ]);

  const methInEth = (methBalance * methToEthRate) / oneMeth;
  const rethInEth = isREthSupported ? (rethBalance * rethExchangeRate) / 10n ** 18n : 0n;
  const usdcInEth = (usdcBalance * 10n ** 20n) / BigInt(ethToUsdPrice);
  const payerUsdcInEth = (payerUsdcBalance * 10n ** 20n) / BigInt(ethToUsdPrice);

  const totalEth =
    ethBalance +
    methInEth +
    rethInEth +
    stEthBalance +
    wstEthBalance +
    wethBalance +
    usdcInEth +
    payerUsdcInEth;

  return {
    ETH: ethBalance,
    wETH: wethBalance,
    mETH: methInEth,
    rETH: rethInEth,
    stETH: stEthBalance,
    wstETH: wstEthBalance,
    USDC: usdcInEth,
    payerContractUSDC: payerUsdcInEth,
    total: totalEth,
  };
};
