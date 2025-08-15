import type { TreasuryBalancesInEthData } from '../../actions/treasury/readNounsTreasuryBalancesInEth';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createConfig, http, type Config } from '@wagmi/core';
import { mainnet, sepolia } from '@wagmi/core/chains';
import { formatEther } from 'viem';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { WagmiProvider } from 'wagmi';

import { setupPolly } from '../../../test/setup';

import { useReadNounsTreasuryBalancesInEth } from './useReadNounsTreasuryBalancesInEth';

const formatAsEther = (data: Record<string, bigint>) =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [key, formatEther(value)]));

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

describe('useReadNounsTreasuryBalancesInEth', () => {
  let polly: ReturnType<typeof setupPolly>;

  beforeAll(() => {
    polly = setupPolly(`useReadNounsTreasuryBalancesInEth`);
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
        useReadNounsTreasuryBalancesInEth({
          blockNumber: 23141580n,
        }),
      { wrapper },
    );

    // Wait for the query to complete
    await waitFor(() => expect(result.current.data).toBeDefined());

    // Validate return structure
    expect(formatAsEther(result.current.data!)).toMatchInlineSnapshot(`
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
  });

  it('should generate correct query key', async () => {
    const wrapper = createTestWrapper(config);

    const { result } = renderHook(
      () =>
        useReadNounsTreasuryBalancesInEth({
          blockNumber: 123n,
          chainId: mainnet.id,
        }),
      { wrapper },
    );

    // Access the query key from the hook's internal query
    const queryKey = result.current.queryKey;
    expect(queryKey).toEqual(['nounsTreasuryBalancesInEth', mainnet.id, 123n]);
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
        useReadNounsTreasuryBalancesInEth({
          blockNumber: 8984842n,
          chainId: sepolia.id,
          config: customConfig,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.queryKey).toEqual(['nounsTreasuryBalancesInEth', sepolia.id, 8984842n]);
    expect(result.current.data).toBeDefined();
  });

  it('should pass through query options', async () => {
    const wrapper = createTestWrapper(config);

    const { result } = renderHook(
      () =>
        useReadNounsTreasuryBalancesInEth({
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
        useReadNounsTreasuryBalancesInEth<string>({
          blockNumber: 23141580n,
          query: {
            select: (data: TreasuryBalancesInEthData) => formatEther(data.total),
          },
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(typeof result.current.data).toBe('string');
    expect(result.current.data).toBe('3577.930610487749123829');
  });
});
