import { useApolloClient } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { type DocumentNode, print } from 'graphql';

import { defaultChain } from '@/wagmi';

export async function fetchProposalPages<T>(
  fetchPage: (skip: number) => Promise<T[]>,
  pageSize: number,
): Promise<{ proposals: T[] }> {
  const proposals: T[] = [];
  for (;;) {
    const page = await fetchPage(proposals.length);
    proposals.push(...page);
    if (page.length < pageSize) return { proposals };
  }
}

/** Keep the request limit as a page size, never a limit on the complete result. */
export function usePaginatedProposals<T>(
  query: DocumentNode,
  variables: { first: number; skip: number; [key: string]: unknown },
) {
  const client = useApolloClient();
  const result = useQuery({
    queryKey: ['paginated-proposals', defaultChain.id, print(query), variables],
    queryFn: ({ signal }) =>
      fetchProposalPages<T>(async skip => {
        const { data } = await client.query<{ proposals: T[] }>({
          query,
          variables: { ...variables, skip },
          fetchPolicy: 'network-only',
          context: { fetchOptions: { signal } },
        });
        return data.proposals;
      }, variables.first),
  });

  return { data: result.data, loading: result.isPending, error: result.error ?? undefined };
}
