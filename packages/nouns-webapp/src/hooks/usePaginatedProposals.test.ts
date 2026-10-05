import { describe, expect, it, vi } from 'vitest';

import { fetchProposalPages } from './usePaginatedProposals';

vi.mock('@/wagmi', () => ({ defaultChain: { id: 1 } }));

describe('fetchProposalPages', () => {
  it.each([0, 999, 1000, 1002, 10002])('loads all %i proposals', async count => {
    const proposals = Array.from({ length: count }, (_, i) => ({ id: String(i + 1) }));
    const fetchPage = vi.fn(async (skip: number) => proposals.slice(skip, skip + 1000));

    expect(await fetchProposalPages(fetchPage, 1000)).toEqual({ proposals });
    expect(fetchPage.mock.calls.map(([skip]) => skip)).toEqual(
      Array.from({ length: Math.floor(count / 1000) + 1 }, (_, i) => i * 1000),
    );
  });

  it('rejects when a later page fails instead of returning a truncated list', async () => {
    const fetchPage = vi.fn(async (skip: number) => {
      if (skip > 0) throw new Error('Subgraph unavailable');
      return Array.from({ length: 1000 }, (_, i) => ({ id: String(i) }));
    });

    await expect(fetchProposalPages(fetchPage, 1000)).rejects.toThrow('Subgraph unavailable');
  });
});
