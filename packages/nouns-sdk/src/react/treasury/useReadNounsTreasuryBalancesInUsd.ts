import type { UseQueryOptions } from '@tanstack/react-query';

import { getChainId } from '@wagmi/core';
import { type Config, useConfig } from 'wagmi';
import { useQuery } from 'wagmi/query';

import {
  readNounsTreasuryBalancesInUsd,
  type TreasuryBalancesInUsdData,
} from '../../actions/treasury/index.js';
import { nounsTreasuryAddress } from '../treasury.gen.js';

export type UseReadNounsTreasuryBalancesInUsdParameters<selectData = TreasuryBalancesInUsdData> = {
  blockNumber?: bigint;
  config?: Config;
  chainId?: keyof typeof nounsTreasuryAddress;
  query?: Partial<
    Omit<UseQueryOptions<TreasuryBalancesInUsdData, Error, selectData>, 'queryFn' | 'queryKey'>
  >;
};

export function useReadNounsTreasuryBalancesInUsd<selectData = TreasuryBalancesInUsdData>({
  blockNumber,
  config: configOverride,
  chainId: chainIdOverride,
  query = {},
}: UseReadNounsTreasuryBalancesInUsdParameters<selectData> = {}) {
  const config = useConfig();
  const chainId =
    chainIdOverride ?? (getChainId(configOverride ?? config) as keyof typeof nounsTreasuryAddress);

  return useQuery({
    queryKey: ['nounsTreasuryBalancesInUsd', chainId, blockNumber] as const,
    queryFn: () =>
      readNounsTreasuryBalancesInUsd(configOverride ?? config, { blockNumber, chainId }),
    enabled: !!chainId,
    ...query,
  });
}
