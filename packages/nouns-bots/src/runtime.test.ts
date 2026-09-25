import { afterEach, describe, expect, it, vi } from 'vitest';

import { runProposalXBot } from './runtime';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('runProposalXBot', () => {
  it('does not require credentials or touch external services while disabled', async () => {
    vi.stubEnv('PROPOSAL_X_ENABLED', 'false');
    const log = vi.spyOn(console, 'info').mockImplementation(() => undefined);

    await expect(runProposalXBot()).resolves.toBe('disabled');
    expect(log).toHaveBeenCalledWith('Proposal X bot is disabled');
  });
});
