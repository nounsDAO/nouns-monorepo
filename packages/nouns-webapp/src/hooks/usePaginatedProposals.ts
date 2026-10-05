import type { DocumentNode } from 'graphql';

import { fetchAllPages } from '@/utils/subgraphPagination';

import { usePaginatedSubgraph } from './usePaginatedSubgraph';

export async function fetchProposalPages<T>(
  fetchPage: (skip: number) => Promise<T[]>,
  pageSize: number,
): Promise<{ proposals: T[] }> {
  return { proposals: await fetchAllPages(fetchPage, pageSize) };
}

/** Keep the request limit as a page size, never a limit on the complete result. */
export function usePaginatedProposals<T>(
  query: DocumentNode,
  variables: { first: number; skip: number; [key: string]: unknown },
) {
  return usePaginatedSubgraph<{ proposals: T[] }>(query, variables, { field: 'proposals' });
}
