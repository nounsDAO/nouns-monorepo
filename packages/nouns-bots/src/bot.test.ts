import type {
  BotStateStore,
  DeliveryRecord,
  ExistingPost,
  PostPublisher,
  ProposalRecord,
  ProposalSource,
} from './types';

import { describe, expect, it } from 'vitest';

import { ProposalXBot } from './bot';

const transactionHash = `0x${'1'.repeat(64)}` as const;

class MemoryStore implements BotStateStore {
  cursor: bigint | null = null;
  deliveries = new Map<string, DeliveryRecord>();

  getCursor(): Promise<bigint | null> {
    return Promise.resolve(this.cursor);
  }

  setCursor(blockNumber: bigint): Promise<void> {
    this.cursor = blockNumber;
    return Promise.resolve();
  }

  getDelivery(proposalId: bigint): Promise<DeliveryRecord | null> {
    return Promise.resolve(this.deliveries.get(proposalId.toString()) ?? null);
  }

  setDelivery(delivery: DeliveryRecord): Promise<void> {
    this.deliveries.set(delivery.proposalId, delivery);
    return Promise.resolve();
  }
}

class FakeSource implements ProposalSource {
  constructor(
    public latestProposalId: bigint | null,
    public proposals: ProposalRecord[] = [],
  ) {}

  getLatestProposalId(): Promise<bigint | null> {
    return Promise.resolve(this.latestProposalId);
  }

  getProposalsAfter(proposalId: bigint): Promise<ProposalRecord[]> {
    return Promise.resolve(this.proposals.filter(proposal => proposal.id > proposalId));
  }
}

class FakePublisher implements PostPublisher {
  created: string[] = [];
  existingPost: ExistingPost | null = null;
  error: Error | null = null;

  createPost(text: string): Promise<ExistingPost> {
    this.created.push(text);
    if (this.error !== null) return Promise.reject(this.error);
    return Promise.resolve({ id: `post-${this.created.length}` });
  }

  findExistingPost(): Promise<ExistingPost | null> {
    return Promise.resolve(this.existingPost);
  }
}

const proposal = (id: bigint): ProposalRecord => ({
  id,
  title: 'Fund public goods',
  createdBlock: 1000n + id,
  transactionHash,
});

const createBot = (
  source: ProposalSource,
  store: BotStateStore,
  publisher: PostPublisher,
): ProposalXBot =>
  new ProposalXBot(source, store, publisher, {
    logger: { error: () => undefined, info: () => undefined, warn: () => undefined },
  });

describe('ProposalXBot', () => {
  it('seeds the latest subgraph proposal without publishing historical proposals', async () => {
    const store = new MemoryStore();
    const publisher = new FakePublisher();
    const bot = createBot(new FakeSource(42n, [proposal(42n)]), store, publisher);

    await bot.tick();

    expect(store.cursor).toBe(42n);
    expect(publisher.created).toEqual([]);
  });

  it('publishes confirmed proposals once and advances the cursor', async () => {
    const store = new MemoryStore();
    store.cursor = 41n;
    const publisher = new FakePublisher();
    const bot = createBot(new FakeSource(42n, [proposal(42n)]), store, publisher);

    await bot.tick();
    await bot.tick();

    expect(store.cursor).toBe(42n);
    expect(publisher.created).toEqual([
      'Nouns DAO Proposal 42: Fund public goods\n\nhttps://nouns.wtf/vote/42',
    ]);
    expect(store.deliveries.get('42')).toMatchObject({ status: 'posted', postId: 'post-1' });
  });

  it('reconciles an interrupted publish before attempting another post', async () => {
    const store = new MemoryStore();
    store.cursor = 41n;
    store.deliveries.set('42', {
      proposalId: '42',
      marker: 'Nouns DAO Proposal 42:',
      text: 'Nouns DAO Proposal 42: Fund public goods\n\nhttps://nouns.wtf/vote/42',
      status: 'posting',
      attempts: 1,
      transactionHash,
      startedAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    });
    const publisher = new FakePublisher();
    publisher.existingPost = { id: 'existing-post' };
    const bot = createBot(new FakeSource(42n, [proposal(42n)]), store, publisher);

    await bot.tick();

    expect(publisher.created).toEqual([]);
    expect(store.deliveries.get('42')).toMatchObject({
      status: 'posted',
      postId: 'existing-post',
    });
  });

  it('does not advance its cursor when publishing has an uncertain result', async () => {
    const store = new MemoryStore();
    store.cursor = 41n;
    const publisher = new FakePublisher();
    publisher.error = new Error('network disconnected');
    const bot = createBot(new FakeSource(42n, [proposal(42n)]), store, publisher);

    await expect(bot.tick()).rejects.toThrow('network disconnected');

    expect(store.cursor).toBe(41n);
    expect(store.deliveries.get('42')).toMatchObject({
      status: 'posting',
      lastError: 'network disconnected',
    });
  });
});
