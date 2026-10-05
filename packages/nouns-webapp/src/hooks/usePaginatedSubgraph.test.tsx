import type { ReactNode } from 'react';

import { gql } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  auctionBidPagesQuery,
  activePendingUpdatableProposersQuery,
  delegateNounsAtBlockQuery,
  forkDetailsQuery,
  latestAuctionsQuery,
  ownedNounsQuery,
} from '@/wrappers/subgraph';

import { useDelegateNouns } from './useDelegateNouns';
import { usePaginatedSubgraph } from './usePaginatedSubgraph';

const { queryMock } = vi.hoisted(() => ({ queryMock: vi.fn() }));
vi.mock('@apollo/client', async importOriginal => ({
  ...(await importOriginal<typeof import('@apollo/client')>()),
  useApolloClient: () => ({ query: queryMock }),
}));
vi.mock('@/config', () => ({ default: { app: { subgraphApiUri: 'test-subgraph' } } }));

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

const ids = (count: number) => Array.from({ length: count }, (_, i) => ({ id: String(i) }));

describe('usePaginatedSubgraph', () => {
  beforeEach(() => {
    queryMock.mockReset();
  });

  it('returns all wallet Nouns and refreshes the complete list after an ownership change', async () => {
    let nouns = ids(1001);
    queryMock.mockImplementation(async ({ variables }) => ({
      data: { nouns: nouns.slice(variables.skip, variables.skip + variables.first) },
    }));
    const { query, variables } = ownedNounsQuery('0xowner');
    const { result } = renderHook(
      () => usePaginatedSubgraph<{ nouns: { id: string }[] }>(query, variables, { field: 'nouns' }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.data?.nouns).toHaveLength(1001));
    nouns = ids(101);
    await act(async () => {
      await result.current.refetch();
    });
    await waitFor(() => expect(result.current.data?.nouns).toEqual(nouns));
  });

  it('pages both delegates and their holdings at the same historical snapshot block', async () => {
    const nouns = ids(1001);
    const delegates = ids(1001).map((delegate, i) => ({
      ...delegate,
      nounsRepresented: i === 0 ? nouns : [],
    }));
    queryMock.mockImplementation(async ({ variables }) => ({
      data: {
        delegates: delegates
          .filter(delegate => variables.delegates.includes(delegate.id) === true)
          .slice(variables.skip, variables.skip + variables.first)
          .map(delegate => ({
            ...delegate,
            nounsRepresented: delegate.nounsRepresented.slice(
              variables.nestedSkip,
              variables.nestedSkip + variables.first,
            ),
          })),
      },
    }));
    const { query, variables } = delegateNounsAtBlockQuery(
      delegates.map(d => d.id),
      12345n,
    );
    const { result } = renderHook(() => useDelegateNouns(query, variables), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data?.delegates).toEqual(delegates);
    expect(queryMock).toHaveBeenCalledTimes(3);
    for (const [request] of queryMock.mock.calls) expect(request.variables.block).toBe(12345);
    expect(queryMock.mock.calls[2][0].variables).toMatchObject({
      delegates: ['0'],
      skip: 0,
      nestedSkip: 1000,
    });
  });

  it('loads both nested fork lists beyond 1000 without changing fork metadata', async () => {
    const escrowed = ids(1001);
    const joined = ids(101);
    queryMock.mockImplementation(async ({ variables }) => ({
      data: {
        fork: {
          id: variables.id,
          executed: true,
          escrowedNouns: escrowed.slice(
            variables.nestedSkip,
            variables.nestedSkip + variables.first,
          ),
          joinedNouns: joined.slice(variables.nestedSkip, variables.nestedSkip + variables.first),
        },
      },
    }));
    const { query, variables } = forkDetailsQuery('1');
    const { result } = renderHook(
      () =>
        usePaginatedSubgraph(query, variables, {
          field: 'fork',
          singleton: true,
          nested: { fields: ['escrowedNouns', 'joinedNouns'] },
        }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({
      fork: {
        id: '1',
        executed: true,
        escrowedNouns: escrowed,
        joinedNouns: joined,
      },
    });
    expect(queryMock).toHaveBeenCalledTimes(2);
  });

  it('loads auctions beyond 2000 and uses an auction-specific query for overflowing bid lists', async () => {
    const bids = ids(1001);
    const auctions = ids(2001).map((auction, i) => ({ ...auction, bids: i === 0 ? bids : [] }));
    queryMock.mockImplementation(async ({ query, variables }) => ({
      data:
        query === auctionBidPagesQuery
          ? {
              auction: {
                id: variables.id,
                bids: bids.slice(variables.nestedSkip, variables.nestedSkip + variables.first),
              },
            }
          : {
              auctions: auctions
                .slice(variables.skip, variables.skip + variables.first)
                .map(auction => ({ ...auction, bids: auction.bids.slice(0, variables.first) })),
            },
    }));
    const { result } = renderHook(
      () =>
        usePaginatedSubgraph(
          gql(latestAuctionsQuery.toString()),
          {},
          {
            field: 'auctions',
            nested: {
              fields: ['bids'],
              parentVariable: 'id',
              query: auctionBidPagesQuery,
              field: 'auction',
              singleton: true,
            },
          },
        ),
      { wrapper },
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ auctions });
    expect(queryMock).toHaveBeenCalledTimes(4);
    expect(queryMock.mock.calls[3][0].variables).toMatchObject({ id: '0', nestedSkip: 1000 });
  });

  it('keeps a disabled query idle', () => {
    const { query, variables } = ownedNounsQuery('');
    const { result } = renderHook(
      () =>
        usePaginatedSubgraph(query, variables, {
          field: 'nouns',
          skip: true,
        }),
      { wrapper },
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(queryMock).not.toHaveBeenCalled();
  });

  it('supports bigint filters in cache keys without changing request variables', async () => {
    queryMock.mockResolvedValue({ data: { proposals: [] } });
    const { query, variables } = activePendingUpdatableProposersQuery(1000, 12345n);
    const { result } = renderHook(
      () =>
        usePaginatedSubgraph(query, variables, {
          field: 'proposals',
        }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ proposals: [] });
    expect(queryMock.mock.calls[0][0].variables.currentBlock).toBe(12345n);
  });

  it('reports a later-page error without presenting the first page as complete', async () => {
    queryMock.mockImplementation(async ({ variables }) => {
      if (variables.skip > 0) throw new Error('Subgraph unavailable');
      return { data: { nouns: ids(1000) } };
    });
    const { query, variables } = ownedNounsQuery('owner');
    const { result } = renderHook(
      () => usePaginatedSubgraph(query, variables, { field: 'nouns' }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.error?.message).toBe('Subgraph unavailable'));
    expect(result.current.data).toBeUndefined();
    expect(result.current.loading).toBe(false);
  });
});
