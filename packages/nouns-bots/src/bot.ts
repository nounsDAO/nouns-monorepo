import type {
  BotLogger,
  BotStateStore,
  DeliveryRecord,
  PostPublisher,
  ProposalRecord,
  ProposalSource,
} from './types';

import { formatProposalPost } from './format';

export interface ProposalXBotOptions {
  logger?: BotLogger;
}

const compareProposals = (left: ProposalRecord, right: ProposalRecord): number => {
  if (left.id < right.id) return -1;
  if (left.id > right.id) return 1;
  return 0;
};

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export class ProposalXBot {
  private readonly logger: BotLogger;

  constructor(
    private readonly source: ProposalSource,
    private readonly store: BotStateStore,
    private readonly publisher: PostPublisher,
    private readonly options: ProposalXBotOptions,
  ) {
    this.logger = options.logger ?? console;
  }

  async tick(): Promise<void> {
    const storedCursor = await this.store.getCursor();

    if (storedCursor === null) {
      const latestProposalId = (await this.source.getLatestProposalId()) ?? 0n;
      await this.store.setCursor(latestProposalId);
      this.logger.info(`Initialized proposal X bot at proposal ${latestProposalId}`);
      return;
    }

    const proposals = await this.source.getProposalsAfter(storedCursor);
    for (const proposal of proposals.sort(compareProposals)) {
      await this.processProposal(proposal);
      await this.store.setCursor(proposal.id);
    }
  }

  private async processProposal(proposal: ProposalRecord): Promise<void> {
    const existingDelivery = await this.store.getDelivery(proposal.id);
    if (existingDelivery?.status === 'posted') return;

    const formattedPost = formatProposalPost(proposal.id, proposal.title);
    const marker = existingDelivery?.marker ?? formattedPost.marker;
    const text = existingDelivery?.text ?? formattedPost.text;

    if (existingDelivery?.status === 'posting') {
      const existingPost = await this.publisher.findExistingPost(marker);
      if (existingPost !== null) {
        await this.store.setDelivery({
          ...existingDelivery,
          status: 'posted',
          postId: existingPost.id,
          updatedAt: new Date().toISOString(),
          lastError: undefined,
        });
        this.logger.info(`Reconciled X post ${existingPost.id} for proposal ${proposal.id}`);
        return;
      }
    }

    const timestamp = new Date().toISOString();
    const posting: DeliveryRecord = {
      proposalId: proposal.id.toString(),
      marker,
      text,
      status: 'posting',
      attempts: (existingDelivery?.attempts ?? 0) + 1,
      transactionHash: proposal.transactionHash,
      startedAt: existingDelivery?.startedAt ?? timestamp,
      updatedAt: timestamp,
    };
    await this.store.setDelivery(posting);

    try {
      const post = await this.publisher.createPost(text);
      await this.store.setDelivery({
        ...posting,
        status: 'posted',
        postId: post.id,
        updatedAt: new Date().toISOString(),
      });
      this.logger.info(`Published X post ${post.id} for proposal ${proposal.id}`);
    } catch (error) {
      await this.store.setDelivery({
        ...posting,
        lastError: errorMessage(error),
        updatedAt: new Date().toISOString(),
      });
      throw error;
    }
  }
}
