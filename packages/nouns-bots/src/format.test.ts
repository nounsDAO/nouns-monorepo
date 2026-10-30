import { describe, expect, it } from 'vitest';

import { formatProposalPost, normalizeProposalTitle } from './format';

describe('normalizeProposalTitle', () => {
  it('removes inline markdown from the subgraph title', () => {
    expect(normalizeProposalTitle('Fund **Nouns** [public goods](https://nouns.wtf)')).toBe(
      'Fund Nouns public goods',
    );
  });

  it('removes a proposal-number prefix to avoid duplicate copy', () => {
    expect(normalizeProposalTitle('Proposal #123: Upgrade the treasury')).toBe(
      'Upgrade the treasury',
    );
  });

  it('falls back when the subgraph title is empty', () => {
    expect(normalizeProposalTitle('')).toBe('Untitled proposal');
  });

  it('truncates long titles safely', () => {
    const title = normalizeProposalTitle('a'.repeat(250));
    expect(Array.from(title)).toHaveLength(190);
    expect(title.endsWith('…')).toBe(true);
  });
});

describe('formatProposalPost', () => {
  it('includes a deterministic marker and nouns.wtf proposal link', () => {
    expect(formatProposalPost(42n, '# Build more Nouns')).toEqual({
      marker: 'Nouns DAO Proposal 42:',
      text: 'Nouns DAO Proposal 42: Build more Nouns\n\nhttps://nouns.wtf/vote/42',
    });
  });
});
