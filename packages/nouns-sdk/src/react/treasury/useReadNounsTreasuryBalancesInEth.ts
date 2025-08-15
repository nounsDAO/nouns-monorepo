import type { UseQueryOptions } from '@tanstack/react-query';

import { getChainId } from '@wagmi/core';
import { type Config, useConfig } from 'wagmi';
import { useQuery } from 'wagmi/query';

import {
  readNounsTreasuryBalancesInEth,
  type TreasuryBalancesInEthData,
} from '../../actions/treasury/index.js';
import { nounsTreasuryAddress } from '../treasury.gen.js';

export type UseReadNounsTreasuryBalancesInEthParameters<selectData = TreasuryBalancesInEthData> = {
  blockNumber?: bigint;
  config?: Config;
  chainId?: keyof typeof nounsTreasuryAddress;
  query?: Partial<
    Omit<UseQueryOptions<TreasuryBalancesInEthData, Error, selectData>, 'queryFn' | 'queryKey'>
  >;
};

export function useReadNounsTreasuryBalancesInEth<selectData = TreasuryBalancesInEthData>({
  blockNumber,
  chainId: chainIdOverride,
  config: configOverride,
  query = {},
}: UseReadNounsTreasuryBalancesInEthParameters<selectData> = {}) {
  const config = useConfig();
  const chainId =
    chainIdOverride ?? (getChainId(configOverride ?? config) as keyof typeof nounsTreasuryAddress);

  return useQuery({
    queryKey: ['nounsTreasuryBalancesInEth', chainId, blockNumber] as const,
    queryFn: () =>
      readNounsTreasuryBalancesInEth(configOverride ?? config, { blockNumber, chainId }),
    enabled: !!chainId,
    ...query,
  });
}
