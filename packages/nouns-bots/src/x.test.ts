import { beforeEach, describe, expect, it, vi } from 'vitest';

import { XPostPublisher, type XCredentials } from './x';

const xApi = vi.hoisted(() => ({
  me: vi.fn(),
  tweet: vi.fn(),
  userTimeline: vi.fn(),
}));

vi.mock('twitter-api-v2', () => ({
  TwitterApi: class {
    readonly readWrite = { v2: xApi };
  },
}));

const credentials: XCredentials = {
  appKey: 'app-key',
  appSecret: 'app-secret',
  accessToken: 'access-token',
  accessSecret: 'access-secret',
};

beforeEach(() => {
  vi.clearAllMocks();
  xApi.me.mockResolvedValue({ data: { id: 'user-1', username: 'nounsdao' } });
  xApi.tweet.mockResolvedValue({ data: { id: 'post-1' } });
});

describe('XPostPublisher', () => {
  it('verifies the authenticated account before publishing', async () => {
    const publisher = new XPostPublisher(credentials, 'NounsDAO');

    await expect(publisher.createPost('Proposal post')).resolves.toEqual({ id: 'post-1' });
    expect(xApi.me).toHaveBeenCalledOnce();
    expect(xApi.tweet).toHaveBeenCalledWith('Proposal post');
  });

  it('refuses to publish when the credentials belong to another account', async () => {
    xApi.me.mockResolvedValue({ data: { id: 'user-2', username: 'maintainer' } });
    const publisher = new XPostPublisher(credentials, 'nounsdao');

    await expect(publisher.createPost('Proposal post')).rejects.toThrow(
      'X credentials belong to @maintainer, expected @nounsdao',
    );
    expect(xApi.tweet).not.toHaveBeenCalled();
  });
});
