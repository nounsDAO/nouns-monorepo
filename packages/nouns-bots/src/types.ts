import {
  STATUS_ACTIVE,
  STATUS_QUEUED,
  STATUS_PENDING,
  STATUS_EXECUTED,
  STATUS_CANCELLED,
  STATUS_VETOED,
} from './utils/constants';

export interface Account {
  id: string;
}

export interface Bid {
  id: string;
  amount: string;
  bidder: Account;
}

export interface AuctionBids {
  id: number;
  endTime: number;
  bids: Bid[];
}

export interface TokenMetadata {
  name: string;
  description: string;
  image: string;
}

export interface IAuctionLifecycleHandler {
  handleNewAuction(auctionId: number): Promise<void>;
  handleNewBid(auctionId: number, bid: Bid): Promise<void>;
  handleAuctionEndingSoon?(auctionId: number): Promise<void>;
  handleNewProposal?(proposal: Proposal): Promise<void>;
  handleUpdatedProposalStatus?(proposal: Proposal): Promise<void>;
  handleProposalAtRiskOfExpiry?(proposal: Proposal): Promise<void>;
  handleGovernanceVote?(proposal: Proposal, vote: Vote): Promise<void>;
}

export interface ProposalSubgraphResponse {
  proposals: Proposal[];
}

export type ProposalStatus =
  | typeof STATUS_ACTIVE
  | typeof STATUS_CANCELLED
  | typeof STATUS_EXECUTED
  | typeof STATUS_PENDING
  | typeof STATUS_QUEUED
  | typeof STATUS_VETOED;

export interface Proposal {
  id: number;
  proposer: Account;
  description: string;
  status: ProposalStatus;
  quorumVotes: number;
  proposalThreshold: number;
  startBlock: number;
  endBlock: number;
  executionETA: number;
  votes: Vote[];
}

export interface Account {
  id: string;
}

export enum VoteDirection {
  AGAINST = 0,
  FOR = 1,
  ABSTAIN = 2,
}

export interface Vote {
  id: string;
  voter: Account;
  votes: number;
  supportDetailed: VoteDirection;
  reason: string | null;
}
