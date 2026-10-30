import type { DeliveryRecord } from './types';
import type { Store } from '@netlify/blobs';

import { describe, expect, it } from 'vitest';

import { NetlifyBlobStateStore } from './netlify-blobs';

interface StoredValue {
  data: unknown;
  etag: string;
}

class MemoryBlobStore {
  private etag = 0;
  readonly values = new Map<string, StoredValue>();

  get(key: string): Promise<unknown | null> {
    return Promise.resolve(this.values.get(key)?.data ?? null);
  }

  getWithMetadata(
    key: string,
  ): Promise<{ data: unknown; etag: string; metadata: Record<string, never> } | null> {
    const value = this.values.get(key);
    return Promise.resolve(value === undefined ? null : { ...value, metadata: {} });
  }

  setJSON(
    key: string,
    data: unknown,
    options: { onlyIfNew?: boolean; onlyIfMatch?: string } = {},
  ): Promise<{ modified: boolean; etag?: string }> {
    const current = this.values.get(key);
    if (options.onlyIfNew === true && current !== undefined) {
      return Promise.resolve({ modified: false });
    }
    if (options.onlyIfMatch !== undefined && current?.etag !== options.onlyIfMatch) {
      return Promise.resolve({ modified: false });
    }

    const etag = `etag-${++this.etag}`;
    this.values.set(key, { data, etag });
    return Promise.resolve({ modified: true, etag });
  }
}

const asNetlifyStore = (store: MemoryBlobStore): Store => store as unknown as Store;

describe('NetlifyBlobStateStore', () => {
  it('persists the proposal cursor and delivery records', async () => {
    const blobs = new MemoryBlobStore();
    const store = new NetlifyBlobStateStore(asNetlifyStore(blobs));
    const delivery: DeliveryRecord = {
      proposalId: '42',
      marker: 'Nouns DAO Proposal 42:',
      text: 'proposal post',
      status: 'posted',
      attempts: 1,
      transactionHash: `0x${'1'.repeat(64)}`,
      startedAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
      postId: 'post-42',
    };

    expect(await store.getCursor()).toBeNull();
    await store.setCursor(42n);
    await store.setDelivery(delivery);

    expect(await store.getCursor()).toBe(42n);
    expect(await store.getDelivery(42n)).toEqual(delivery);
  });

  it('allows only one invocation to hold an unexpired lease', async () => {
    const blobs = new MemoryBlobStore();
    const store = new NetlifyBlobStateStore(asNetlifyStore(blobs), () => 1000);

    expect(await store.acquireLock(4000)).not.toBeNull();
    expect(await store.acquireLock(4000)).toBeNull();
  });

  it('replaces an expired lease using its ETag', async () => {
    const blobs = new MemoryBlobStore();
    let now = 1000;
    const store = new NetlifyBlobStateStore(asNetlifyStore(blobs), () => now);
    const firstToken = await store.acquireLock(4000);

    now = 5001;
    const secondToken = await store.acquireLock(4000);

    expect(firstToken).not.toBeNull();
    expect(secondToken).not.toBeNull();
    expect(secondToken).not.toBe(firstToken);
  });
});
