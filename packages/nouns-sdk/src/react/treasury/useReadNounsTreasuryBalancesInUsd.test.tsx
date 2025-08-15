import type { TreasuryBalancesInUsdData } from '../../actions/treasury/readNounsTreasuryBalancesInUsd';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createConfig, http, type Config } from '@wagmi/core';
import { mainnet, sepolia } from '@wagmi/core/chains';
import { formatUnits } from 'viem';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { WagmiProvider } from 'wagmi';

import { setupPolly } from '../../../test/setup';

import { useReadNounsTreasuryBalancesInUsd } from './useReadNounsTreasuryBalancesInUsd';

const formatAsUsd = (data: Record<string, bigint>) =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [key, formatUnits(value, 6)]));

// Test wrapper component
function createTestWrapper(config: Config) {
  return ({ children }: { children: ReactNode }) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    );
  };
}

describe('useReadNounsTreasuryBalancesInUsd', () => {
  let polly: ReturnType<typeof setupPolly>;

  beforeAll(() => {
    polly = setupPolly(`useReadNounsTreasuryBalancesInUsd`);
  });

  afterAll(async () => {
    await polly.stop();
  });

  const config = createConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(process.env.MAINNET_RPC_URL),
    },
  });

  it('should fetch treasury balances with default parameters', async () => {
    const wrapper = createTestWrapper(config);

    const { result } = renderHook(
      () =>
        useReadNounsTreasuryBalancesInUsd({
          blockNumber: 23148279n,
        }),
      { wrapper },
    );

    // Wait for the query to complete
    await waitFor(() => expect(result.current.data).toBeDefined());

    // Validate return structure
    expect(formatAsUsd(result.current.data!)).toMatchInlineSnapshot(`
      {
        "ETH": "1749987.012073",
        "USDC": "897841.217832",
        "mETH": "4436958.41919",
        "payerContractUSDC": "15003.100555",
        "rETH": "825055.779735",
        "stETH": "8520.34869",
        "total": "15850794.512091",
        "wETH": "285185.282178",
        "wstETH": "7632243.351838",
      }
    `);
  });

  it('should generate correct query key', async () => {
    const wrapper = createTestWrapper(config);

    const { result } = renderHook(
      () =>
        useReadNounsTreasuryBalancesInUsd({
          blockNumber: 123n,
          chainId: mainnet.id,
        }),
      { wrapper },
    );

    // Access the query key from the hook's internal query
    const queryKey = result.current.queryKey;
    expect(queryKey).toEqual(['nounsTreasuryBalancesInUsd', mainnet.id, 123n]);
  });

  it('should handle config and chainId overrides', async () => {
    const customConfig = createConfig({
      chains: [sepolia],
      transports: {
        [sepolia.id]: http(process.env.SEPOLIA_RPC_URL),
      },
    });

    const wrapper = createTestWrapper(config);

    const { result } = renderHook(
      () =>
        useReadNounsTreasuryBalancesInUsd({
          blockNumber: 8984842n,
          chainId: sepolia.id,
          config: customConfig,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.queryKey).toEqual(['nounsTreasuryBalancesInUsd', sepolia.id, 8984842n]);
    expect(result.current.data).toBeDefined();
  });

  it('should pass through query options', async () => {
    const wrapper = createTestWrapper(config);

    const { result } = renderHook(
      () =>
        useReadNounsTreasuryBalancesInUsd({
          blockNumber: 23141580n,
          query: {
            enabled: false,
          },
        }),
      { wrapper },
    );

    // Query should be disabled
    expect(result.current.isEnabled).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('should handle custom select function', async () => {
    const wrapper = createTestWrapper(config);

    const { result } = renderHook(
      () =>
        useReadNounsTreasuryBalancesInUsd({
          blockNumber: 23148279n,
          query: {
            select: (data: TreasuryBalancesInUsdData) => formatUnits(data.total, 6),
          },
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(typeof result.current.data).toBe('string');
    expect(result.current.data).toMatchInlineSnapshot(`"15850794.512091"`);
  });
});
