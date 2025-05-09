export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: "BigInt"; output: "BigInt"; }
  Bytes: { input: "Byte"; output: "Byte"; }
  Timestamp: { input: "Timestamp"; output: "Timestamp"; }
};

export type Account = {
  __typename?: 'Account';
  /** Delegate address of the token holder which will participate in votings. Delegates don't need to hold any tokens and can even be the token holder itself. */
  delegate?: Maybe<Delegate>;
  /** An Account is any address that holds any amount of Nouns, the id used is the blockchain address. */
  id: Scalars['ID']['output'];
  /** The Nouns owned by this account */
  nouns: Array<Noun>;
  /** Noun balance of this address expressed as a BigInt normalized value for the Nouns ERC721 Token */
  tokenBalance: Scalars['BigInt']['output'];
  /** Noun balance of this address expressed in the smallest unit of the Nouns ERC721 Token */
  tokenBalanceRaw: Scalars['BigInt']['output'];
  /** Total amount of Nouns ever held by this address expressed as a BigInt normalized value for the Nouns ERC721 Token */
  totalTokensHeld: Scalars['BigInt']['output'];
  /** Total amount of Nouns ever held by this address expressed in the smallest unit of the Nouns ERC721 Token */
  totalTokensHeldRaw: Scalars['BigInt']['output'];
};

export type Auction = {
  __typename?: 'Auction';
  /** The current highest bid amount */
  amount: Scalars['BigInt']['output'];
  /** The account with the current highest bid */
  bidder?: Maybe<Account>;
  /** The auction bids */
  bids: Array<Bid>;
  clientId: Scalars['Int']['output'];
  /** The time that the auction is scheduled to end */
  endTime: Scalars['BigInt']['output'];
  /** The Noun's ERC721 token id */
  id: Scalars['ID']['output'];
  /** The Noun */
  noun: Noun;
  /** Whether or not the auction has been settled */
  settled: Scalars['Boolean']['output'];
  /** The time that the auction started */
  startTime: Scalars['BigInt']['output'];
};

export type Bid = {
  __typename?: 'Bid';
  /** Bid amount */
  amount: Scalars['BigInt']['output'];
  /** The auction being bid in */
  auction: Auction;
  /** Bidder account */
  bidder?: Maybe<Account>;
  /** Block number of the bid */
  blockNumber: Scalars['BigInt']['output'];
  /** The timestamp of the block the bid is in */
  blockTimestamp: Scalars['BigInt']['output'];
  /** The ID of the client that facilitated this bid */
  clientId?: Maybe<Scalars['Int']['output']>;
  /** Noun.id-amount */
  id: Scalars['ID']['output'];
  /** The Noun being bid on */
  noun: Noun;
  /** Transaction hash for the bid */
  txHash: Scalars['Bytes']['output'];
  /** Index of transaction within block */
  txIndex: Scalars['BigInt']['output'];
};

export type CandidateFeedback = {
  __typename?: 'CandidateFeedback';
  /** The proposal candidate this feedback is provided on */
  candidate: ProposalCandidate;
  /** The feedback's creation block */
  createdBlock: Scalars['BigInt']['output'];
  /** This feedback's creation timestamp */
  createdTimestamp: Scalars['BigInt']['output'];
  /** A concatination of tx hash and log index, just to make sure these entities have a unique ID */
  id: Scalars['ID']['output'];
  /** The optional feedback reason free text */
  reason?: Maybe<Scalars['String']['output']>;
  /** The integer support value: against (0), for (1), or abstain (2) */
  supportDetailed: Scalars['Int']['output'];
  /** The voter account providing the feedback */
  voter: Delegate;
  /** Amount of votes voter had when feedback was submitted */
  votes: Scalars['BigInt']['output'];
};

export type Delegate = {
  __typename?: 'Delegate';
  /** Amount of votes delegated to this delegate to be used on proposal votings expressed as a BigInt normalized value for the Nouns ERC721 Token */
  delegatedVotes: Scalars['BigInt']['output'];
  /** Amount of votes delegated to this delegate to be used on proposal votings expressed in the smallest unit of the Nouns ERC721 Token */
  delegatedVotesRaw: Scalars['BigInt']['output'];
  /** A Delegate is any address that has been delegated with voting tokens by a token holder, id is the blockchain address of said delegate */
  id: Scalars['ID']['output'];
  /** Nouns that this delegate represents */
  nounsRepresented: Array<Noun>;
  /** Proposals that the delegate has created */
  proposals: Array<Proposal>;
  /** Token holders that this delegate represents */
  tokenHoldersRepresented: Array<Account>;
  tokenHoldersRepresentedAmount: Scalars['Int']['output'];
  /** Votes that a delegate has made in different proposals */
  votes: Array<Vote>;
};

export type DelegationEvent = {
  __typename?: 'DelegationEvent';
  /** Block number of the event */
  blockNumber: Scalars['BigInt']['output'];
  /** The timestamp of the block the event is in */
  blockTimestamp: Scalars['BigInt']['output'];
  /** Current delegator address */
  delegator: Account;
  /** The txn hash of this event + nounId */
  id: Scalars['ID']['output'];
  /** New delegate address */
  newDelegate: Delegate;
  /** The Noun being delegated */
  noun: Noun;
  /** Previous delegate address */
  previousDelegate: Delegate;
};

export type DynamicQuorumParams = {
  __typename?: 'DynamicQuorumParams';
  /** The block from which proposals are using DQ, based on when we first see configuration being set */
  dynamicQuorumStartBlock?: Maybe<Scalars['BigInt']['output']>;
  /** Unique entity used to store the latest dymanic quorum params */
  id: Scalars['ID']['output'];
  /** Max quorum basis points */
  maxQuorumVotesBPS: Scalars['Int']['output'];
  /** Min quorum basis points */
  minQuorumVotesBPS: Scalars['Int']['output'];
  /** The dynamic quorum coefficient */
  quorumCoefficient: Scalars['BigInt']['output'];
};

export type EscrowDeposit = {
  __typename?: 'EscrowDeposit';
  createdAt: Scalars['BigInt']['output'];
  fork: Fork;
  id: Scalars['ID']['output'];
  owner: Delegate;
  proposalIDs: Array<Scalars['BigInt']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  tokenIDs: Array<Scalars['BigInt']['output']>;
};

export type EscrowWithdrawal = {
  __typename?: 'EscrowWithdrawal';
  createdAt: Scalars['BigInt']['output'];
  fork: Fork;
  id: Scalars['ID']['output'];
  owner: Delegate;
  tokenIDs: Array<Scalars['BigInt']['output']>;
};

export type EscrowedNoun = {
  __typename?: 'EscrowedNoun';
  escrowDeposit: EscrowDeposit;
  fork: Fork;
  id: Scalars['ID']['output'];
  noun: Noun;
  owner: Delegate;
};

export type Fork = {
  __typename?: 'Fork';
  escrowDeposits: Array<EscrowDeposit>;
  escrowWithdrawals: Array<EscrowWithdrawal>;
  escrowedNouns: Array<EscrowedNoun>;
  executed?: Maybe<Scalars['Boolean']['output']>;
  executedAt?: Maybe<Scalars['BigInt']['output']>;
  /** The fork ID as int, to make it easier to query for the latest fork */
  forkID: Scalars['BigInt']['output'];
  forkToken?: Maybe<Scalars['Bytes']['output']>;
  forkTreasury?: Maybe<Scalars['Bytes']['output']>;
  forkingPeriodEndTimestamp?: Maybe<Scalars['BigInt']['output']>;
  /** The fork ID given by the escrow contract */
  id: Scalars['ID']['output'];
  joinedNouns: Array<ForkJoinedNoun>;
  tokensForkingCount: Scalars['Int']['output'];
  tokensInEscrowCount: Scalars['Int']['output'];
};

export type ForkJoin = {
  __typename?: 'ForkJoin';
  createdAt: Scalars['BigInt']['output'];
  fork: Fork;
  id: Scalars['ID']['output'];
  owner: Delegate;
  proposalIDs: Array<Scalars['BigInt']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  tokenIDs: Array<Scalars['BigInt']['output']>;
};

export type ForkJoinedNoun = {
  __typename?: 'ForkJoinedNoun';
  fork: Fork;
  forkJoin: ForkJoin;
  id: Scalars['ID']['output'];
  noun: Noun;
  owner: Delegate;
};

export type Governance = {
  __typename?: 'Governance';
  /** Number of candidates created */
  candidates: Scalars['BigInt']['output'];
  /** Total number of delegates participating on the governance currently */
  currentDelegates: Scalars['BigInt']['output'];
  /** Total number of token holders currently */
  currentTokenHolders: Scalars['BigInt']['output'];
  /** Total number of votes delegated expressed as a BigInt normalized value for the Nouns ERC721 Token */
  delegatedVotes: Scalars['BigInt']['output'];
  /** Total number of votes delegated expressed in the smallest unit of the Nouns ERC721 Token */
  delegatedVotesRaw: Scalars['BigInt']['output'];
  /** Unique entity used to keep track of common aggregated data */
  id: Scalars['ID']['output'];
  /** Number of proposals created */
  proposals: Scalars['BigInt']['output'];
  /** Number of proposals currently queued for execution */
  proposalsQueued: Scalars['BigInt']['output'];
  /** Total number of delegates that held delegated votes */
  totalDelegates: Scalars['BigInt']['output'];
  /** Total number of token holders */
  totalTokenHolders: Scalars['BigInt']['output'];
  /** The proposal ID from which vote snapshots are taken at vote start instead of proposal creation */
  voteSnapshotBlockSwitchProposalId: Scalars['BigInt']['output'];
};

export type Noun = {
  __typename?: 'Noun';
  /** The Noun's ERC721 token id */
  id: Scalars['ID']['output'];
  /** The owner of the Noun */
  owner: Account;
  /** The seed used to determine the Noun's traits */
  seed?: Maybe<Seed>;
  /** Historical votes for the Noun */
  votes: Array<Vote>;
};

export type Proposal = {
  __typename?: 'Proposal';
  /** The number of votes to abstain on the proposal */
  abstainVotes: Scalars['BigInt']['output'];
  /** Adjusted total supply when this proposal was created */
  adjustedTotalSupply: Scalars['BigInt']['output'];
  /** The number of votes against of the proposal */
  againstVotes: Scalars['BigInt']['output'];
  /** Call data for the change */
  calldatas?: Maybe<Array<Scalars['Bytes']['output']>>;
  /** The block number at which this proposal was canceled */
  canceledBlock?: Maybe<Scalars['BigInt']['output']>;
  /** The timestamp when this proposal was canceled */
  canceledTimestamp?: Maybe<Scalars['BigInt']['output']>;
  /** The transaction hash when the proposal was canceled */
  canceledTransactionHash?: Maybe<Scalars['Bytes']['output']>;
  /** The ID of the client that facilitated this proposal */
  clientId: Scalars['Int']['output'];
  /** The proposal creation block */
  createdBlock: Scalars['BigInt']['output'];
  /** The proposal creation timestamp */
  createdTimestamp: Scalars['BigInt']['output'];
  /** The proposal creation transaction hash */
  createdTransactionHash: Scalars['Bytes']['output'];
  /** The full proposal description, which includes the title */
  description: Scalars['String']['output'];
  /** Block number from where the voting ends */
  endBlock: Scalars['BigInt']['output'];
  /** The block number at which this proposal was executed */
  executedBlock?: Maybe<Scalars['BigInt']['output']>;
  /** The timestamp when this proposal was executed */
  executedTimestamp?: Maybe<Scalars['BigInt']['output']>;
  /** The transaction hash when the proposal was executed */
  executedTransactionHash?: Maybe<Scalars['Bytes']['output']>;
  /** Once the proposal is queued for execution it will have an ETA of the execution */
  executionETA?: Maybe<Scalars['BigInt']['output']>;
  /** Feedback posts associated to this proposal */
  feedbackPosts: Array<ProposalFeedback>;
  /** The number of votes in favor of the proposal */
  forVotes: Scalars['BigInt']['output'];
  /** Internal proposal ID, in this implementation it seems to be a autoincremental id */
  id: Scalars['ID']['output'];
  /** The proposal's last update block */
  lastUpdatedBlock: Scalars['BigInt']['output'];
  /** The proposal's last update timestamp */
  lastUpdatedTimestamp: Scalars['BigInt']['output'];
  /** The proposal's last update transaction hash */
  lastUpdatedTransactionHash: Scalars['Bytes']['output'];
  /** Dynamic quorum param snapshot: max quorum basis points */
  maxQuorumVotesBPS: Scalars['Int']['output'];
  /** Dynamic quorum param snapshot: min quorum basis points */
  minQuorumVotesBPS: Scalars['Int']['output'];
  /** The objection period end block */
  objectionPeriodEndBlock: Scalars['BigInt']['output'];
  /** True if the proposal was created via proposeOnTimelockV1 */
  onTimelockV1?: Maybe<Scalars['Boolean']['output']>;
  /** The proposal threshold at the time of proposal creation */
  proposalThreshold?: Maybe<Scalars['BigInt']['output']>;
  /** Delegate that proposed the change */
  proposer: Delegate;
  /** The block number at which this proposal was queued */
  queuedBlock?: Maybe<Scalars['BigInt']['output']>;
  /** The timestamp when this proposal was queued */
  queuedTimestamp?: Maybe<Scalars['BigInt']['output']>;
  /** The transaction hash when the proposal was queued */
  queuedTransactionHash?: Maybe<Scalars['Bytes']['output']>;
  /** Dynamic quorum param snapshot: the dynamic quorum coefficient */
  quorumCoefficient: Scalars['BigInt']['output'];
  /** The required number of votes for quorum at the time of proposal creation */
  quorumVotes?: Maybe<Scalars['BigInt']['output']>;
  /** Signature data for the change */
  signatures?: Maybe<Array<Scalars['String']['output']>>;
  /** Delegates that signed on this proposal to get it over the proposal threshold */
  signers?: Maybe<Array<Delegate>>;
  /** Block number from where the voting starts */
  startBlock: Scalars['BigInt']['output'];
  /** Status of the proposal */
  status?: Maybe<ProposalStatus>;
  /** Targets data for the change */
  targets?: Maybe<Array<Scalars['Bytes']['output']>>;
  /** The proposal title, parsed from the description */
  title: Scalars['String']['output'];
  /** Total supply when this proposal was created */
  totalSupply: Scalars['BigInt']['output'];
  /** The update period end block */
  updatePeriodEndBlock?: Maybe<Scalars['BigInt']['output']>;
  /** Values data for the change */
  values?: Maybe<Array<Scalars['BigInt']['output']>>;
  /** The block number at which this proposal was vetoed */
  vetoedBlock?: Maybe<Scalars['BigInt']['output']>;
  /** The timestamp when this proposal was vetoed */
  vetoedTimestamp?: Maybe<Scalars['BigInt']['output']>;
  /** The transaction hash when the proposal was vetoed */
  vetoedTransactionHash?: Maybe<Scalars['Bytes']['output']>;
  /** The block at which voting balance snapshots are taken for this proposal */
  voteSnapshotBlock: Scalars['BigInt']['output'];
  /** Votes associated to this proposal */
  votes: Array<Vote>;
};

export type ProposalCandidate = {
  __typename?: 'ProposalCandidate';
  /** Whether this candidate was canceled or not */
  canceled: Scalars['Boolean']['output'];
  /** The block number at which this candidate was canceled */
  canceledBlock?: Maybe<Scalars['BigInt']['output']>;
  /** The timestamp at which this candidate was canceled */
  canceledTimestamp?: Maybe<Scalars['BigInt']['output']>;
  /** The transaction hash at which this candidate was canceled */
  canceledTransactionHash?: Maybe<Scalars['Bytes']['output']>;
  /** The proposal candidate creation block */
  createdBlock: Scalars['BigInt']['output'];
  /** The proposal candidate creation timestamp */
  createdTimestamp: Scalars['BigInt']['output'];
  /** The proposal candidate creation transaction hash */
  createdTransactionHash: Scalars['Bytes']['output'];
  /** A concatination of proposer and slug */
  id: Scalars['ID']['output'];
  /** The proposal candidate's last update block */
  lastUpdatedBlock: Scalars['BigInt']['output'];
  /** The proposal candidate's last update timestamp */
  lastUpdatedTimestamp: Scalars['BigInt']['output'];
  /** Latest version of the proposal */
  latestVersion: ProposalCandidateVersion;
  /** This candidate's number */
  number: Scalars['BigInt']['output'];
  /** The proposer account */
  proposer: Scalars['Bytes']['output'];
  /** The candidate slug, together with the proposer account makes the candidate's unique key */
  slug: Scalars['String']['output'];
  /** This candidate's versions */
  versions: Array<ProposalCandidateVersion>;
};

export type ProposalCandidateContent = {
  __typename?: 'ProposalCandidateContent';
  /** Call data for the change */
  calldatas?: Maybe<Array<Scalars['Bytes']['output']>>;
  /** This proposal's content signatures by signers */
  contentSignatures: Array<ProposalCandidateSignature>;
  /** The full proposal description, which includes the title */
  description: Scalars['String']['output'];
  /** The encoded proposal hash in bytes */
  encodedProposalHash: Scalars['Bytes']['output'];
  /** The encoded proposal hash */
  id: Scalars['ID']['output'];
  /** IDs of proposals (not candidates) with the same content */
  matchingProposalIds?: Maybe<Array<Scalars['BigInt']['output']>>;
  /** The proposal id that this content is updating. 0 if it's a new proposal */
  proposalIdToUpdate: Scalars['BigInt']['output'];
  /** The proposer account */
  proposer: Scalars['Bytes']['output'];
  /** Signature data for the change */
  signatures?: Maybe<Array<Scalars['String']['output']>>;
  /** Targets data for the change */
  targets?: Maybe<Array<Scalars['Bytes']['output']>>;
  /** The proposal title, parsed from the description */
  title: Scalars['String']['output'];
  /** Values data for the change */
  values?: Maybe<Array<Scalars['BigInt']['output']>>;
};

export type ProposalCandidateSignature = {
  __typename?: 'ProposalCandidateSignature';
  /** Whether this signature has been canceled */
  canceled: Scalars['Boolean']['output'];
  /** The candidate content this signature is signing on */
  content: ProposalCandidateContent;
  /** The signature's creation block */
  createdBlock: Scalars['BigInt']['output'];
  /** The signature's creation timestamp */
  createdTimestamp: Scalars['BigInt']['output'];
  /** The signature's transaction hash */
  createdTransactionHash: Scalars['Bytes']['output'];
  /** The hash of the abi encoded proposal data */
  encodedProposalHash: Scalars['Bytes']['output'];
  /** The signature's expiration timestamp */
  expirationTimestamp: Scalars['BigInt']['output'];
  /** A concatination of tx hash and log index, just to make sure these entities have a unique ID */
  id: Scalars['ID']['output'];
  /** The free text signer reason */
  reason: Scalars['String']['output'];
  /** The signature bytes */
  sig: Scalars['Bytes']['output'];
  /** The typed signature hash */
  sigDigest: Scalars['Bytes']['output'];
  /** The signing account */
  signer: Delegate;
};

export type ProposalCandidateVersion = {
  __typename?: 'ProposalCandidateVersion';
  /** The proposal content */
  content: ProposalCandidateContent;
  /** The version's creation block */
  createdBlock: Scalars['BigInt']['output'];
  /** This version's creation timestamp */
  createdTimestamp: Scalars['BigInt']['output'];
  /** A concatination of tx hash and log index, just to make sure these entities have a unique ID */
  id: Scalars['ID']['output'];
  /** The proposal candidate this entity is a version of */
  proposal: ProposalCandidate;
  /** The update message of this version, relevant when it's an update */
  updateMessage: Scalars['String']['output'];
};

export type ProposalFeedback = {
  __typename?: 'ProposalFeedback';
  /** The feedback's creation block */
  createdBlock: Scalars['BigInt']['output'];
  /** This feedback's creation timestamp */
  createdTimestamp: Scalars['BigInt']['output'];
  /** A concatination of tx hash and log index, just to make sure these entities have a unique ID */
  id: Scalars['ID']['output'];
  /** The proposal this feedback is provided on */
  proposal: Proposal;
  /** The optional feedback reason free text */
  reason?: Maybe<Scalars['String']['output']>;
  /** The integer support value: against (0), for (1), or abstain (2) */
  supportDetailed: Scalars['Int']['output'];
  /** The voter account providing the feedback */
  voter: Delegate;
  /** Amount of votes voter had when feedback was submitted */
  votes: Scalars['BigInt']['output'];
};

export enum ProposalStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Executed = 'EXECUTED',
  Pending = 'PENDING',
  Queued = 'QUEUED',
  Vetoed = 'VETOED'
}

export type ProposalVersion = {
  __typename?: 'ProposalVersion';
  /** Call data for the change */
  calldatas?: Maybe<Array<Scalars['Bytes']['output']>>;
  /** The block timestamp of the update */
  createdAt: Scalars['BigInt']['output'];
  /** The block number of the update */
  createdBlock: Scalars['BigInt']['output'];
  /** The transaction hash of the update */
  createdTransactionHash: Scalars['Bytes']['output'];
  /** The full proposal description, which includes the title */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The proposal that was updated */
  proposal: Proposal;
  /** Signature data for the change */
  signatures?: Maybe<Array<Scalars['String']['output']>>;
  /** Targets data for the change */
  targets?: Maybe<Array<Scalars['Bytes']['output']>>;
  /** The proposal title, parsed from the description */
  title: Scalars['String']['output'];
  /** The update message of this proposal version, relevant when it's a proposal update */
  updateMessage: Scalars['String']['output'];
  /** Values data for the change */
  values?: Maybe<Array<Scalars['BigInt']['output']>>;
};

export type Seed = {
  __typename?: 'Seed';
  /** The accessory index */
  accessory: Scalars['BigInt']['output'];
  /** The background index */
  background: Scalars['BigInt']['output'];
  /** The body index */
  body: Scalars['BigInt']['output'];
  /** The glasses index */
  glasses: Scalars['BigInt']['output'];
  /** The head index */
  head: Scalars['BigInt']['output'];
  /** The Noun's ERC721 token id */
  id: Scalars['ID']['output'];
};

export type TransferEvent = {
  __typename?: 'TransferEvent';
  /** Block number of the event */
  blockNumber: Scalars['BigInt']['output'];
  /** The timestamp of the block the event is in */
  blockTimestamp: Scalars['BigInt']['output'];
  /** The txn hash of this event */
  id: Scalars['ID']['output'];
  /** New holder address */
  newHolder: Account;
  /** The Noun being transfered */
  noun: Noun;
  /** Previous holder address */
  previousHolder: Account;
};

export type Vote = {
  __typename?: 'Vote';
  /** Block number of vote */
  blockNumber: Scalars['BigInt']['output'];
  /** The timestamp of the block the vote is in */
  blockTimestamp: Scalars['BigInt']['output'];
  /** The ID of the client that facilitated this vote */
  clientId: Scalars['Int']['output'];
  /** Delegate ID + Proposal ID */
  id: Scalars['ID']['output'];
  /** The Nouns used to vote */
  nouns?: Maybe<Array<Noun>>;
  /** Proposal that is being voted on */
  proposal: Proposal;
  /** The optional vote reason */
  reason?: Maybe<Scalars['String']['output']>;
  /** Whether the vote is in favour of the proposal */
  support: Scalars['Boolean']['output'];
  /** The integer support value: against (0), for (1), or abstain (2) */
  supportDetailed: Scalars['Int']['output'];
  /** The transaction hash of the vote */
  transactionHash: Scalars['Bytes']['output'];
  /** Delegate that emitted the vote */
  voter: Delegate;
  /** Amount of votes in favour or against expressed as a BigInt normalized value for the Nouns ERC721 Token */
  votes: Scalars['BigInt']['output'];
  /** Amount of votes in favour or against expressed in the smallest unit of the Nouns ERC721 Token */
  votesRaw: Scalars['BigInt']['output'];
};
