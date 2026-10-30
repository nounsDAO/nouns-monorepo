import { afterEach, describe, expect, it, vi } from 'vitest';

import { NounsSubgraphProposalSource } from './subgraph';

const subgraphProposal = (id: number) => ({
  id: id.toString(),
  title: `Proposal ${id}`,
  createdBlock: (1_000 + id).toString(),
  createdTransactionHash: `0x${id.toString().padStart(64, '0')}`,
});

const response = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

afterEach(() => vi.unstubAllGlobals());

describe('NounsSubgraphProposalSource', () => {
  it('reads the latest proposal ID from the official subgraph response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          response({ data: { proposals: [subgraphProposal(41), subgraphProposal(42)] } }),
        ),
      ),
    );
    const source = new NounsSubgraphProposalSource('https://example.com/subgraph', 100);

    await expect(source.getLatestProposalId()).resolves.toBe(42n);
  });

  it('paginates backward until it reaches the stored proposal cursor', async () => {
    const fetchMock = vi.fn((_input: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as { variables: { skip: number } };
      const proposals =
        body.variables.skip === 0
          ? [subgraphProposal(4), subgraphProposal(3)]
          : [subgraphProposal(2), subgraphProposal(1)];
      return Promise.resolve(response({ data: { proposals } }));
    });
    vi.stubGlobal('fetch', fetchMock);
    const source = new NounsSubgraphProposalSource('https://example.com/subgraph', 2);

    const proposals = await source.getProposalsAfter(2n);

    expect(proposals.map(proposal => proposal.id)).toEqual([4n, 3n]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('surfaces GraphQL errors without advancing bot state', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(response({ errors: [{ message: 'indexing error' }], data: null })),
      ),
    );
    const source = new NounsSubgraphProposalSource('https://example.com/subgraph', 100);

    await expect(source.getLatestProposalId()).rejects.toThrow(
      'Nouns subgraph returned errors: indexing error',
    );
  });
});
