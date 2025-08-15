import { createConfig, http } from '@wagmi/core';
import { mainnet, sepolia, base } from '@wagmi/core/chains';
import { formatUnits } from 'viem';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';

import { setupPolly } from '../../../test/setup';

import { readNounsTreasuryBalancesInUsd } from './readNounsTreasuryBalancesInUsd.js';

const formatAsUsd = (data: Record<string, bigint>) =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [key, formatUnits(value, 6)]));

describe('readNounsTreasuryBalancesInUsd', () => {
  let polly: ReturnType<typeof setupPolly>;

  beforeAll(() => {
    polly = setupPolly(`readNounsTreasuryBalancesInUsd`);
  });

  afterAll(async () => {
    await polly.stop();
  });

  describe('mainnet', () => {
    const config = createConfig({
      chains: [mainnet],
      transports: {
        [mainnet.id]: http(process.env.MAINNET_RPC_URL),
      },
    });

    it('should fetch main treasury assets balances, convert to USD and calculate the total', async () => {
      const result = await readNounsTreasuryBalancesInUsd(config, {
        chainId: mainnet.id,
        blockNumber: 23141580n,
      });

      // Validate return structure
      expect(formatAsUsd(result)).toMatchInlineSnapshot(`
        {
          "ETH": "1782544.191417",
          "USDC": "897841.217832",
          "mETH": "4528941.649949",
          "payerContractUSDC": "15003.100555",
          "rETH": "842131.150547",
          "stETH": "8696.596331",
          "total": "16157045.922647",
          "wETH": "291109.098789",
          "wstETH": "7790778.917227",
        }
      `);

      // Total should be sum of all components
      const calculatedTotal =
        result.ETH +
        result.wETH +
        result.mETH +
        result.rETH +
        result.stETH +
        result.wstETH +
        result.USDC +
        result.payerContractUSDC;

      expect(result.total).toBe(calculatedTotal);
    });
  });

  describe('sepolia', () => {
    const config = createConfig({
      chains: [sepolia],
      transports: {
        [sepolia.id]: http(process.env.SEPOLIA_RPC_URL),
      },
    });

    it('should fetch main treasury assets balances, convert to USD and calculate the total', async () => {
      const result = await readNounsTreasuryBalancesInUsd(config, {
        chainId: sepolia.id,
        blockNumber: 8984842n,
      });

      // Validate return structure
      expect(formatAsUsd(result)).toMatchInlineSnapshot(`
        {
          "ETH": "383.342046",
          "USDC": "0",
          "mETH": "0",
          "payerContractUSDC": "0",
          "rETH": "0",
          "stETH": "0",
          "total": "8073.665697",
          "wETH": "7690.323651",
          "wstETH": "0",
        }
      `);

      // Total should be sum of all components
      const calculatedTotal =
        result.ETH +
        result.wETH +
        result.mETH +
        result.rETH +
        result.stETH +
        result.wstETH +
        result.USDC +
        result.payerContractUSDC;

      expect(result.total).toBe(calculatedTotal);
    });
  });

  describe('unsupported chain', () => {
    const config = createConfig({
      chains: [base],
      transports: {
        [base.id]: http(),
      },
    });

    it('throws on unsupported chain id', async () => {
      await expect(() =>
        readNounsTreasuryBalancesInUsd(config, {
          chainId: base.id as 1,
          blockNumber: 666n,
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: chain id 8453 is not supported]`);
    });
  });
});
