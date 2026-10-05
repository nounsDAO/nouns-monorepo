import { describe, expect, it, vi } from 'vitest';

import { completeNestedLists, fetchAllPages } from './subgraphPagination';

const ids = (count: number) => Array.from({ length: count }, (_, i) => ({ id: String(i) }));

describe('subgraph pagination', () => {
  it.each([0, 100, 101, 999, 1000, 1001, 2001])('loads all %i root records', async count => {
    const records = ids(count);
    const fetchPage = vi.fn(async (skip: number) => records.slice(skip, skip + 1000));
    expect(await fetchAllPages(fetchPage)).toEqual(records);
    expect(fetchPage.mock.calls.map(([skip]) => skip)).toEqual(
      Array.from({ length: Math.floor(count / 1000) + 1 }, (_, i) => i * 1000),
    );
  });

  it('pages fork lists independently while preserving metadata and the original entity', async () => {
    const escrowed = ids(2501);
    const joined = ids(1001);
    const initial = {
      id: 'fork-1',
      executed: true,
      escrowedNouns: escrowed.slice(0, 1000),
      joinedNouns: joined.slice(0, 1000),
    };
    const fetchPage = vi.fn(async (skip: number) => ({
      ...initial,
      escrowedNouns: escrowed.slice(skip, skip + 1000),
      joinedNouns: joined.slice(skip, skip + 1000),
    }));
    const result = await completeNestedLists(initial, ['escrowedNouns', 'joinedNouns'], fetchPage);
    expect(result).toEqual({ ...initial, escrowedNouns: escrowed, joinedNouns: joined });
    expect(fetchPage.mock.calls.map(([skip]) => skip)).toEqual([1000, 2000]);
    expect(initial.escrowedNouns).toHaveLength(1000);
  });

  it('does not request additional pages for short nested lists', async () => {
    const initial = { id: 'delegate', nounsRepresented: ids(101) };
    const fetchPage = vi.fn();
    expect(await completeNestedLists(initial, ['nounsRepresented'], fetchPage)).toEqual(initial);
    expect(fetchPage).not.toHaveBeenCalled();
  });

  it('does not expose partial root records when a later page fails', async () => {
    await expect(
      fetchAllPages(async skip => {
        if (skip > 0) throw new Error('Page failed');
        return ids(1000);
      }),
    ).rejects.toThrow('Page failed');
  });

  it('does not silently complete a nested list when its parent disappears', async () => {
    await expect(
      completeNestedLists({ bids: ids(1000) }, ['bids'], async () => null),
    ).rejects.toThrow('Subgraph entity disappeared');
  });
});
