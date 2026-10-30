import type { BotStateStore, DeliveryRecord } from './types';

import { randomUUID } from 'node:crypto';

import { getStore, type Store } from '@netlify/blobs';

const CURSOR_KEY = 'proposal-cursor:v1';
const DELIVERY_KEY_PREFIX = 'delivery:v1:';
const LOCK_KEY = 'worker-lock:v1';

interface Lease {
  token: string;
  expiresAt: number;
}

const isLease = (value: unknown): value is Lease =>
  typeof value === 'object' &&
  value !== null &&
  'token' in value &&
  typeof value.token === 'string' &&
  'expiresAt' in value &&
  typeof value.expiresAt === 'number';

export class NetlifyBlobStateStore implements BotStateStore {
  constructor(
    private readonly store: Store = getStore({
      name: 'nouns-proposal-x',
      consistency: 'strong',
    }),
    private readonly now: () => number = Date.now,
  ) {}

  async getCursor(): Promise<bigint | null> {
    const value = (await this.store.get(CURSOR_KEY, { type: 'json' })) as unknown;
    if (value === null) return null;
    if (typeof value !== 'string') throw new Error('Invalid proposal cursor in Netlify Blobs');
    return BigInt(value);
  }

  async setCursor(proposalId: bigint): Promise<void> {
    await this.store.setJSON(CURSOR_KEY, proposalId.toString());
  }

  async getDelivery(proposalId: bigint): Promise<DeliveryRecord | null> {
    return (await this.store.get(`${DELIVERY_KEY_PREFIX}${proposalId}`, {
      type: 'json',
    })) as DeliveryRecord | null;
  }

  async setDelivery(delivery: DeliveryRecord): Promise<void> {
    await this.store.setJSON(`${DELIVERY_KEY_PREFIX}${delivery.proposalId}`, delivery);
  }

  async acquireLock(ttlMs: number): Promise<string | null> {
    const timestamp = this.now();
    const token = randomUUID();
    const nextLease: Lease = { token, expiresAt: timestamp + ttlMs };
    const current = await this.store.getWithMetadata(LOCK_KEY, { type: 'json' });

    if (current === null) {
      const result = await this.store.setJSON(LOCK_KEY, nextLease, { onlyIfNew: true });
      return result.modified ? token : null;
    }

    if (isLease(current.data) && current.data.expiresAt > timestamp) return null;
    if (!current.etag) return null;

    const result = await this.store.setJSON(LOCK_KEY, nextLease, {
      onlyIfMatch: current.etag,
    });
    return result.modified ? token : null;
  }
}
