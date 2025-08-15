import { createConfig, http } from '@wagmi/core';
import { mainnet, sepolia, base } from '@wagmi/core/chains';
import { formatEther } from 'viem';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';

import { setupPolly } from '../../../test/setup';

import { readNounsTreasuryBalancesInEth } from './readNounsTreasuryBalancesInEth.js';

const formatAsEther = (data: Record<string, bigint>) =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [key, formatEther(value)]));

describe('readNounsTreasuryBalancesInEth', () => {
  let polly: ReturnType<typeof setupPolly>;

  beforeAll(() => {
    polly = setupPolly(`readNounsTreasuryBalancesInEth`);
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

    it('should fetch main treasury assets balances, convert to ETH and calculate the total', async () => {
      const result = await readNounsTreasuryBalancesInEth(config, {
        chainId: mainnet.id,
        blockNumber: 23141580n,
      });

      // Validate return structure
      expect(formatAsEther(result)).toMatchInlineSnapshot(`
        {
          "ETH": "394.739202794352184387",
          "USDC": "198.824314297168906627",
          "mETH": "1002.920895319786459215",
          "payerContractUSDC": "3.322392780521144714",
          "rETH": "186.487482675539284285",
          "stETH": "1.925835847141988032",
          "total": "3577.930610487749123829",
          "wETH": "64.465259338723698418",
          "wstETH": "1725.245227434515458151",
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

    it('should fetch main treasury assets balances, convert to ETH and calculate the total', async () => {
      const result = await readNounsTreasuryBalancesInEth(config, {
        chainId: sepolia.id,
        blockNumber: 8984842n,
      });

      // Validate return structure
      expect(formatAsEther(result)).toMatchInlineSnapshot(`
        {
          "ETH": "0.084881509922875974",
          "USDC": "0",
          "mETH": "0",
          "payerContractUSDC": "0",
          "rETH": "0",
          "stETH": "0",
          "total": "1.787711371033987086",
          "wETH": "1.702829861111111112",
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
        readNounsTreasuryBalancesInEth(config, {
          chainId: base.id as 1,
          blockNumber: 666n,
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: chain id 8453 is not supported]`);
    });
  });
});
