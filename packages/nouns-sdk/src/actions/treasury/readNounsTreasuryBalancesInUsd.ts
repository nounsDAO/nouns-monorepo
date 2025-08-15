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

export type TreasuryBalancesInUsdData = {
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

export interface ReadNounsTreasuryBalancesInUsdOptions {
  blockNumber?: bigint;
  chainId?: keyof typeof nounsTreasuryAddress;
}

export const readNounsTreasuryBalancesInUsd = async (
  config: Config,
  { blockNumber, chainId: chainIdOverride }: ReadNounsTreasuryBalancesInUsdOptions = {},
): Promise<TreasuryBalancesInUsdData> => {
  const chainId = (chainIdOverride ?? getChainId(config)) as keyof typeof nounsTreasuryAddress;
  if (!nounsTreasuryAddress[chainId]) throw new Error(`chain id ${chainId} is not supported`);

  const treasuryAddress = nounsTreasuryAddress[chainId];
  const oneQuadrillion = 1_000_000_000_000_000n;

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
    readMEthStakingMEthToEth(config, { args: [oneQuadrillion], blockNumber, chainId }),
    readEthToUsdPriceOracleLatestAnswer(config, { blockNumber, chainId }),
  ]);

  // Convert mETH to ETH first, then to USD (6 decimals)
  const methInEth = (methBalance * methToEthRate) / oneQuadrillion;
  const methInUsd = (methInEth * BigInt(ethToUsdPrice)) / (10n ** 18n * 10n ** 2n);

  // Convert rETH to ETH first, then to USD (6 decimals)
  const rethInEth = isREthSupported ? (rethBalance * rethExchangeRate) / 10n ** 18n : 0n;
  const rethInUsd = (rethInEth * BigInt(ethToUsdPrice)) / (10n ** 18n * 10n ** 2n);

  // Convert all ETH-based assets to USD (6 decimals)
  const ethInUsd = (ethBalance * BigInt(ethToUsdPrice)) / (10n ** 18n * 10n ** 2n);
  const wethInUsd = (wethBalance * BigInt(ethToUsdPrice)) / (10n ** 18n * 10n ** 2n);
  const stEthInUsd = (stEthBalance * BigInt(ethToUsdPrice)) / (10n ** 18n * 10n ** 2n);
  const wstEthInUsd = (wstEthBalance * BigInt(ethToUsdPrice)) / (10n ** 18n * 10n ** 2n);

  // USDC is already in USD terms with 6 decimals - no conversion needed
  const usdcInUsd = usdcBalance;
  const payerUsdcInUsd = payerUsdcBalance;

  const totalUsd =
    ethInUsd +
    wethInUsd +
    methInUsd +
    rethInUsd +
    stEthInUsd +
    wstEthInUsd +
    usdcInUsd +
    payerUsdcInUsd;

  return {
    ETH: ethInUsd,
    wETH: wethInUsd,
    mETH: methInUsd,
    rETH: rethInUsd,
    stETH: stEthInUsd,
    wstETH: wstEthInUsd,
    USDC: usdcInUsd,
    payerContractUSDC: payerUsdcInUsd,
    total: totalUsd,
  };
};
