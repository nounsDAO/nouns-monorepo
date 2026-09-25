export interface ProposalRecord {
  id: bigint;
  title: string;
  createdBlock: bigint;
  transactionHash: string;
}

export interface ProposalSource {
  getLatestProposalId(): Promise<bigint | null>;
  getProposalsAfter(proposalId: bigint): Promise<ProposalRecord[]>;
}

export interface ExistingPost {
  id: string;
}

export interface PostPublisher {
  createPost(text: string): Promise<ExistingPost>;
  findExistingPost(marker: string): Promise<ExistingPost | null>;
}

export interface DeliveryRecord {
  proposalId: string;
  marker: string;
  text: string;
  status: 'posting' | 'posted';
  attempts: number;
  transactionHash: string;
  startedAt: string;
  updatedAt: string;
  postId?: string;
  lastError?: string;
}

export interface BotStateStore {
  getCursor(): Promise<bigint | null>;
  setCursor(blockNumber: bigint): Promise<void>;
  getDelivery(proposalId: bigint): Promise<DeliveryRecord | null>;
  setDelivery(delivery: DeliveryRecord): Promise<void>;
}

export type BotLogger = Pick<Console, 'error' | 'info' | 'warn'>;
