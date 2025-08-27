/* eslint-disable */
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
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
  BigDecimal: { input: any; output: any; }
  BigInt: { input: bigint; output: bigint; }
  Bytes: { input: "Byte"; output: "Byte"; }
  /**
   * 8 bytes signed integer
   *
   */
  Int8: { input: any; output: any; }
  /**
   * A string representation of microseconds UNIX timestamp (16 digits)
   *
   */
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


export type AccountNounsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NounOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<NounFilter>;
};

export type AccountFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AccountFilter>>>;
  delegate?: InputMaybe<Scalars['String']['input']>;
  delegate_?: InputMaybe<DelegateFilter>;
  delegate_contains?: InputMaybe<Scalars['String']['input']>;
  delegate_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegate_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_gt?: InputMaybe<Scalars['String']['input']>;
  delegate_gte?: InputMaybe<Scalars['String']['input']>;
  delegate_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegate_lt?: InputMaybe<Scalars['String']['input']>;
  delegate_lte?: InputMaybe<Scalars['String']['input']>;
  delegate_not?: InputMaybe<Scalars['String']['input']>;
  delegate_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegate_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegate_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegate_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegate_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegate_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegate_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nouns?: InputMaybe<Array<Scalars['String']['input']>>;
  nouns_?: InputMaybe<NounFilter>;
  nouns_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  nouns_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  nouns_not?: InputMaybe<Array<Scalars['String']['input']>>;
  nouns_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  nouns_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AccountFilter>>>;
  tokenBalance?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalanceRaw?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalanceRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalanceRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalanceRaw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenBalanceRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalanceRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalanceRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalanceRaw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenBalance_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalance_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalance_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenBalance_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalance_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalance_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalTokensHeld?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeldRaw?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeldRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeldRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeldRaw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalTokensHeldRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeldRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeldRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeldRaw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalTokensHeld_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeld_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeld_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalTokensHeld_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeld_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeld_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokensHeld_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum AccountOrderBy {
  Delegate = 'delegate',
  DelegateDelegatedVotes = 'delegate__delegatedVotes',
  DelegateDelegatedVotesRaw = 'delegate__delegatedVotesRaw',
  DelegateId = 'delegate__id',
  DelegateTokenHoldersRepresentedAmount = 'delegate__tokenHoldersRepresentedAmount',
  Id = 'id',
  Nouns = 'nouns',
  TokenBalance = 'tokenBalance',
  TokenBalanceRaw = 'tokenBalanceRaw',
  TotalTokensHeld = 'totalTokensHeld',
  TotalTokensHeldRaw = 'totalTokensHeldRaw'
}

export enum AggregationInterval {
  Day = 'day',
  Hour = 'hour'
}

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


export type AuctionBidsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BidOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BidFilter>;
};

export type AuctionFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<AuctionFilter>>>;
  bidder?: InputMaybe<Scalars['String']['input']>;
  bidder_?: InputMaybe<AccountFilter>;
  bidder_contains?: InputMaybe<Scalars['String']['input']>;
  bidder_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bidder_ends_with?: InputMaybe<Scalars['String']['input']>;
  bidder_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bidder_gt?: InputMaybe<Scalars['String']['input']>;
  bidder_gte?: InputMaybe<Scalars['String']['input']>;
  bidder_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bidder_lt?: InputMaybe<Scalars['String']['input']>;
  bidder_lte?: InputMaybe<Scalars['String']['input']>;
  bidder_not?: InputMaybe<Scalars['String']['input']>;
  bidder_not_contains?: InputMaybe<Scalars['String']['input']>;
  bidder_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bidder_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  bidder_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bidder_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bidder_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  bidder_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bidder_starts_with?: InputMaybe<Scalars['String']['input']>;
  bidder_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bids_?: InputMaybe<BidFilter>;
  clientId?: InputMaybe<Scalars['Int']['input']>;
  clientId_gt?: InputMaybe<Scalars['Int']['input']>;
  clientId_gte?: InputMaybe<Scalars['Int']['input']>;
  clientId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  clientId_lt?: InputMaybe<Scalars['Int']['input']>;
  clientId_lte?: InputMaybe<Scalars['Int']['input']>;
  clientId_not?: InputMaybe<Scalars['Int']['input']>;
  clientId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  endTime?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  endTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  noun?: InputMaybe<Scalars['String']['input']>;
  noun_?: InputMaybe<NounFilter>;
  noun_contains?: InputMaybe<Scalars['String']['input']>;
  noun_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_ends_with?: InputMaybe<Scalars['String']['input']>;
  noun_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_gt?: InputMaybe<Scalars['String']['input']>;
  noun_gte?: InputMaybe<Scalars['String']['input']>;
  noun_in?: InputMaybe<Array<Scalars['String']['input']>>;
  noun_lt?: InputMaybe<Scalars['String']['input']>;
  noun_lte?: InputMaybe<Scalars['String']['input']>;
  noun_not?: InputMaybe<Scalars['String']['input']>;
  noun_not_contains?: InputMaybe<Scalars['String']['input']>;
  noun_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  noun_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  noun_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  noun_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_starts_with?: InputMaybe<Scalars['String']['input']>;
  noun_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<AuctionFilter>>>;
  settled?: InputMaybe<Scalars['Boolean']['input']>;
  settled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  settled_not?: InputMaybe<Scalars['Boolean']['input']>;
  settled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  startTime?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  startTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum AuctionOrderBy {
  Amount = 'amount',
  Bidder = 'bidder',
  BidderId = 'bidder__id',
  BidderTokenBalance = 'bidder__tokenBalance',
  BidderTokenBalanceRaw = 'bidder__tokenBalanceRaw',
  BidderTotalTokensHeld = 'bidder__totalTokensHeld',
  BidderTotalTokensHeldRaw = 'bidder__totalTokensHeldRaw',
  Bids = 'bids',
  ClientId = 'clientId',
  EndTime = 'endTime',
  Id = 'id',
  Noun = 'noun',
  NounId = 'noun__id',
  Settled = 'settled',
  StartTime = 'startTime'
}

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
  /** Transaction has for the bid */
  txHash: Scalars['Bytes']['output'];
  /** Index of transaction within block */
  txIndex: Scalars['BigInt']['output'];
};

export type BidFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<BidFilter>>>;
  auction?: InputMaybe<Scalars['String']['input']>;
  auction_?: InputMaybe<AuctionFilter>;
  auction_contains?: InputMaybe<Scalars['String']['input']>;
  auction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_ends_with?: InputMaybe<Scalars['String']['input']>;
  auction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_gt?: InputMaybe<Scalars['String']['input']>;
  auction_gte?: InputMaybe<Scalars['String']['input']>;
  auction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auction_lt?: InputMaybe<Scalars['String']['input']>;
  auction_lte?: InputMaybe<Scalars['String']['input']>;
  auction_not?: InputMaybe<Scalars['String']['input']>;
  auction_not_contains?: InputMaybe<Scalars['String']['input']>;
  auction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auction_starts_with?: InputMaybe<Scalars['String']['input']>;
  auction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bidder?: InputMaybe<Scalars['String']['input']>;
  bidder_?: InputMaybe<AccountFilter>;
  bidder_contains?: InputMaybe<Scalars['String']['input']>;
  bidder_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bidder_ends_with?: InputMaybe<Scalars['String']['input']>;
  bidder_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bidder_gt?: InputMaybe<Scalars['String']['input']>;
  bidder_gte?: InputMaybe<Scalars['String']['input']>;
  bidder_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bidder_lt?: InputMaybe<Scalars['String']['input']>;
  bidder_lte?: InputMaybe<Scalars['String']['input']>;
  bidder_not?: InputMaybe<Scalars['String']['input']>;
  bidder_not_contains?: InputMaybe<Scalars['String']['input']>;
  bidder_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  bidder_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  bidder_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bidder_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  bidder_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  bidder_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  bidder_starts_with?: InputMaybe<Scalars['String']['input']>;
  bidder_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  clientId?: InputMaybe<Scalars['Int']['input']>;
  clientId_gt?: InputMaybe<Scalars['Int']['input']>;
  clientId_gte?: InputMaybe<Scalars['Int']['input']>;
  clientId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  clientId_lt?: InputMaybe<Scalars['Int']['input']>;
  clientId_lte?: InputMaybe<Scalars['Int']['input']>;
  clientId_not?: InputMaybe<Scalars['Int']['input']>;
  clientId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  noun?: InputMaybe<Scalars['String']['input']>;
  noun_?: InputMaybe<NounFilter>;
  noun_contains?: InputMaybe<Scalars['String']['input']>;
  noun_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_ends_with?: InputMaybe<Scalars['String']['input']>;
  noun_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_gt?: InputMaybe<Scalars['String']['input']>;
  noun_gte?: InputMaybe<Scalars['String']['input']>;
  noun_in?: InputMaybe<Array<Scalars['String']['input']>>;
  noun_lt?: InputMaybe<Scalars['String']['input']>;
  noun_lte?: InputMaybe<Scalars['String']['input']>;
  noun_not?: InputMaybe<Scalars['String']['input']>;
  noun_not_contains?: InputMaybe<Scalars['String']['input']>;
  noun_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  noun_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  noun_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  noun_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_starts_with?: InputMaybe<Scalars['String']['input']>;
  noun_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<BidFilter>>>;
  txHash?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  txHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  txIndex?: InputMaybe<Scalars['BigInt']['input']>;
  txIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  txIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum BidOrderBy {
  Amount = 'amount',
  Auction = 'auction',
  AuctionAmount = 'auction__amount',
  AuctionClientId = 'auction__clientId',
  AuctionEndTime = 'auction__endTime',
  AuctionId = 'auction__id',
  AuctionSettled = 'auction__settled',
  AuctionStartTime = 'auction__startTime',
  Bidder = 'bidder',
  BidderId = 'bidder__id',
  BidderTokenBalance = 'bidder__tokenBalance',
  BidderTokenBalanceRaw = 'bidder__tokenBalanceRaw',
  BidderTotalTokensHeld = 'bidder__totalTokensHeld',
  BidderTotalTokensHeldRaw = 'bidder__totalTokensHeldRaw',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  ClientId = 'clientId',
  Id = 'id',
  Noun = 'noun',
  NounId = 'noun__id',
  TxHash = 'txHash',
  TxIndex = 'txIndex'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type BlockHeight = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
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

export type CandidateFeedbackFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<CandidateFeedbackFilter>>>;
  candidate?: InputMaybe<Scalars['String']['input']>;
  candidate_?: InputMaybe<ProposalCandidateFilter>;
  candidate_contains?: InputMaybe<Scalars['String']['input']>;
  candidate_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  candidate_ends_with?: InputMaybe<Scalars['String']['input']>;
  candidate_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  candidate_gt?: InputMaybe<Scalars['String']['input']>;
  candidate_gte?: InputMaybe<Scalars['String']['input']>;
  candidate_in?: InputMaybe<Array<Scalars['String']['input']>>;
  candidate_lt?: InputMaybe<Scalars['String']['input']>;
  candidate_lte?: InputMaybe<Scalars['String']['input']>;
  candidate_not?: InputMaybe<Scalars['String']['input']>;
  candidate_not_contains?: InputMaybe<Scalars['String']['input']>;
  candidate_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  candidate_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  candidate_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  candidate_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  candidate_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  candidate_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  candidate_starts_with?: InputMaybe<Scalars['String']['input']>;
  candidate_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdBlock?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<CandidateFeedbackFilter>>>;
  reason?: InputMaybe<Scalars['String']['input']>;
  reason_contains?: InputMaybe<Scalars['String']['input']>;
  reason_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_gt?: InputMaybe<Scalars['String']['input']>;
  reason_gte?: InputMaybe<Scalars['String']['input']>;
  reason_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_lt?: InputMaybe<Scalars['String']['input']>;
  reason_lte?: InputMaybe<Scalars['String']['input']>;
  reason_not?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  supportDetailed?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_gt?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_gte?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  supportDetailed_lt?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_lte?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_not?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  voter?: InputMaybe<Scalars['String']['input']>;
  voter_?: InputMaybe<DelegateFilter>;
  voter_contains?: InputMaybe<Scalars['String']['input']>;
  voter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_ends_with?: InputMaybe<Scalars['String']['input']>;
  voter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_gt?: InputMaybe<Scalars['String']['input']>;
  voter_gte?: InputMaybe<Scalars['String']['input']>;
  voter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voter_lt?: InputMaybe<Scalars['String']['input']>;
  voter_lte?: InputMaybe<Scalars['String']['input']>;
  voter_not?: InputMaybe<Scalars['String']['input']>;
  voter_not_contains?: InputMaybe<Scalars['String']['input']>;
  voter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  voter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  voter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_starts_with?: InputMaybe<Scalars['String']['input']>;
  voter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  votes?: InputMaybe<Scalars['BigInt']['input']>;
  votes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  votes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  votes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  votes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  votes_not?: InputMaybe<Scalars['BigInt']['input']>;
  votes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum CandidateFeedbackOrderBy {
  Candidate = 'candidate',
  CandidateCanceled = 'candidate__canceled',
  CandidateCanceledBlock = 'candidate__canceledBlock',
  CandidateCanceledTimestamp = 'candidate__canceledTimestamp',
  CandidateCreatedBlock = 'candidate__createdBlock',
  CandidateCreatedTimestamp = 'candidate__createdTimestamp',
  CandidateCreatedTransactionHash = 'candidate__createdTransactionHash',
  CandidateId = 'candidate__id',
  CandidateLastUpdatedBlock = 'candidate__lastUpdatedBlock',
  CandidateLastUpdatedTimestamp = 'candidate__lastUpdatedTimestamp',
  CandidateNumber = 'candidate__number',
  CandidateProposer = 'candidate__proposer',
  CandidateSlug = 'candidate__slug',
  CreatedBlock = 'createdBlock',
  CreatedTimestamp = 'createdTimestamp',
  Id = 'id',
  Reason = 'reason',
  SupportDetailed = 'supportDetailed',
  Voter = 'voter',
  VoterDelegatedVotes = 'voter__delegatedVotes',
  VoterDelegatedVotesRaw = 'voter__delegatedVotesRaw',
  VoterId = 'voter__id',
  VoterTokenHoldersRepresentedAmount = 'voter__tokenHoldersRepresentedAmount',
  Votes = 'votes'
}

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


export type DelegateNounsRepresentedArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NounOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<NounFilter>;
};


export type DelegateProposalsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProposalOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProposalFilter>;
};


export type DelegateTokenHoldersRepresentedArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AccountFilter>;
};


export type DelegateVotesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VoteOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VoteFilter>;
};

export type DelegateFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DelegateFilter>>>;
  delegatedVotes?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatedVotesRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatedVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatedVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nounsRepresented?: InputMaybe<Array<Scalars['String']['input']>>;
  nounsRepresented_?: InputMaybe<NounFilter>;
  nounsRepresented_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  nounsRepresented_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  nounsRepresented_not?: InputMaybe<Array<Scalars['String']['input']>>;
  nounsRepresented_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  nounsRepresented_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  or?: InputMaybe<Array<InputMaybe<DelegateFilter>>>;
  proposals_?: InputMaybe<ProposalFilter>;
  tokenHoldersRepresentedAmount?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_gt?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_gte?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokenHoldersRepresentedAmount_lt?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_lte?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_not?: InputMaybe<Scalars['Int']['input']>;
  tokenHoldersRepresentedAmount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokenHoldersRepresented_?: InputMaybe<AccountFilter>;
  votes_?: InputMaybe<VoteFilter>;
};

export enum DelegateOrderBy {
  DelegatedVotes = 'delegatedVotes',
  DelegatedVotesRaw = 'delegatedVotesRaw',
  Id = 'id',
  NounsRepresented = 'nounsRepresented',
  Proposals = 'proposals',
  TokenHoldersRepresented = 'tokenHoldersRepresented',
  TokenHoldersRepresentedAmount = 'tokenHoldersRepresentedAmount',
  Votes = 'votes'
}

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

export type DelegationEventFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DelegationEventFilter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegator?: InputMaybe<Scalars['String']['input']>;
  delegator_?: InputMaybe<AccountFilter>;
  delegator_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_gt?: InputMaybe<Scalars['String']['input']>;
  delegator_gte?: InputMaybe<Scalars['String']['input']>;
  delegator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_lt?: InputMaybe<Scalars['String']['input']>;
  delegator_lte?: InputMaybe<Scalars['String']['input']>;
  delegator_not?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  newDelegate?: InputMaybe<Scalars['String']['input']>;
  newDelegate_?: InputMaybe<DelegateFilter>;
  newDelegate_contains?: InputMaybe<Scalars['String']['input']>;
  newDelegate_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  newDelegate_ends_with?: InputMaybe<Scalars['String']['input']>;
  newDelegate_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newDelegate_gt?: InputMaybe<Scalars['String']['input']>;
  newDelegate_gte?: InputMaybe<Scalars['String']['input']>;
  newDelegate_in?: InputMaybe<Array<Scalars['String']['input']>>;
  newDelegate_lt?: InputMaybe<Scalars['String']['input']>;
  newDelegate_lte?: InputMaybe<Scalars['String']['input']>;
  newDelegate_not?: InputMaybe<Scalars['String']['input']>;
  newDelegate_not_contains?: InputMaybe<Scalars['String']['input']>;
  newDelegate_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  newDelegate_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  newDelegate_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newDelegate_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  newDelegate_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  newDelegate_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newDelegate_starts_with?: InputMaybe<Scalars['String']['input']>;
  newDelegate_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun?: InputMaybe<Scalars['String']['input']>;
  noun_?: InputMaybe<NounFilter>;
  noun_contains?: InputMaybe<Scalars['String']['input']>;
  noun_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_ends_with?: InputMaybe<Scalars['String']['input']>;
  noun_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_gt?: InputMaybe<Scalars['String']['input']>;
  noun_gte?: InputMaybe<Scalars['String']['input']>;
  noun_in?: InputMaybe<Array<Scalars['String']['input']>>;
  noun_lt?: InputMaybe<Scalars['String']['input']>;
  noun_lte?: InputMaybe<Scalars['String']['input']>;
  noun_not?: InputMaybe<Scalars['String']['input']>;
  noun_not_contains?: InputMaybe<Scalars['String']['input']>;
  noun_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  noun_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  noun_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  noun_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_starts_with?: InputMaybe<Scalars['String']['input']>;
  noun_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<DelegationEventFilter>>>;
  previousDelegate?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_?: InputMaybe<DelegateFilter>;
  previousDelegate_contains?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_ends_with?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_gt?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_gte?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_in?: InputMaybe<Array<Scalars['String']['input']>>;
  previousDelegate_lt?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_lte?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_not?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_not_contains?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  previousDelegate_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_starts_with?: InputMaybe<Scalars['String']['input']>;
  previousDelegate_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum DelegationEventOrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Delegator = 'delegator',
  DelegatorId = 'delegator__id',
  DelegatorTokenBalance = 'delegator__tokenBalance',
  DelegatorTokenBalanceRaw = 'delegator__tokenBalanceRaw',
  DelegatorTotalTokensHeld = 'delegator__totalTokensHeld',
  DelegatorTotalTokensHeldRaw = 'delegator__totalTokensHeldRaw',
  Id = 'id',
  NewDelegate = 'newDelegate',
  NewDelegateDelegatedVotes = 'newDelegate__delegatedVotes',
  NewDelegateDelegatedVotesRaw = 'newDelegate__delegatedVotesRaw',
  NewDelegateId = 'newDelegate__id',
  NewDelegateTokenHoldersRepresentedAmount = 'newDelegate__tokenHoldersRepresentedAmount',
  Noun = 'noun',
  NounId = 'noun__id',
  PreviousDelegate = 'previousDelegate',
  PreviousDelegateDelegatedVotes = 'previousDelegate__delegatedVotes',
  PreviousDelegateDelegatedVotesRaw = 'previousDelegate__delegatedVotesRaw',
  PreviousDelegateId = 'previousDelegate__id',
  PreviousDelegateTokenHoldersRepresentedAmount = 'previousDelegate__tokenHoldersRepresentedAmount'
}

export type DynamicQuorumParams = {
  __typename?: 'DynamicQuorumParams';
  /** The block from which proposals are using DQ, based on when we first see configuration being set */
  dynamicQuorumStartBlock?: Maybe<Scalars['BigInt']['output']>;
  /** Unique entity used to store the latest dynamic quorum params */
  id: Scalars['ID']['output'];
  /** Max quorum basis points */
  maxQuorumVotesBPS: Scalars['Int']['output'];
  /** Min quorum basis points */
  minQuorumVotesBPS: Scalars['Int']['output'];
  /** The dynamic quorum coefficient */
  quorumCoefficient: Scalars['BigInt']['output'];
};

export type DynamicQuorumParamsFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DynamicQuorumParamsFilter>>>;
  dynamicQuorumStartBlock?: InputMaybe<Scalars['BigInt']['input']>;
  dynamicQuorumStartBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dynamicQuorumStartBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dynamicQuorumStartBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dynamicQuorumStartBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dynamicQuorumStartBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dynamicQuorumStartBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  dynamicQuorumStartBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  maxQuorumVotesBPS?: InputMaybe<Scalars['Int']['input']>;
  maxQuorumVotesBPS_gt?: InputMaybe<Scalars['Int']['input']>;
  maxQuorumVotesBPS_gte?: InputMaybe<Scalars['Int']['input']>;
  maxQuorumVotesBPS_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  maxQuorumVotesBPS_lt?: InputMaybe<Scalars['Int']['input']>;
  maxQuorumVotesBPS_lte?: InputMaybe<Scalars['Int']['input']>;
  maxQuorumVotesBPS_not?: InputMaybe<Scalars['Int']['input']>;
  maxQuorumVotesBPS_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  minQuorumVotesBPS?: InputMaybe<Scalars['Int']['input']>;
  minQuorumVotesBPS_gt?: InputMaybe<Scalars['Int']['input']>;
  minQuorumVotesBPS_gte?: InputMaybe<Scalars['Int']['input']>;
  minQuorumVotesBPS_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  minQuorumVotesBPS_lt?: InputMaybe<Scalars['Int']['input']>;
  minQuorumVotesBPS_lte?: InputMaybe<Scalars['Int']['input']>;
  minQuorumVotesBPS_not?: InputMaybe<Scalars['Int']['input']>;
  minQuorumVotesBPS_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<DynamicQuorumParamsFilter>>>;
  quorumCoefficient?: InputMaybe<Scalars['BigInt']['input']>;
  quorumCoefficient_gt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumCoefficient_gte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumCoefficient_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  quorumCoefficient_lt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumCoefficient_lte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumCoefficient_not?: InputMaybe<Scalars['BigInt']['input']>;
  quorumCoefficient_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum DynamicQuorumParamsOrderBy {
  DynamicQuorumStartBlock = 'dynamicQuorumStartBlock',
  Id = 'id',
  MaxQuorumVotesBps = 'maxQuorumVotesBPS',
  MinQuorumVotesBps = 'minQuorumVotesBPS',
  QuorumCoefficient = 'quorumCoefficient'
}

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

export type EscrowDepositFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<EscrowDepositFilter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fork?: InputMaybe<Scalars['String']['input']>;
  fork_?: InputMaybe<ForkFilter>;
  fork_contains?: InputMaybe<Scalars['String']['input']>;
  fork_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_ends_with?: InputMaybe<Scalars['String']['input']>;
  fork_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_gt?: InputMaybe<Scalars['String']['input']>;
  fork_gte?: InputMaybe<Scalars['String']['input']>;
  fork_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fork_lt?: InputMaybe<Scalars['String']['input']>;
  fork_lte?: InputMaybe<Scalars['String']['input']>;
  fork_not?: InputMaybe<Scalars['String']['input']>;
  fork_not_contains?: InputMaybe<Scalars['String']['input']>;
  fork_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fork_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fork_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fork_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_starts_with?: InputMaybe<Scalars['String']['input']>;
  fork_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<EscrowDepositFilter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<DelegateFilter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposalIDs?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalIDs_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalIDs_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalIDs_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalIDs_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalIDs_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reason?: InputMaybe<Scalars['String']['input']>;
  reason_contains?: InputMaybe<Scalars['String']['input']>;
  reason_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_gt?: InputMaybe<Scalars['String']['input']>;
  reason_gte?: InputMaybe<Scalars['String']['input']>;
  reason_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_lt?: InputMaybe<Scalars['String']['input']>;
  reason_lte?: InputMaybe<Scalars['String']['input']>;
  reason_not?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenIDs?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum EscrowDepositOrderBy {
  CreatedAt = 'createdAt',
  Fork = 'fork',
  ForkExecuted = 'fork__executed',
  ForkExecutedAt = 'fork__executedAt',
  ForkForkId = 'fork__forkID',
  ForkForkToken = 'fork__forkToken',
  ForkForkTreasury = 'fork__forkTreasury',
  ForkForkingPeriodEndTimestamp = 'fork__forkingPeriodEndTimestamp',
  ForkId = 'fork__id',
  ForkTokensForkingCount = 'fork__tokensForkingCount',
  ForkTokensInEscrowCount = 'fork__tokensInEscrowCount',
  Id = 'id',
  Owner = 'owner',
  OwnerDelegatedVotes = 'owner__delegatedVotes',
  OwnerDelegatedVotesRaw = 'owner__delegatedVotesRaw',
  OwnerId = 'owner__id',
  OwnerTokenHoldersRepresentedAmount = 'owner__tokenHoldersRepresentedAmount',
  ProposalIDs = 'proposalIDs',
  Reason = 'reason',
  TokenIDs = 'tokenIDs'
}

export type EscrowWithdrawal = {
  __typename?: 'EscrowWithdrawal';
  createdAt: Scalars['BigInt']['output'];
  fork: Fork;
  id: Scalars['ID']['output'];
  owner: Delegate;
  tokenIDs: Array<Scalars['BigInt']['output']>;
};

export type EscrowWithdrawalFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<EscrowWithdrawalFilter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fork?: InputMaybe<Scalars['String']['input']>;
  fork_?: InputMaybe<ForkFilter>;
  fork_contains?: InputMaybe<Scalars['String']['input']>;
  fork_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_ends_with?: InputMaybe<Scalars['String']['input']>;
  fork_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_gt?: InputMaybe<Scalars['String']['input']>;
  fork_gte?: InputMaybe<Scalars['String']['input']>;
  fork_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fork_lt?: InputMaybe<Scalars['String']['input']>;
  fork_lte?: InputMaybe<Scalars['String']['input']>;
  fork_not?: InputMaybe<Scalars['String']['input']>;
  fork_not_contains?: InputMaybe<Scalars['String']['input']>;
  fork_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fork_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fork_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fork_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_starts_with?: InputMaybe<Scalars['String']['input']>;
  fork_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<EscrowWithdrawalFilter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<DelegateFilter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenIDs?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum EscrowWithdrawalOrderBy {
  CreatedAt = 'createdAt',
  Fork = 'fork',
  ForkExecuted = 'fork__executed',
  ForkExecutedAt = 'fork__executedAt',
  ForkForkId = 'fork__forkID',
  ForkForkToken = 'fork__forkToken',
  ForkForkTreasury = 'fork__forkTreasury',
  ForkForkingPeriodEndTimestamp = 'fork__forkingPeriodEndTimestamp',
  ForkId = 'fork__id',
  ForkTokensForkingCount = 'fork__tokensForkingCount',
  ForkTokensInEscrowCount = 'fork__tokensInEscrowCount',
  Id = 'id',
  Owner = 'owner',
  OwnerDelegatedVotes = 'owner__delegatedVotes',
  OwnerDelegatedVotesRaw = 'owner__delegatedVotesRaw',
  OwnerId = 'owner__id',
  OwnerTokenHoldersRepresentedAmount = 'owner__tokenHoldersRepresentedAmount',
  TokenIDs = 'tokenIDs'
}

export type EscrowedNoun = {
  __typename?: 'EscrowedNoun';
  escrowDeposit: EscrowDeposit;
  fork: Fork;
  id: Scalars['ID']['output'];
  noun: Noun;
  owner: Delegate;
};

export type EscrowedNounFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<EscrowedNounFilter>>>;
  escrowDeposit?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_?: InputMaybe<EscrowDepositFilter>;
  escrowDeposit_contains?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_ends_with?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_gt?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_gte?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_in?: InputMaybe<Array<Scalars['String']['input']>>;
  escrowDeposit_lt?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_lte?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_not?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_not_contains?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  escrowDeposit_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_starts_with?: InputMaybe<Scalars['String']['input']>;
  escrowDeposit_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork?: InputMaybe<Scalars['String']['input']>;
  fork_?: InputMaybe<ForkFilter>;
  fork_contains?: InputMaybe<Scalars['String']['input']>;
  fork_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_ends_with?: InputMaybe<Scalars['String']['input']>;
  fork_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_gt?: InputMaybe<Scalars['String']['input']>;
  fork_gte?: InputMaybe<Scalars['String']['input']>;
  fork_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fork_lt?: InputMaybe<Scalars['String']['input']>;
  fork_lte?: InputMaybe<Scalars['String']['input']>;
  fork_not?: InputMaybe<Scalars['String']['input']>;
  fork_not_contains?: InputMaybe<Scalars['String']['input']>;
  fork_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fork_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fork_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fork_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_starts_with?: InputMaybe<Scalars['String']['input']>;
  fork_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  noun?: InputMaybe<Scalars['String']['input']>;
  noun_?: InputMaybe<NounFilter>;
  noun_contains?: InputMaybe<Scalars['String']['input']>;
  noun_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_ends_with?: InputMaybe<Scalars['String']['input']>;
  noun_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_gt?: InputMaybe<Scalars['String']['input']>;
  noun_gte?: InputMaybe<Scalars['String']['input']>;
  noun_in?: InputMaybe<Array<Scalars['String']['input']>>;
  noun_lt?: InputMaybe<Scalars['String']['input']>;
  noun_lte?: InputMaybe<Scalars['String']['input']>;
  noun_not?: InputMaybe<Scalars['String']['input']>;
  noun_not_contains?: InputMaybe<Scalars['String']['input']>;
  noun_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  noun_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  noun_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  noun_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_starts_with?: InputMaybe<Scalars['String']['input']>;
  noun_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<EscrowedNounFilter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<DelegateFilter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum EscrowedNounOrderBy {
  EscrowDeposit = 'escrowDeposit',
  EscrowDepositCreatedAt = 'escrowDeposit__createdAt',
  EscrowDepositId = 'escrowDeposit__id',
  EscrowDepositReason = 'escrowDeposit__reason',
  Fork = 'fork',
  ForkExecuted = 'fork__executed',
  ForkExecutedAt = 'fork__executedAt',
  ForkForkId = 'fork__forkID',
  ForkForkToken = 'fork__forkToken',
  ForkForkTreasury = 'fork__forkTreasury',
  ForkForkingPeriodEndTimestamp = 'fork__forkingPeriodEndTimestamp',
  ForkId = 'fork__id',
  ForkTokensForkingCount = 'fork__tokensForkingCount',
  ForkTokensInEscrowCount = 'fork__tokensInEscrowCount',
  Id = 'id',
  Noun = 'noun',
  NounId = 'noun__id',
  Owner = 'owner',
  OwnerDelegatedVotes = 'owner__delegatedVotes',
  OwnerDelegatedVotesRaw = 'owner__delegatedVotesRaw',
  OwnerId = 'owner__id',
  OwnerTokenHoldersRepresentedAmount = 'owner__tokenHoldersRepresentedAmount'
}

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


export type ForkEscrowDepositsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<EscrowDepositOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<EscrowDepositFilter>;
};


export type ForkEscrowWithdrawalsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<EscrowWithdrawalOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<EscrowWithdrawalFilter>;
};


export type ForkEscrowedNounsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<EscrowedNounOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<EscrowedNounFilter>;
};


export type ForkJoinedNounsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ForkJoinedNounOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ForkJoinedNounFilter>;
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

export type ForkJoinFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ForkJoinFilter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fork?: InputMaybe<Scalars['String']['input']>;
  fork_?: InputMaybe<ForkFilter>;
  fork_contains?: InputMaybe<Scalars['String']['input']>;
  fork_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_ends_with?: InputMaybe<Scalars['String']['input']>;
  fork_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_gt?: InputMaybe<Scalars['String']['input']>;
  fork_gte?: InputMaybe<Scalars['String']['input']>;
  fork_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fork_lt?: InputMaybe<Scalars['String']['input']>;
  fork_lte?: InputMaybe<Scalars['String']['input']>;
  fork_not?: InputMaybe<Scalars['String']['input']>;
  fork_not_contains?: InputMaybe<Scalars['String']['input']>;
  fork_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fork_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fork_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fork_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_starts_with?: InputMaybe<Scalars['String']['input']>;
  fork_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ForkJoinFilter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<DelegateFilter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposalIDs?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalIDs_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalIDs_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalIDs_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalIDs_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalIDs_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  reason?: InputMaybe<Scalars['String']['input']>;
  reason_contains?: InputMaybe<Scalars['String']['input']>;
  reason_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_gt?: InputMaybe<Scalars['String']['input']>;
  reason_gte?: InputMaybe<Scalars['String']['input']>;
  reason_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_lt?: InputMaybe<Scalars['String']['input']>;
  reason_lte?: InputMaybe<Scalars['String']['input']>;
  reason_not?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenIDs?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenIDs_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum ForkJoinOrderBy {
  CreatedAt = 'createdAt',
  Fork = 'fork',
  ForkExecuted = 'fork__executed',
  ForkExecutedAt = 'fork__executedAt',
  ForkForkId = 'fork__forkID',
  ForkForkToken = 'fork__forkToken',
  ForkForkTreasury = 'fork__forkTreasury',
  ForkForkingPeriodEndTimestamp = 'fork__forkingPeriodEndTimestamp',
  ForkId = 'fork__id',
  ForkTokensForkingCount = 'fork__tokensForkingCount',
  ForkTokensInEscrowCount = 'fork__tokensInEscrowCount',
  Id = 'id',
  Owner = 'owner',
  OwnerDelegatedVotes = 'owner__delegatedVotes',
  OwnerDelegatedVotesRaw = 'owner__delegatedVotesRaw',
  OwnerId = 'owner__id',
  OwnerTokenHoldersRepresentedAmount = 'owner__tokenHoldersRepresentedAmount',
  ProposalIDs = 'proposalIDs',
  Reason = 'reason',
  TokenIDs = 'tokenIDs'
}

export type ForkJoinedNoun = {
  __typename?: 'ForkJoinedNoun';
  fork: Fork;
  forkJoin: ForkJoin;
  id: Scalars['ID']['output'];
  noun: Noun;
  owner: Delegate;
};

export type ForkJoinedNounFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ForkJoinedNounFilter>>>;
  fork?: InputMaybe<Scalars['String']['input']>;
  forkJoin?: InputMaybe<Scalars['String']['input']>;
  forkJoin_?: InputMaybe<ForkJoinFilter>;
  forkJoin_contains?: InputMaybe<Scalars['String']['input']>;
  forkJoin_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  forkJoin_ends_with?: InputMaybe<Scalars['String']['input']>;
  forkJoin_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  forkJoin_gt?: InputMaybe<Scalars['String']['input']>;
  forkJoin_gte?: InputMaybe<Scalars['String']['input']>;
  forkJoin_in?: InputMaybe<Array<Scalars['String']['input']>>;
  forkJoin_lt?: InputMaybe<Scalars['String']['input']>;
  forkJoin_lte?: InputMaybe<Scalars['String']['input']>;
  forkJoin_not?: InputMaybe<Scalars['String']['input']>;
  forkJoin_not_contains?: InputMaybe<Scalars['String']['input']>;
  forkJoin_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  forkJoin_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  forkJoin_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  forkJoin_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  forkJoin_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  forkJoin_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  forkJoin_starts_with?: InputMaybe<Scalars['String']['input']>;
  forkJoin_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_?: InputMaybe<ForkFilter>;
  fork_contains?: InputMaybe<Scalars['String']['input']>;
  fork_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_ends_with?: InputMaybe<Scalars['String']['input']>;
  fork_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_gt?: InputMaybe<Scalars['String']['input']>;
  fork_gte?: InputMaybe<Scalars['String']['input']>;
  fork_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fork_lt?: InputMaybe<Scalars['String']['input']>;
  fork_lte?: InputMaybe<Scalars['String']['input']>;
  fork_not?: InputMaybe<Scalars['String']['input']>;
  fork_not_contains?: InputMaybe<Scalars['String']['input']>;
  fork_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fork_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fork_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fork_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fork_starts_with?: InputMaybe<Scalars['String']['input']>;
  fork_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  noun?: InputMaybe<Scalars['String']['input']>;
  noun_?: InputMaybe<NounFilter>;
  noun_contains?: InputMaybe<Scalars['String']['input']>;
  noun_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_ends_with?: InputMaybe<Scalars['String']['input']>;
  noun_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_gt?: InputMaybe<Scalars['String']['input']>;
  noun_gte?: InputMaybe<Scalars['String']['input']>;
  noun_in?: InputMaybe<Array<Scalars['String']['input']>>;
  noun_lt?: InputMaybe<Scalars['String']['input']>;
  noun_lte?: InputMaybe<Scalars['String']['input']>;
  noun_not?: InputMaybe<Scalars['String']['input']>;
  noun_not_contains?: InputMaybe<Scalars['String']['input']>;
  noun_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  noun_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  noun_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  noun_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_starts_with?: InputMaybe<Scalars['String']['input']>;
  noun_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<ForkJoinedNounFilter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<DelegateFilter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum ForkJoinedNounOrderBy {
  Fork = 'fork',
  ForkJoin = 'forkJoin',
  ForkJoinCreatedAt = 'forkJoin__createdAt',
  ForkJoinId = 'forkJoin__id',
  ForkJoinReason = 'forkJoin__reason',
  ForkExecuted = 'fork__executed',
  ForkExecutedAt = 'fork__executedAt',
  ForkForkId = 'fork__forkID',
  ForkForkToken = 'fork__forkToken',
  ForkForkTreasury = 'fork__forkTreasury',
  ForkForkingPeriodEndTimestamp = 'fork__forkingPeriodEndTimestamp',
  ForkId = 'fork__id',
  ForkTokensForkingCount = 'fork__tokensForkingCount',
  ForkTokensInEscrowCount = 'fork__tokensInEscrowCount',
  Id = 'id',
  Noun = 'noun',
  NounId = 'noun__id',
  Owner = 'owner',
  OwnerDelegatedVotes = 'owner__delegatedVotes',
  OwnerDelegatedVotesRaw = 'owner__delegatedVotesRaw',
  OwnerId = 'owner__id',
  OwnerTokenHoldersRepresentedAmount = 'owner__tokenHoldersRepresentedAmount'
}

export type ForkFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ForkFilter>>>;
  escrowDeposits_?: InputMaybe<EscrowDepositFilter>;
  escrowWithdrawals_?: InputMaybe<EscrowWithdrawalFilter>;
  escrowedNouns_?: InputMaybe<EscrowedNounFilter>;
  executed?: InputMaybe<Scalars['Boolean']['input']>;
  executedAt?: InputMaybe<Scalars['BigInt']['input']>;
  executedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  executedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  executedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  executedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  executedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  executedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executed_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  executed_not?: InputMaybe<Scalars['Boolean']['input']>;
  executed_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  forkID?: InputMaybe<Scalars['BigInt']['input']>;
  forkID_gt?: InputMaybe<Scalars['BigInt']['input']>;
  forkID_gte?: InputMaybe<Scalars['BigInt']['input']>;
  forkID_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  forkID_lt?: InputMaybe<Scalars['BigInt']['input']>;
  forkID_lte?: InputMaybe<Scalars['BigInt']['input']>;
  forkID_not?: InputMaybe<Scalars['BigInt']['input']>;
  forkID_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  forkToken?: InputMaybe<Scalars['Bytes']['input']>;
  forkToken_contains?: InputMaybe<Scalars['Bytes']['input']>;
  forkToken_gt?: InputMaybe<Scalars['Bytes']['input']>;
  forkToken_gte?: InputMaybe<Scalars['Bytes']['input']>;
  forkToken_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  forkToken_lt?: InputMaybe<Scalars['Bytes']['input']>;
  forkToken_lte?: InputMaybe<Scalars['Bytes']['input']>;
  forkToken_not?: InputMaybe<Scalars['Bytes']['input']>;
  forkToken_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  forkToken_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  forkTreasury?: InputMaybe<Scalars['Bytes']['input']>;
  forkTreasury_contains?: InputMaybe<Scalars['Bytes']['input']>;
  forkTreasury_gt?: InputMaybe<Scalars['Bytes']['input']>;
  forkTreasury_gte?: InputMaybe<Scalars['Bytes']['input']>;
  forkTreasury_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  forkTreasury_lt?: InputMaybe<Scalars['Bytes']['input']>;
  forkTreasury_lte?: InputMaybe<Scalars['Bytes']['input']>;
  forkTreasury_not?: InputMaybe<Scalars['Bytes']['input']>;
  forkTreasury_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  forkTreasury_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  forkingPeriodEndTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  forkingPeriodEndTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  forkingPeriodEndTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  forkingPeriodEndTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  forkingPeriodEndTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  forkingPeriodEndTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  forkingPeriodEndTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  forkingPeriodEndTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  joinedNouns_?: InputMaybe<ForkJoinedNounFilter>;
  or?: InputMaybe<Array<InputMaybe<ForkFilter>>>;
  tokensForkingCount?: InputMaybe<Scalars['Int']['input']>;
  tokensForkingCount_gt?: InputMaybe<Scalars['Int']['input']>;
  tokensForkingCount_gte?: InputMaybe<Scalars['Int']['input']>;
  tokensForkingCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokensForkingCount_lt?: InputMaybe<Scalars['Int']['input']>;
  tokensForkingCount_lte?: InputMaybe<Scalars['Int']['input']>;
  tokensForkingCount_not?: InputMaybe<Scalars['Int']['input']>;
  tokensForkingCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokensInEscrowCount?: InputMaybe<Scalars['Int']['input']>;
  tokensInEscrowCount_gt?: InputMaybe<Scalars['Int']['input']>;
  tokensInEscrowCount_gte?: InputMaybe<Scalars['Int']['input']>;
  tokensInEscrowCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokensInEscrowCount_lt?: InputMaybe<Scalars['Int']['input']>;
  tokensInEscrowCount_lte?: InputMaybe<Scalars['Int']['input']>;
  tokensInEscrowCount_not?: InputMaybe<Scalars['Int']['input']>;
  tokensInEscrowCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum ForkOrderBy {
  EscrowDeposits = 'escrowDeposits',
  EscrowWithdrawals = 'escrowWithdrawals',
  EscrowedNouns = 'escrowedNouns',
  Executed = 'executed',
  ExecutedAt = 'executedAt',
  ForkId = 'forkID',
  ForkToken = 'forkToken',
  ForkTreasury = 'forkTreasury',
  ForkingPeriodEndTimestamp = 'forkingPeriodEndTimestamp',
  Id = 'id',
  JoinedNouns = 'joinedNouns',
  TokensForkingCount = 'tokensForkingCount',
  TokensInEscrowCount = 'tokensInEscrowCount'
}

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

export type GovernanceFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GovernanceFilter>>>;
  candidates?: InputMaybe<Scalars['BigInt']['input']>;
  candidates_gt?: InputMaybe<Scalars['BigInt']['input']>;
  candidates_gte?: InputMaybe<Scalars['BigInt']['input']>;
  candidates_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  candidates_lt?: InputMaybe<Scalars['BigInt']['input']>;
  candidates_lte?: InputMaybe<Scalars['BigInt']['input']>;
  candidates_not?: InputMaybe<Scalars['BigInt']['input']>;
  candidates_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentDelegates?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentDelegates_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentDelegates_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentTokenHolders?: InputMaybe<Scalars['BigInt']['input']>;
  currentTokenHolders_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentTokenHolders_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentTokenHolders_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentTokenHolders_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentTokenHolders_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentTokenHolders_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentTokenHolders_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatedVotes?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatedVotesRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotesRaw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatedVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegatedVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  delegatedVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GovernanceFilter>>>;
  proposals?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsQueued?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsQueued_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsQueued_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsQueued_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalsQueued_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsQueued_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsQueued_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposalsQueued_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposals_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDelegates?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDelegates_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDelegates_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalTokenHolders?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenHolders_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenHolders_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenHolders_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalTokenHolders_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenHolders_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenHolders_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalTokenHolders_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  voteSnapshotBlockSwitchProposalId?: InputMaybe<Scalars['BigInt']['input']>;
  voteSnapshotBlockSwitchProposalId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  voteSnapshotBlockSwitchProposalId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  voteSnapshotBlockSwitchProposalId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  voteSnapshotBlockSwitchProposalId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  voteSnapshotBlockSwitchProposalId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  voteSnapshotBlockSwitchProposalId_not?: InputMaybe<Scalars['BigInt']['input']>;
  voteSnapshotBlockSwitchProposalId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum GovernanceOrderBy {
  Candidates = 'candidates',
  CurrentDelegates = 'currentDelegates',
  CurrentTokenHolders = 'currentTokenHolders',
  DelegatedVotes = 'delegatedVotes',
  DelegatedVotesRaw = 'delegatedVotesRaw',
  Id = 'id',
  Proposals = 'proposals',
  ProposalsQueued = 'proposalsQueued',
  TotalDelegates = 'totalDelegates',
  TotalTokenHolders = 'totalTokenHolders',
  VoteSnapshotBlockSwitchProposalId = 'voteSnapshotBlockSwitchProposalId'
}

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


export type NounVotesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VoteOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VoteFilter>;
};

export type NounFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NounFilter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<NounFilter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_?: InputMaybe<AccountFilter>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  seed?: InputMaybe<Scalars['String']['input']>;
  seed_?: InputMaybe<SeedFilter>;
  seed_contains?: InputMaybe<Scalars['String']['input']>;
  seed_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  seed_ends_with?: InputMaybe<Scalars['String']['input']>;
  seed_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  seed_gt?: InputMaybe<Scalars['String']['input']>;
  seed_gte?: InputMaybe<Scalars['String']['input']>;
  seed_in?: InputMaybe<Array<Scalars['String']['input']>>;
  seed_lt?: InputMaybe<Scalars['String']['input']>;
  seed_lte?: InputMaybe<Scalars['String']['input']>;
  seed_not?: InputMaybe<Scalars['String']['input']>;
  seed_not_contains?: InputMaybe<Scalars['String']['input']>;
  seed_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  seed_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  seed_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  seed_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  seed_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  seed_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  seed_starts_with?: InputMaybe<Scalars['String']['input']>;
  seed_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  votes_?: InputMaybe<VoteFilter>;
};

export enum NounOrderBy {
  Id = 'id',
  Owner = 'owner',
  OwnerId = 'owner__id',
  OwnerTokenBalance = 'owner__tokenBalance',
  OwnerTokenBalanceRaw = 'owner__tokenBalanceRaw',
  OwnerTotalTokensHeld = 'owner__totalTokensHeld',
  OwnerTotalTokensHeldRaw = 'owner__totalTokensHeldRaw',
  Seed = 'seed',
  SeedAccessory = 'seed__accessory',
  SeedBackground = 'seed__background',
  SeedBody = 'seed__body',
  SeedGlasses = 'seed__glasses',
  SeedHead = 'seed__head',
  SeedId = 'seed__id',
  Votes = 'votes'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

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
  /** The block at which voting balance snapshots are taken for this proposal */
  voteSnapshotBlock: Scalars['BigInt']['output'];
  /** Votes associated to this proposal */
  votes: Array<Vote>;
};


export type ProposalFeedbackPostsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProposalFeedbackOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProposalFeedbackFilter>;
};


export type ProposalSignersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DelegateOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DelegateFilter>;
};


export type ProposalVotesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VoteOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VoteFilter>;
};

export type ProposalCandidate = {
  __typename?: 'ProposalCandidate';
  /** Whether this candidate was canceled or not */
  canceled: Scalars['Boolean']['output'];
  /** The block number at which this candidate was canceled */
  canceledBlock?: Maybe<Scalars['BigInt']['output']>;
  /** The timestamp at which this candidate was canceled */
  canceledTimestamp?: Maybe<Scalars['BigInt']['output']>;
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


export type ProposalCandidateVersionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProposalCandidateVersionOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProposalCandidateVersionFilter>;
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


export type ProposalCandidateContentContentSignaturesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProposalCandidateSignatureOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProposalCandidateSignatureFilter>;
};

export type ProposalCandidateContentFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProposalCandidateContentFilter>>>;
  calldatas?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  contentSignatures_?: InputMaybe<ProposalCandidateSignatureFilter>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  encodedProposalHash?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  encodedProposalHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  matchingProposalIds?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  matchingProposalIds_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  matchingProposalIds_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  matchingProposalIds_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  matchingProposalIds_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  matchingProposalIds_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProposalCandidateContentFilter>>>;
  proposalIdToUpdate?: InputMaybe<Scalars['BigInt']['input']>;
  proposalIdToUpdate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalIdToUpdate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalIdToUpdate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalIdToUpdate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalIdToUpdate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalIdToUpdate_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposalIdToUpdate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposer?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_gt?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_gte?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  proposer_lt?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_lte?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_not?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  signatures?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  targets?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_contains?: InputMaybe<Scalars['String']['input']>;
  title_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  title_ends_with?: InputMaybe<Scalars['String']['input']>;
  title_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  title_gt?: InputMaybe<Scalars['String']['input']>;
  title_gte?: InputMaybe<Scalars['String']['input']>;
  title_in?: InputMaybe<Array<Scalars['String']['input']>>;
  title_lt?: InputMaybe<Scalars['String']['input']>;
  title_lte?: InputMaybe<Scalars['String']['input']>;
  title_not?: InputMaybe<Scalars['String']['input']>;
  title_not_contains?: InputMaybe<Scalars['String']['input']>;
  title_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  title_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  title_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  title_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  title_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  title_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  title_starts_with?: InputMaybe<Scalars['String']['input']>;
  title_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum ProposalCandidateContentOrderBy {
  Calldatas = 'calldatas',
  ContentSignatures = 'contentSignatures',
  Description = 'description',
  EncodedProposalHash = 'encodedProposalHash',
  Id = 'id',
  MatchingProposalIds = 'matchingProposalIds',
  ProposalIdToUpdate = 'proposalIdToUpdate',
  Proposer = 'proposer',
  Signatures = 'signatures',
  Targets = 'targets',
  Title = 'title',
  Values = 'values'
}

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

export type ProposalCandidateSignatureFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProposalCandidateSignatureFilter>>>;
  canceled?: InputMaybe<Scalars['Boolean']['input']>;
  canceled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canceled_not?: InputMaybe<Scalars['Boolean']['input']>;
  canceled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  content?: InputMaybe<Scalars['String']['input']>;
  content_?: InputMaybe<ProposalCandidateContentFilter>;
  content_contains?: InputMaybe<Scalars['String']['input']>;
  content_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  content_ends_with?: InputMaybe<Scalars['String']['input']>;
  content_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  content_gt?: InputMaybe<Scalars['String']['input']>;
  content_gte?: InputMaybe<Scalars['String']['input']>;
  content_in?: InputMaybe<Array<Scalars['String']['input']>>;
  content_lt?: InputMaybe<Scalars['String']['input']>;
  content_lte?: InputMaybe<Scalars['String']['input']>;
  content_not?: InputMaybe<Scalars['String']['input']>;
  content_not_contains?: InputMaybe<Scalars['String']['input']>;
  content_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  content_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  content_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  content_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  content_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  content_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  content_starts_with?: InputMaybe<Scalars['String']['input']>;
  content_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdBlock?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  encodedProposalHash?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  encodedProposalHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  encodedProposalHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  expirationTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  expirationTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expirationTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expirationTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expirationTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expirationTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expirationTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  expirationTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProposalCandidateSignatureFilter>>>;
  reason?: InputMaybe<Scalars['String']['input']>;
  reason_contains?: InputMaybe<Scalars['String']['input']>;
  reason_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_gt?: InputMaybe<Scalars['String']['input']>;
  reason_gte?: InputMaybe<Scalars['String']['input']>;
  reason_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_lt?: InputMaybe<Scalars['String']['input']>;
  reason_lte?: InputMaybe<Scalars['String']['input']>;
  reason_not?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sig?: InputMaybe<Scalars['Bytes']['input']>;
  sigDigest?: InputMaybe<Scalars['Bytes']['input']>;
  sigDigest_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sigDigest_gt?: InputMaybe<Scalars['Bytes']['input']>;
  sigDigest_gte?: InputMaybe<Scalars['Bytes']['input']>;
  sigDigest_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sigDigest_lt?: InputMaybe<Scalars['Bytes']['input']>;
  sigDigest_lte?: InputMaybe<Scalars['Bytes']['input']>;
  sigDigest_not?: InputMaybe<Scalars['Bytes']['input']>;
  sigDigest_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sigDigest_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sig_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sig_gt?: InputMaybe<Scalars['Bytes']['input']>;
  sig_gte?: InputMaybe<Scalars['Bytes']['input']>;
  sig_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sig_lt?: InputMaybe<Scalars['Bytes']['input']>;
  sig_lte?: InputMaybe<Scalars['Bytes']['input']>;
  sig_not?: InputMaybe<Scalars['Bytes']['input']>;
  sig_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sig_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  signer?: InputMaybe<Scalars['String']['input']>;
  signer_?: InputMaybe<DelegateFilter>;
  signer_contains?: InputMaybe<Scalars['String']['input']>;
  signer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  signer_ends_with?: InputMaybe<Scalars['String']['input']>;
  signer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  signer_gt?: InputMaybe<Scalars['String']['input']>;
  signer_gte?: InputMaybe<Scalars['String']['input']>;
  signer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  signer_lt?: InputMaybe<Scalars['String']['input']>;
  signer_lte?: InputMaybe<Scalars['String']['input']>;
  signer_not?: InputMaybe<Scalars['String']['input']>;
  signer_not_contains?: InputMaybe<Scalars['String']['input']>;
  signer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  signer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  signer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  signer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  signer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  signer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  signer_starts_with?: InputMaybe<Scalars['String']['input']>;
  signer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum ProposalCandidateSignatureOrderBy {
  Canceled = 'canceled',
  Content = 'content',
  ContentDescription = 'content__description',
  ContentEncodedProposalHash = 'content__encodedProposalHash',
  ContentId = 'content__id',
  ContentProposalIdToUpdate = 'content__proposalIdToUpdate',
  ContentProposer = 'content__proposer',
  ContentTitle = 'content__title',
  CreatedBlock = 'createdBlock',
  CreatedTimestamp = 'createdTimestamp',
  EncodedProposalHash = 'encodedProposalHash',
  ExpirationTimestamp = 'expirationTimestamp',
  Id = 'id',
  Reason = 'reason',
  Sig = 'sig',
  SigDigest = 'sigDigest',
  Signer = 'signer',
  SignerDelegatedVotes = 'signer__delegatedVotes',
  SignerDelegatedVotesRaw = 'signer__delegatedVotesRaw',
  SignerId = 'signer__id',
  SignerTokenHoldersRepresentedAmount = 'signer__tokenHoldersRepresentedAmount'
}

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

export type ProposalCandidateVersionFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProposalCandidateVersionFilter>>>;
  content?: InputMaybe<Scalars['String']['input']>;
  content_?: InputMaybe<ProposalCandidateContentFilter>;
  content_contains?: InputMaybe<Scalars['String']['input']>;
  content_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  content_ends_with?: InputMaybe<Scalars['String']['input']>;
  content_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  content_gt?: InputMaybe<Scalars['String']['input']>;
  content_gte?: InputMaybe<Scalars['String']['input']>;
  content_in?: InputMaybe<Array<Scalars['String']['input']>>;
  content_lt?: InputMaybe<Scalars['String']['input']>;
  content_lte?: InputMaybe<Scalars['String']['input']>;
  content_not?: InputMaybe<Scalars['String']['input']>;
  content_not_contains?: InputMaybe<Scalars['String']['input']>;
  content_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  content_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  content_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  content_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  content_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  content_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  content_starts_with?: InputMaybe<Scalars['String']['input']>;
  content_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdBlock?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProposalCandidateVersionFilter>>>;
  proposal?: InputMaybe<Scalars['String']['input']>;
  proposal_?: InputMaybe<ProposalCandidateFilter>;
  proposal_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_gt?: InputMaybe<Scalars['String']['input']>;
  proposal_gte?: InputMaybe<Scalars['String']['input']>;
  proposal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_lt?: InputMaybe<Scalars['String']['input']>;
  proposal_lte?: InputMaybe<Scalars['String']['input']>;
  proposal_not?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updateMessage?: InputMaybe<Scalars['String']['input']>;
  updateMessage_contains?: InputMaybe<Scalars['String']['input']>;
  updateMessage_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  updateMessage_ends_with?: InputMaybe<Scalars['String']['input']>;
  updateMessage_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updateMessage_gt?: InputMaybe<Scalars['String']['input']>;
  updateMessage_gte?: InputMaybe<Scalars['String']['input']>;
  updateMessage_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updateMessage_lt?: InputMaybe<Scalars['String']['input']>;
  updateMessage_lte?: InputMaybe<Scalars['String']['input']>;
  updateMessage_not?: InputMaybe<Scalars['String']['input']>;
  updateMessage_not_contains?: InputMaybe<Scalars['String']['input']>;
  updateMessage_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  updateMessage_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updateMessage_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updateMessage_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updateMessage_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updateMessage_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updateMessage_starts_with?: InputMaybe<Scalars['String']['input']>;
  updateMessage_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum ProposalCandidateVersionOrderBy {
  Content = 'content',
  ContentDescription = 'content__description',
  ContentEncodedProposalHash = 'content__encodedProposalHash',
  ContentId = 'content__id',
  ContentProposalIdToUpdate = 'content__proposalIdToUpdate',
  ContentProposer = 'content__proposer',
  ContentTitle = 'content__title',
  CreatedBlock = 'createdBlock',
  CreatedTimestamp = 'createdTimestamp',
  Id = 'id',
  Proposal = 'proposal',
  ProposalCanceled = 'proposal__canceled',
  ProposalCanceledBlock = 'proposal__canceledBlock',
  ProposalCanceledTimestamp = 'proposal__canceledTimestamp',
  ProposalCreatedBlock = 'proposal__createdBlock',
  ProposalCreatedTimestamp = 'proposal__createdTimestamp',
  ProposalCreatedTransactionHash = 'proposal__createdTransactionHash',
  ProposalId = 'proposal__id',
  ProposalLastUpdatedBlock = 'proposal__lastUpdatedBlock',
  ProposalLastUpdatedTimestamp = 'proposal__lastUpdatedTimestamp',
  ProposalNumber = 'proposal__number',
  ProposalProposer = 'proposal__proposer',
  ProposalSlug = 'proposal__slug',
  UpdateMessage = 'updateMessage'
}

export type ProposalCandidateFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProposalCandidateFilter>>>;
  canceled?: InputMaybe<Scalars['Boolean']['input']>;
  canceledBlock?: InputMaybe<Scalars['BigInt']['input']>;
  canceledBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  canceledBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  canceledBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  canceledBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  canceledBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  canceledBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  canceledBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  canceledTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  canceledTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  canceledTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  canceledTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  canceledTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  canceledTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  canceledTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  canceledTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  canceled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  canceled_not?: InputMaybe<Scalars['Boolean']['input']>;
  canceled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  createdBlock?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTransactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  createdTransactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastUpdatedBlock?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdatedBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdatedTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdatedTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestVersion?: InputMaybe<Scalars['String']['input']>;
  latestVersion_?: InputMaybe<ProposalCandidateVersionFilter>;
  latestVersion_contains?: InputMaybe<Scalars['String']['input']>;
  latestVersion_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  latestVersion_ends_with?: InputMaybe<Scalars['String']['input']>;
  latestVersion_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latestVersion_gt?: InputMaybe<Scalars['String']['input']>;
  latestVersion_gte?: InputMaybe<Scalars['String']['input']>;
  latestVersion_in?: InputMaybe<Array<Scalars['String']['input']>>;
  latestVersion_lt?: InputMaybe<Scalars['String']['input']>;
  latestVersion_lte?: InputMaybe<Scalars['String']['input']>;
  latestVersion_not?: InputMaybe<Scalars['String']['input']>;
  latestVersion_not_contains?: InputMaybe<Scalars['String']['input']>;
  latestVersion_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  latestVersion_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  latestVersion_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latestVersion_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  latestVersion_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  latestVersion_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latestVersion_starts_with?: InputMaybe<Scalars['String']['input']>;
  latestVersion_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['BigInt']['input']>;
  number_gt?: InputMaybe<Scalars['BigInt']['input']>;
  number_gte?: InputMaybe<Scalars['BigInt']['input']>;
  number_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  number_lt?: InputMaybe<Scalars['BigInt']['input']>;
  number_lte?: InputMaybe<Scalars['BigInt']['input']>;
  number_not?: InputMaybe<Scalars['BigInt']['input']>;
  number_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProposalCandidateFilter>>>;
  proposer?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_gt?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_gte?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  proposer_lt?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_lte?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_not?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  proposer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  slug_contains?: InputMaybe<Scalars['String']['input']>;
  slug_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_ends_with?: InputMaybe<Scalars['String']['input']>;
  slug_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_gt?: InputMaybe<Scalars['String']['input']>;
  slug_gte?: InputMaybe<Scalars['String']['input']>;
  slug_in?: InputMaybe<Array<Scalars['String']['input']>>;
  slug_lt?: InputMaybe<Scalars['String']['input']>;
  slug_lte?: InputMaybe<Scalars['String']['input']>;
  slug_not?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains?: InputMaybe<Scalars['String']['input']>;
  slug_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  slug_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  slug_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  slug_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  slug_starts_with?: InputMaybe<Scalars['String']['input']>;
  slug_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  versions_?: InputMaybe<ProposalCandidateVersionFilter>;
};

export enum ProposalCandidateOrderBy {
  Canceled = 'canceled',
  CanceledBlock = 'canceledBlock',
  CanceledTimestamp = 'canceledTimestamp',
  CreatedBlock = 'createdBlock',
  CreatedTimestamp = 'createdTimestamp',
  CreatedTransactionHash = 'createdTransactionHash',
  Id = 'id',
  LastUpdatedBlock = 'lastUpdatedBlock',
  LastUpdatedTimestamp = 'lastUpdatedTimestamp',
  LatestVersion = 'latestVersion',
  LatestVersionCreatedBlock = 'latestVersion__createdBlock',
  LatestVersionCreatedTimestamp = 'latestVersion__createdTimestamp',
  LatestVersionId = 'latestVersion__id',
  LatestVersionUpdateMessage = 'latestVersion__updateMessage',
  Number = 'number',
  Proposer = 'proposer',
  Slug = 'slug',
  Versions = 'versions'
}

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

export type ProposalFeedbackFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProposalFeedbackFilter>>>;
  createdBlock?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProposalFeedbackFilter>>>;
  proposal?: InputMaybe<Scalars['String']['input']>;
  proposal_?: InputMaybe<ProposalFilter>;
  proposal_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_gt?: InputMaybe<Scalars['String']['input']>;
  proposal_gte?: InputMaybe<Scalars['String']['input']>;
  proposal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_lt?: InputMaybe<Scalars['String']['input']>;
  proposal_lte?: InputMaybe<Scalars['String']['input']>;
  proposal_not?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  reason_contains?: InputMaybe<Scalars['String']['input']>;
  reason_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_gt?: InputMaybe<Scalars['String']['input']>;
  reason_gte?: InputMaybe<Scalars['String']['input']>;
  reason_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_lt?: InputMaybe<Scalars['String']['input']>;
  reason_lte?: InputMaybe<Scalars['String']['input']>;
  reason_not?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  supportDetailed?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_gt?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_gte?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  supportDetailed_lt?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_lte?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_not?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  voter?: InputMaybe<Scalars['String']['input']>;
  voter_?: InputMaybe<DelegateFilter>;
  voter_contains?: InputMaybe<Scalars['String']['input']>;
  voter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_ends_with?: InputMaybe<Scalars['String']['input']>;
  voter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_gt?: InputMaybe<Scalars['String']['input']>;
  voter_gte?: InputMaybe<Scalars['String']['input']>;
  voter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voter_lt?: InputMaybe<Scalars['String']['input']>;
  voter_lte?: InputMaybe<Scalars['String']['input']>;
  voter_not?: InputMaybe<Scalars['String']['input']>;
  voter_not_contains?: InputMaybe<Scalars['String']['input']>;
  voter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  voter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  voter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_starts_with?: InputMaybe<Scalars['String']['input']>;
  voter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  votes?: InputMaybe<Scalars['BigInt']['input']>;
  votes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  votes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  votes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  votes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  votes_not?: InputMaybe<Scalars['BigInt']['input']>;
  votes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum ProposalFeedbackOrderBy {
  CreatedBlock = 'createdBlock',
  CreatedTimestamp = 'createdTimestamp',
  Id = 'id',
  Proposal = 'proposal',
  ProposalAbstainVotes = 'proposal__abstainVotes',
  ProposalAdjustedTotalSupply = 'proposal__adjustedTotalSupply',
  ProposalAgainstVotes = 'proposal__againstVotes',
  ProposalCanceledBlock = 'proposal__canceledBlock',
  ProposalCanceledTimestamp = 'proposal__canceledTimestamp',
  ProposalClientId = 'proposal__clientId',
  ProposalCreatedBlock = 'proposal__createdBlock',
  ProposalCreatedTimestamp = 'proposal__createdTimestamp',
  ProposalCreatedTransactionHash = 'proposal__createdTransactionHash',
  ProposalDescription = 'proposal__description',
  ProposalEndBlock = 'proposal__endBlock',
  ProposalExecutedBlock = 'proposal__executedBlock',
  ProposalExecutedTimestamp = 'proposal__executedTimestamp',
  ProposalExecutionEta = 'proposal__executionETA',
  ProposalForVotes = 'proposal__forVotes',
  ProposalId = 'proposal__id',
  ProposalLastUpdatedBlock = 'proposal__lastUpdatedBlock',
  ProposalLastUpdatedTimestamp = 'proposal__lastUpdatedTimestamp',
  ProposalMaxQuorumVotesBps = 'proposal__maxQuorumVotesBPS',
  ProposalMinQuorumVotesBps = 'proposal__minQuorumVotesBPS',
  ProposalObjectionPeriodEndBlock = 'proposal__objectionPeriodEndBlock',
  ProposalOnTimelockV1 = 'proposal__onTimelockV1',
  ProposalProposalThreshold = 'proposal__proposalThreshold',
  ProposalQueuedBlock = 'proposal__queuedBlock',
  ProposalQueuedTimestamp = 'proposal__queuedTimestamp',
  ProposalQuorumCoefficient = 'proposal__quorumCoefficient',
  ProposalQuorumVotes = 'proposal__quorumVotes',
  ProposalStartBlock = 'proposal__startBlock',
  ProposalStatus = 'proposal__status',
  ProposalTitle = 'proposal__title',
  ProposalTotalSupply = 'proposal__totalSupply',
  ProposalUpdatePeriodEndBlock = 'proposal__updatePeriodEndBlock',
  ProposalVetoedBlock = 'proposal__vetoedBlock',
  ProposalVetoedTimestamp = 'proposal__vetoedTimestamp',
  ProposalVoteSnapshotBlock = 'proposal__voteSnapshotBlock',
  Reason = 'reason',
  SupportDetailed = 'supportDetailed',
  Voter = 'voter',
  VoterDelegatedVotes = 'voter__delegatedVotes',
  VoterDelegatedVotesRaw = 'voter__delegatedVotesRaw',
  VoterId = 'voter__id',
  VoterTokenHoldersRepresentedAmount = 'voter__tokenHoldersRepresentedAmount',
  Votes = 'votes'
}

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

export type ProposalVersionFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProposalVersionFilter>>>;
  calldatas?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProposalVersionFilter>>>;
  proposal?: InputMaybe<Scalars['String']['input']>;
  proposal_?: InputMaybe<ProposalFilter>;
  proposal_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_gt?: InputMaybe<Scalars['String']['input']>;
  proposal_gte?: InputMaybe<Scalars['String']['input']>;
  proposal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_lt?: InputMaybe<Scalars['String']['input']>;
  proposal_lte?: InputMaybe<Scalars['String']['input']>;
  proposal_not?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  signatures?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  targets?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_contains?: InputMaybe<Scalars['String']['input']>;
  title_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  title_ends_with?: InputMaybe<Scalars['String']['input']>;
  title_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  title_gt?: InputMaybe<Scalars['String']['input']>;
  title_gte?: InputMaybe<Scalars['String']['input']>;
  title_in?: InputMaybe<Array<Scalars['String']['input']>>;
  title_lt?: InputMaybe<Scalars['String']['input']>;
  title_lte?: InputMaybe<Scalars['String']['input']>;
  title_not?: InputMaybe<Scalars['String']['input']>;
  title_not_contains?: InputMaybe<Scalars['String']['input']>;
  title_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  title_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  title_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  title_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  title_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  title_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  title_starts_with?: InputMaybe<Scalars['String']['input']>;
  title_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updateMessage?: InputMaybe<Scalars['String']['input']>;
  updateMessage_contains?: InputMaybe<Scalars['String']['input']>;
  updateMessage_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  updateMessage_ends_with?: InputMaybe<Scalars['String']['input']>;
  updateMessage_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updateMessage_gt?: InputMaybe<Scalars['String']['input']>;
  updateMessage_gte?: InputMaybe<Scalars['String']['input']>;
  updateMessage_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updateMessage_lt?: InputMaybe<Scalars['String']['input']>;
  updateMessage_lte?: InputMaybe<Scalars['String']['input']>;
  updateMessage_not?: InputMaybe<Scalars['String']['input']>;
  updateMessage_not_contains?: InputMaybe<Scalars['String']['input']>;
  updateMessage_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  updateMessage_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  updateMessage_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updateMessage_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  updateMessage_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  updateMessage_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updateMessage_starts_with?: InputMaybe<Scalars['String']['input']>;
  updateMessage_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum ProposalVersionOrderBy {
  Calldatas = 'calldatas',
  CreatedAt = 'createdAt',
  CreatedBlock = 'createdBlock',
  Description = 'description',
  Id = 'id',
  Proposal = 'proposal',
  ProposalAbstainVotes = 'proposal__abstainVotes',
  ProposalAdjustedTotalSupply = 'proposal__adjustedTotalSupply',
  ProposalAgainstVotes = 'proposal__againstVotes',
  ProposalCanceledBlock = 'proposal__canceledBlock',
  ProposalCanceledTimestamp = 'proposal__canceledTimestamp',
  ProposalClientId = 'proposal__clientId',
  ProposalCreatedBlock = 'proposal__createdBlock',
  ProposalCreatedTimestamp = 'proposal__createdTimestamp',
  ProposalCreatedTransactionHash = 'proposal__createdTransactionHash',
  ProposalDescription = 'proposal__description',
  ProposalEndBlock = 'proposal__endBlock',
  ProposalExecutedBlock = 'proposal__executedBlock',
  ProposalExecutedTimestamp = 'proposal__executedTimestamp',
  ProposalExecutionEta = 'proposal__executionETA',
  ProposalForVotes = 'proposal__forVotes',
  ProposalId = 'proposal__id',
  ProposalLastUpdatedBlock = 'proposal__lastUpdatedBlock',
  ProposalLastUpdatedTimestamp = 'proposal__lastUpdatedTimestamp',
  ProposalMaxQuorumVotesBps = 'proposal__maxQuorumVotesBPS',
  ProposalMinQuorumVotesBps = 'proposal__minQuorumVotesBPS',
  ProposalObjectionPeriodEndBlock = 'proposal__objectionPeriodEndBlock',
  ProposalOnTimelockV1 = 'proposal__onTimelockV1',
  ProposalProposalThreshold = 'proposal__proposalThreshold',
  ProposalQueuedBlock = 'proposal__queuedBlock',
  ProposalQueuedTimestamp = 'proposal__queuedTimestamp',
  ProposalQuorumCoefficient = 'proposal__quorumCoefficient',
  ProposalQuorumVotes = 'proposal__quorumVotes',
  ProposalStartBlock = 'proposal__startBlock',
  ProposalStatus = 'proposal__status',
  ProposalTitle = 'proposal__title',
  ProposalTotalSupply = 'proposal__totalSupply',
  ProposalUpdatePeriodEndBlock = 'proposal__updatePeriodEndBlock',
  ProposalVetoedBlock = 'proposal__vetoedBlock',
  ProposalVetoedTimestamp = 'proposal__vetoedTimestamp',
  ProposalVoteSnapshotBlock = 'proposal__voteSnapshotBlock',
  Signatures = 'signatures',
  Targets = 'targets',
  Title = 'title',
  UpdateMessage = 'updateMessage',
  Values = 'values'
}

export type ProposalFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  abstainVotes?: InputMaybe<Scalars['BigInt']['input']>;
  abstainVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  abstainVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  abstainVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  abstainVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  abstainVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  abstainVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  abstainVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  adjustedTotalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  adjustedTotalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  adjustedTotalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  adjustedTotalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  adjustedTotalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  adjustedTotalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  adjustedTotalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  adjustedTotalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  againstVotes?: InputMaybe<Scalars['BigInt']['input']>;
  againstVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  againstVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  againstVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  againstVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  againstVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  againstVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  againstVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<ProposalFilter>>>;
  calldatas?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  calldatas_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  canceledBlock?: InputMaybe<Scalars['BigInt']['input']>;
  canceledBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  canceledBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  canceledBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  canceledBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  canceledBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  canceledBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  canceledBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  canceledTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  canceledTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  canceledTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  canceledTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  canceledTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  canceledTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  canceledTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  canceledTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  clientId?: InputMaybe<Scalars['Int']['input']>;
  clientId_gt?: InputMaybe<Scalars['Int']['input']>;
  clientId_gte?: InputMaybe<Scalars['Int']['input']>;
  clientId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  clientId_lt?: InputMaybe<Scalars['Int']['input']>;
  clientId_lte?: InputMaybe<Scalars['Int']['input']>;
  clientId_not?: InputMaybe<Scalars['Int']['input']>;
  clientId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  createdBlock?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdTransactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  createdTransactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  createdTransactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  endBlock?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  endBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executedBlock?: InputMaybe<Scalars['BigInt']['input']>;
  executedBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  executedBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  executedBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executedBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  executedBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  executedBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  executedBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executedTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  executedTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  executedTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  executedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executedTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  executedTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  executedTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  executedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executionETA?: InputMaybe<Scalars['BigInt']['input']>;
  executionETA_gt?: InputMaybe<Scalars['BigInt']['input']>;
  executionETA_gte?: InputMaybe<Scalars['BigInt']['input']>;
  executionETA_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  executionETA_lt?: InputMaybe<Scalars['BigInt']['input']>;
  executionETA_lte?: InputMaybe<Scalars['BigInt']['input']>;
  executionETA_not?: InputMaybe<Scalars['BigInt']['input']>;
  executionETA_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  feedbackPosts_?: InputMaybe<ProposalFeedbackFilter>;
  forVotes?: InputMaybe<Scalars['BigInt']['input']>;
  forVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  forVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  forVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  forVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  forVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  forVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  forVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastUpdatedBlock?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdatedBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdatedTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdatedTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdatedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxQuorumVotesBPS?: InputMaybe<Scalars['Int']['input']>;
  maxQuorumVotesBPS_gt?: InputMaybe<Scalars['Int']['input']>;
  maxQuorumVotesBPS_gte?: InputMaybe<Scalars['Int']['input']>;
  maxQuorumVotesBPS_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  maxQuorumVotesBPS_lt?: InputMaybe<Scalars['Int']['input']>;
  maxQuorumVotesBPS_lte?: InputMaybe<Scalars['Int']['input']>;
  maxQuorumVotesBPS_not?: InputMaybe<Scalars['Int']['input']>;
  maxQuorumVotesBPS_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  minQuorumVotesBPS?: InputMaybe<Scalars['Int']['input']>;
  minQuorumVotesBPS_gt?: InputMaybe<Scalars['Int']['input']>;
  minQuorumVotesBPS_gte?: InputMaybe<Scalars['Int']['input']>;
  minQuorumVotesBPS_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  minQuorumVotesBPS_lt?: InputMaybe<Scalars['Int']['input']>;
  minQuorumVotesBPS_lte?: InputMaybe<Scalars['Int']['input']>;
  minQuorumVotesBPS_not?: InputMaybe<Scalars['Int']['input']>;
  minQuorumVotesBPS_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  objectionPeriodEndBlock?: InputMaybe<Scalars['BigInt']['input']>;
  objectionPeriodEndBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  objectionPeriodEndBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  objectionPeriodEndBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  objectionPeriodEndBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  objectionPeriodEndBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  objectionPeriodEndBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  objectionPeriodEndBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  onTimelockV1?: InputMaybe<Scalars['Boolean']['input']>;
  onTimelockV1_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  onTimelockV1_not?: InputMaybe<Scalars['Boolean']['input']>;
  onTimelockV1_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ProposalFilter>>>;
  proposalThreshold?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposalThreshold_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_not?: InputMaybe<Scalars['BigInt']['input']>;
  proposalThreshold_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proposer?: InputMaybe<Scalars['String']['input']>;
  proposer_?: InputMaybe<DelegateFilter>;
  proposer_contains?: InputMaybe<Scalars['String']['input']>;
  proposer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_gt?: InputMaybe<Scalars['String']['input']>;
  proposer_gte?: InputMaybe<Scalars['String']['input']>;
  proposer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposer_lt?: InputMaybe<Scalars['String']['input']>;
  proposer_lte?: InputMaybe<Scalars['String']['input']>;
  proposer_not?: InputMaybe<Scalars['String']['input']>;
  proposer_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposer_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  queuedBlock?: InputMaybe<Scalars['BigInt']['input']>;
  queuedBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  queuedBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  queuedBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  queuedBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  queuedBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  queuedBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  queuedBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  queuedTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  queuedTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  queuedTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  queuedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  queuedTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  queuedTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  queuedTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  queuedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  quorumCoefficient?: InputMaybe<Scalars['BigInt']['input']>;
  quorumCoefficient_gt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumCoefficient_gte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumCoefficient_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  quorumCoefficient_lt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumCoefficient_lte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumCoefficient_not?: InputMaybe<Scalars['BigInt']['input']>;
  quorumCoefficient_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  quorumVotes?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  quorumVotes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_not?: InputMaybe<Scalars['BigInt']['input']>;
  quorumVotes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  signatures?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signatures_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  signers?: InputMaybe<Array<Scalars['String']['input']>>;
  signers_?: InputMaybe<DelegateFilter>;
  signers_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signers_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  signers_not?: InputMaybe<Array<Scalars['String']['input']>>;
  signers_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  signers_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  startBlock?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  startBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  status?: InputMaybe<ProposalStatus>;
  status_in?: InputMaybe<Array<ProposalStatus>>;
  status_not?: InputMaybe<ProposalStatus>;
  status_not_in?: InputMaybe<Array<ProposalStatus>>;
  targets?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  targets_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_contains?: InputMaybe<Scalars['String']['input']>;
  title_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  title_ends_with?: InputMaybe<Scalars['String']['input']>;
  title_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  title_gt?: InputMaybe<Scalars['String']['input']>;
  title_gte?: InputMaybe<Scalars['String']['input']>;
  title_in?: InputMaybe<Array<Scalars['String']['input']>>;
  title_lt?: InputMaybe<Scalars['String']['input']>;
  title_lte?: InputMaybe<Scalars['String']['input']>;
  title_not?: InputMaybe<Scalars['String']['input']>;
  title_not_contains?: InputMaybe<Scalars['String']['input']>;
  title_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  title_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  title_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  title_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  title_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  title_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  title_starts_with?: InputMaybe<Scalars['String']['input']>;
  title_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatePeriodEndBlock?: InputMaybe<Scalars['BigInt']['input']>;
  updatePeriodEndBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatePeriodEndBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatePeriodEndBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatePeriodEndBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatePeriodEndBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatePeriodEndBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatePeriodEndBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  values_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vetoedBlock?: InputMaybe<Scalars['BigInt']['input']>;
  vetoedBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  vetoedBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  vetoedBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vetoedBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  vetoedBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  vetoedBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  vetoedBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vetoedTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  vetoedTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  vetoedTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  vetoedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  vetoedTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  vetoedTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  vetoedTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  vetoedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  voteSnapshotBlock?: InputMaybe<Scalars['BigInt']['input']>;
  voteSnapshotBlock_gt?: InputMaybe<Scalars['BigInt']['input']>;
  voteSnapshotBlock_gte?: InputMaybe<Scalars['BigInt']['input']>;
  voteSnapshotBlock_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  voteSnapshotBlock_lt?: InputMaybe<Scalars['BigInt']['input']>;
  voteSnapshotBlock_lte?: InputMaybe<Scalars['BigInt']['input']>;
  voteSnapshotBlock_not?: InputMaybe<Scalars['BigInt']['input']>;
  voteSnapshotBlock_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votes_?: InputMaybe<VoteFilter>;
};

export enum ProposalOrderBy {
  AbstainVotes = 'abstainVotes',
  AdjustedTotalSupply = 'adjustedTotalSupply',
  AgainstVotes = 'againstVotes',
  Calldatas = 'calldatas',
  CanceledBlock = 'canceledBlock',
  CanceledTimestamp = 'canceledTimestamp',
  ClientId = 'clientId',
  CreatedBlock = 'createdBlock',
  CreatedTimestamp = 'createdTimestamp',
  CreatedTransactionHash = 'createdTransactionHash',
  Description = 'description',
  EndBlock = 'endBlock',
  ExecutedBlock = 'executedBlock',
  ExecutedTimestamp = 'executedTimestamp',
  ExecutionEta = 'executionETA',
  FeedbackPosts = 'feedbackPosts',
  ForVotes = 'forVotes',
  Id = 'id',
  LastUpdatedBlock = 'lastUpdatedBlock',
  LastUpdatedTimestamp = 'lastUpdatedTimestamp',
  MaxQuorumVotesBps = 'maxQuorumVotesBPS',
  MinQuorumVotesBps = 'minQuorumVotesBPS',
  ObjectionPeriodEndBlock = 'objectionPeriodEndBlock',
  OnTimelockV1 = 'onTimelockV1',
  ProposalThreshold = 'proposalThreshold',
  Proposer = 'proposer',
  ProposerDelegatedVotes = 'proposer__delegatedVotes',
  ProposerDelegatedVotesRaw = 'proposer__delegatedVotesRaw',
  ProposerId = 'proposer__id',
  ProposerTokenHoldersRepresentedAmount = 'proposer__tokenHoldersRepresentedAmount',
  QueuedBlock = 'queuedBlock',
  QueuedTimestamp = 'queuedTimestamp',
  QuorumCoefficient = 'quorumCoefficient',
  QuorumVotes = 'quorumVotes',
  Signatures = 'signatures',
  Signers = 'signers',
  StartBlock = 'startBlock',
  Status = 'status',
  Targets = 'targets',
  Title = 'title',
  TotalSupply = 'totalSupply',
  UpdatePeriodEndBlock = 'updatePeriodEndBlock',
  Values = 'values',
  VetoedBlock = 'vetoedBlock',
  VetoedTimestamp = 'vetoedTimestamp',
  VoteSnapshotBlock = 'voteSnapshotBlock',
  Votes = 'votes'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<Meta>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  auction?: Maybe<Auction>;
  auctions: Array<Auction>;
  bid?: Maybe<Bid>;
  bids: Array<Bid>;
  candidateFeedback?: Maybe<CandidateFeedback>;
  candidateFeedbacks: Array<CandidateFeedback>;
  delegate?: Maybe<Delegate>;
  delegates: Array<Delegate>;
  delegationEvent?: Maybe<DelegationEvent>;
  delegationEvents: Array<DelegationEvent>;
  dynamicQuorumParams?: Maybe<DynamicQuorumParams>;
  dynamicQuorumParams_collection: Array<DynamicQuorumParams>;
  escrowDeposit?: Maybe<EscrowDeposit>;
  escrowDeposits: Array<EscrowDeposit>;
  escrowWithdrawal?: Maybe<EscrowWithdrawal>;
  escrowWithdrawals: Array<EscrowWithdrawal>;
  escrowedNoun?: Maybe<EscrowedNoun>;
  escrowedNouns: Array<EscrowedNoun>;
  fork?: Maybe<Fork>;
  forkJoin?: Maybe<ForkJoin>;
  forkJoinedNoun?: Maybe<ForkJoinedNoun>;
  forkJoinedNouns: Array<ForkJoinedNoun>;
  forkJoins: Array<ForkJoin>;
  forks: Array<Fork>;
  governance?: Maybe<Governance>;
  governances: Array<Governance>;
  noun?: Maybe<Noun>;
  nouns: Array<Noun>;
  proposal?: Maybe<Proposal>;
  proposalCandidate?: Maybe<ProposalCandidate>;
  proposalCandidateContent?: Maybe<ProposalCandidateContent>;
  proposalCandidateContents: Array<ProposalCandidateContent>;
  proposalCandidateSignature?: Maybe<ProposalCandidateSignature>;
  proposalCandidateSignatures: Array<ProposalCandidateSignature>;
  proposalCandidateVersion?: Maybe<ProposalCandidateVersion>;
  proposalCandidateVersions: Array<ProposalCandidateVersion>;
  proposalCandidates: Array<ProposalCandidate>;
  proposalFeedback?: Maybe<ProposalFeedback>;
  proposalFeedbacks: Array<ProposalFeedback>;
  proposalVersion?: Maybe<ProposalVersion>;
  proposalVersions: Array<ProposalVersion>;
  proposals: Array<Proposal>;
  seed?: Maybe<Seed>;
  seeds: Array<Seed>;
  transferEvent?: Maybe<TransferEvent>;
  transferEvents: Array<TransferEvent>;
  vote?: Maybe<Vote>;
  votes: Array<Vote>;
};


export type QueryMetaArgs = {
  block?: InputMaybe<BlockHeight>;
};


export type QueryAccountArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryAccountsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<AccountFilter>;
};


export type QueryAuctionArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryAuctionsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AuctionOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<AuctionFilter>;
};


export type QueryBidArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryBidsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BidOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<BidFilter>;
};


export type QueryCandidateFeedbackArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryCandidateFeedbacksArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CandidateFeedbackOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<CandidateFeedbackFilter>;
};


export type QueryDelegateArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryDelegatesArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DelegateOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<DelegateFilter>;
};


export type QueryDelegationEventArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryDelegationEventsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DelegationEventOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<DelegationEventFilter>;
};


export type QueryDynamicQuorumParamsArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryDynamicQuorumParamsCollectionArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DynamicQuorumParamsOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<DynamicQuorumParamsFilter>;
};


export type QueryEscrowDepositArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryEscrowDepositsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<EscrowDepositOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<EscrowDepositFilter>;
};


export type QueryEscrowWithdrawalArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryEscrowWithdrawalsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<EscrowWithdrawalOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<EscrowWithdrawalFilter>;
};


export type QueryEscrowedNounArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryEscrowedNounsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<EscrowedNounOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<EscrowedNounFilter>;
};


export type QueryForkArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryForkJoinArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryForkJoinedNounArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryForkJoinedNounsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ForkJoinedNounOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<ForkJoinedNounFilter>;
};


export type QueryForkJoinsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ForkJoinOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<ForkJoinFilter>;
};


export type QueryForksArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ForkOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<ForkFilter>;
};


export type QueryGovernanceArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryGovernancesArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GovernanceOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<GovernanceFilter>;
};


export type QueryNounArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryNounsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NounOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<NounFilter>;
};


export type QueryProposalArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryProposalCandidateArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryProposalCandidateContentArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryProposalCandidateContentsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProposalCandidateContentOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<ProposalCandidateContentFilter>;
};


export type QueryProposalCandidateSignatureArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryProposalCandidateSignaturesArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProposalCandidateSignatureOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<ProposalCandidateSignatureFilter>;
};


export type QueryProposalCandidateVersionArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryProposalCandidateVersionsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProposalCandidateVersionOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<ProposalCandidateVersionFilter>;
};


export type QueryProposalCandidatesArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProposalCandidateOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<ProposalCandidateFilter>;
};


export type QueryProposalFeedbackArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryProposalFeedbacksArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProposalFeedbackOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<ProposalFeedbackFilter>;
};


export type QueryProposalVersionArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryProposalVersionsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProposalVersionOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<ProposalVersionFilter>;
};


export type QueryProposalsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProposalOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<ProposalFilter>;
};


export type QuerySeedArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QuerySeedsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SeedOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<SeedFilter>;
};


export type QueryTransferEventArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryTransferEventsArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TransferEventOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<TransferEventFilter>;
};


export type QueryVoteArgs = {
  block?: InputMaybe<BlockHeight>;
  id: Scalars['ID']['input'];
  subgraphError?: SubgraphErrorPolicy;
};


export type QueryVotesArgs = {
  block?: InputMaybe<BlockHeight>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VoteOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: SubgraphErrorPolicy;
  where?: InputMaybe<VoteFilter>;
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

export type SeedFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  accessory?: InputMaybe<Scalars['BigInt']['input']>;
  accessory_gt?: InputMaybe<Scalars['BigInt']['input']>;
  accessory_gte?: InputMaybe<Scalars['BigInt']['input']>;
  accessory_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  accessory_lt?: InputMaybe<Scalars['BigInt']['input']>;
  accessory_lte?: InputMaybe<Scalars['BigInt']['input']>;
  accessory_not?: InputMaybe<Scalars['BigInt']['input']>;
  accessory_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<SeedFilter>>>;
  background?: InputMaybe<Scalars['BigInt']['input']>;
  background_gt?: InputMaybe<Scalars['BigInt']['input']>;
  background_gte?: InputMaybe<Scalars['BigInt']['input']>;
  background_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  background_lt?: InputMaybe<Scalars['BigInt']['input']>;
  background_lte?: InputMaybe<Scalars['BigInt']['input']>;
  background_not?: InputMaybe<Scalars['BigInt']['input']>;
  background_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  body?: InputMaybe<Scalars['BigInt']['input']>;
  body_gt?: InputMaybe<Scalars['BigInt']['input']>;
  body_gte?: InputMaybe<Scalars['BigInt']['input']>;
  body_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  body_lt?: InputMaybe<Scalars['BigInt']['input']>;
  body_lte?: InputMaybe<Scalars['BigInt']['input']>;
  body_not?: InputMaybe<Scalars['BigInt']['input']>;
  body_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  glasses?: InputMaybe<Scalars['BigInt']['input']>;
  glasses_gt?: InputMaybe<Scalars['BigInt']['input']>;
  glasses_gte?: InputMaybe<Scalars['BigInt']['input']>;
  glasses_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  glasses_lt?: InputMaybe<Scalars['BigInt']['input']>;
  glasses_lte?: InputMaybe<Scalars['BigInt']['input']>;
  glasses_not?: InputMaybe<Scalars['BigInt']['input']>;
  glasses_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  head?: InputMaybe<Scalars['BigInt']['input']>;
  head_gt?: InputMaybe<Scalars['BigInt']['input']>;
  head_gte?: InputMaybe<Scalars['BigInt']['input']>;
  head_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  head_lt?: InputMaybe<Scalars['BigInt']['input']>;
  head_lte?: InputMaybe<Scalars['BigInt']['input']>;
  head_not?: InputMaybe<Scalars['BigInt']['input']>;
  head_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SeedFilter>>>;
};

export enum SeedOrderBy {
  Accessory = 'accessory',
  Background = 'background',
  Body = 'body',
  Glasses = 'glasses',
  Head = 'head',
  Id = 'id'
}

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

export type TransferEventFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TransferEventFilter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  newHolder?: InputMaybe<Scalars['String']['input']>;
  newHolder_?: InputMaybe<AccountFilter>;
  newHolder_contains?: InputMaybe<Scalars['String']['input']>;
  newHolder_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  newHolder_ends_with?: InputMaybe<Scalars['String']['input']>;
  newHolder_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newHolder_gt?: InputMaybe<Scalars['String']['input']>;
  newHolder_gte?: InputMaybe<Scalars['String']['input']>;
  newHolder_in?: InputMaybe<Array<Scalars['String']['input']>>;
  newHolder_lt?: InputMaybe<Scalars['String']['input']>;
  newHolder_lte?: InputMaybe<Scalars['String']['input']>;
  newHolder_not?: InputMaybe<Scalars['String']['input']>;
  newHolder_not_contains?: InputMaybe<Scalars['String']['input']>;
  newHolder_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  newHolder_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  newHolder_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newHolder_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  newHolder_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  newHolder_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newHolder_starts_with?: InputMaybe<Scalars['String']['input']>;
  newHolder_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun?: InputMaybe<Scalars['String']['input']>;
  noun_?: InputMaybe<NounFilter>;
  noun_contains?: InputMaybe<Scalars['String']['input']>;
  noun_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_ends_with?: InputMaybe<Scalars['String']['input']>;
  noun_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_gt?: InputMaybe<Scalars['String']['input']>;
  noun_gte?: InputMaybe<Scalars['String']['input']>;
  noun_in?: InputMaybe<Array<Scalars['String']['input']>>;
  noun_lt?: InputMaybe<Scalars['String']['input']>;
  noun_lte?: InputMaybe<Scalars['String']['input']>;
  noun_not?: InputMaybe<Scalars['String']['input']>;
  noun_not_contains?: InputMaybe<Scalars['String']['input']>;
  noun_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  noun_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  noun_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  noun_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_starts_with?: InputMaybe<Scalars['String']['input']>;
  noun_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<TransferEventFilter>>>;
  previousHolder?: InputMaybe<Scalars['String']['input']>;
  previousHolder_?: InputMaybe<AccountFilter>;
  previousHolder_contains?: InputMaybe<Scalars['String']['input']>;
  previousHolder_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  previousHolder_ends_with?: InputMaybe<Scalars['String']['input']>;
  previousHolder_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  previousHolder_gt?: InputMaybe<Scalars['String']['input']>;
  previousHolder_gte?: InputMaybe<Scalars['String']['input']>;
  previousHolder_in?: InputMaybe<Array<Scalars['String']['input']>>;
  previousHolder_lt?: InputMaybe<Scalars['String']['input']>;
  previousHolder_lte?: InputMaybe<Scalars['String']['input']>;
  previousHolder_not?: InputMaybe<Scalars['String']['input']>;
  previousHolder_not_contains?: InputMaybe<Scalars['String']['input']>;
  previousHolder_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  previousHolder_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  previousHolder_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  previousHolder_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  previousHolder_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  previousHolder_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  previousHolder_starts_with?: InputMaybe<Scalars['String']['input']>;
  previousHolder_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum TransferEventOrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  NewHolder = 'newHolder',
  NewHolderId = 'newHolder__id',
  NewHolderTokenBalance = 'newHolder__tokenBalance',
  NewHolderTokenBalanceRaw = 'newHolder__tokenBalanceRaw',
  NewHolderTotalTokensHeld = 'newHolder__totalTokensHeld',
  NewHolderTotalTokensHeldRaw = 'newHolder__totalTokensHeldRaw',
  Noun = 'noun',
  NounId = 'noun__id',
  PreviousHolder = 'previousHolder',
  PreviousHolderId = 'previousHolder__id',
  PreviousHolderTokenBalance = 'previousHolder__tokenBalance',
  PreviousHolderTokenBalanceRaw = 'previousHolder__tokenBalanceRaw',
  PreviousHolderTotalTokensHeld = 'previousHolder__totalTokensHeld',
  PreviousHolderTotalTokensHeldRaw = 'previousHolder__totalTokensHeldRaw'
}

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
  /** Delegate that emitted the vote */
  voter: Delegate;
  /** Amount of votes in favour or against expressed as a BigInt normalized value for the Nouns ERC721 Token */
  votes: Scalars['BigInt']['output'];
  /** Amount of votes in favour or against expressed in the smallest unit of the Nouns ERC721 Token */
  votesRaw: Scalars['BigInt']['output'];
};


export type VoteNounsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NounOrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<NounFilter>;
};

export type VoteFilter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<VoteFilter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  clientId?: InputMaybe<Scalars['Int']['input']>;
  clientId_gt?: InputMaybe<Scalars['Int']['input']>;
  clientId_gte?: InputMaybe<Scalars['Int']['input']>;
  clientId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  clientId_lt?: InputMaybe<Scalars['Int']['input']>;
  clientId_lte?: InputMaybe<Scalars['Int']['input']>;
  clientId_not?: InputMaybe<Scalars['Int']['input']>;
  clientId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nouns?: InputMaybe<Array<Scalars['String']['input']>>;
  nouns_?: InputMaybe<NounFilter>;
  nouns_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  nouns_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  nouns_not?: InputMaybe<Array<Scalars['String']['input']>>;
  nouns_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  nouns_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  or?: InputMaybe<Array<InputMaybe<VoteFilter>>>;
  proposal?: InputMaybe<Scalars['String']['input']>;
  proposal_?: InputMaybe<ProposalFilter>;
  proposal_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_gt?: InputMaybe<Scalars['String']['input']>;
  proposal_gte?: InputMaybe<Scalars['String']['input']>;
  proposal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_lt?: InputMaybe<Scalars['String']['input']>;
  proposal_lte?: InputMaybe<Scalars['String']['input']>;
  proposal_not?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains?: InputMaybe<Scalars['String']['input']>;
  proposal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with?: InputMaybe<Scalars['String']['input']>;
  proposal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  reason_contains?: InputMaybe<Scalars['String']['input']>;
  reason_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_gt?: InputMaybe<Scalars['String']['input']>;
  reason_gte?: InputMaybe<Scalars['String']['input']>;
  reason_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_lt?: InputMaybe<Scalars['String']['input']>;
  reason_lte?: InputMaybe<Scalars['String']['input']>;
  reason_not?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains?: InputMaybe<Scalars['String']['input']>;
  reason_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  reason_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with?: InputMaybe<Scalars['String']['input']>;
  reason_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  support?: InputMaybe<Scalars['Boolean']['input']>;
  supportDetailed?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_gt?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_gte?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  supportDetailed_lt?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_lte?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_not?: InputMaybe<Scalars['Int']['input']>;
  supportDetailed_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  support_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  support_not?: InputMaybe<Scalars['Boolean']['input']>;
  support_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  voter?: InputMaybe<Scalars['String']['input']>;
  voter_?: InputMaybe<DelegateFilter>;
  voter_contains?: InputMaybe<Scalars['String']['input']>;
  voter_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_ends_with?: InputMaybe<Scalars['String']['input']>;
  voter_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_gt?: InputMaybe<Scalars['String']['input']>;
  voter_gte?: InputMaybe<Scalars['String']['input']>;
  voter_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voter_lt?: InputMaybe<Scalars['String']['input']>;
  voter_lte?: InputMaybe<Scalars['String']['input']>;
  voter_not?: InputMaybe<Scalars['String']['input']>;
  voter_not_contains?: InputMaybe<Scalars['String']['input']>;
  voter_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  voter_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  voter_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  voter_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  voter_starts_with?: InputMaybe<Scalars['String']['input']>;
  voter_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  votes?: InputMaybe<Scalars['BigInt']['input']>;
  votesRaw?: InputMaybe<Scalars['BigInt']['input']>;
  votesRaw_gt?: InputMaybe<Scalars['BigInt']['input']>;
  votesRaw_gte?: InputMaybe<Scalars['BigInt']['input']>;
  votesRaw_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votesRaw_lt?: InputMaybe<Scalars['BigInt']['input']>;
  votesRaw_lte?: InputMaybe<Scalars['BigInt']['input']>;
  votesRaw_not?: InputMaybe<Scalars['BigInt']['input']>;
  votesRaw_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votes_gt?: InputMaybe<Scalars['BigInt']['input']>;
  votes_gte?: InputMaybe<Scalars['BigInt']['input']>;
  votes_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  votes_lt?: InputMaybe<Scalars['BigInt']['input']>;
  votes_lte?: InputMaybe<Scalars['BigInt']['input']>;
  votes_not?: InputMaybe<Scalars['BigInt']['input']>;
  votes_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum VoteOrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  ClientId = 'clientId',
  Id = 'id',
  Nouns = 'nouns',
  Proposal = 'proposal',
  ProposalAbstainVotes = 'proposal__abstainVotes',
  ProposalAdjustedTotalSupply = 'proposal__adjustedTotalSupply',
  ProposalAgainstVotes = 'proposal__againstVotes',
  ProposalCanceledBlock = 'proposal__canceledBlock',
  ProposalCanceledTimestamp = 'proposal__canceledTimestamp',
  ProposalClientId = 'proposal__clientId',
  ProposalCreatedBlock = 'proposal__createdBlock',
  ProposalCreatedTimestamp = 'proposal__createdTimestamp',
  ProposalCreatedTransactionHash = 'proposal__createdTransactionHash',
  ProposalDescription = 'proposal__description',
  ProposalEndBlock = 'proposal__endBlock',
  ProposalExecutedBlock = 'proposal__executedBlock',
  ProposalExecutedTimestamp = 'proposal__executedTimestamp',
  ProposalExecutionEta = 'proposal__executionETA',
  ProposalForVotes = 'proposal__forVotes',
  ProposalId = 'proposal__id',
  ProposalLastUpdatedBlock = 'proposal__lastUpdatedBlock',
  ProposalLastUpdatedTimestamp = 'proposal__lastUpdatedTimestamp',
  ProposalMaxQuorumVotesBps = 'proposal__maxQuorumVotesBPS',
  ProposalMinQuorumVotesBps = 'proposal__minQuorumVotesBPS',
  ProposalObjectionPeriodEndBlock = 'proposal__objectionPeriodEndBlock',
  ProposalOnTimelockV1 = 'proposal__onTimelockV1',
  ProposalProposalThreshold = 'proposal__proposalThreshold',
  ProposalQueuedBlock = 'proposal__queuedBlock',
  ProposalQueuedTimestamp = 'proposal__queuedTimestamp',
  ProposalQuorumCoefficient = 'proposal__quorumCoefficient',
  ProposalQuorumVotes = 'proposal__quorumVotes',
  ProposalStartBlock = 'proposal__startBlock',
  ProposalStatus = 'proposal__status',
  ProposalTitle = 'proposal__title',
  ProposalTotalSupply = 'proposal__totalSupply',
  ProposalUpdatePeriodEndBlock = 'proposal__updatePeriodEndBlock',
  ProposalVetoedBlock = 'proposal__vetoedBlock',
  ProposalVetoedTimestamp = 'proposal__vetoedTimestamp',
  ProposalVoteSnapshotBlock = 'proposal__voteSnapshotBlock',
  Reason = 'reason',
  Support = 'support',
  SupportDetailed = 'supportDetailed',
  Voter = 'voter',
  VoterDelegatedVotes = 'voter__delegatedVotes',
  VoterDelegatedVotesRaw = 'voter__delegatedVotesRaw',
  VoterId = 'voter__id',
  VoterTokenHoldersRepresentedAmount = 'voter__tokenHoldersRepresentedAmount',
  Votes = 'votes',
  VotesRaw = 'votesRaw'
}

export type Block = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type Meta = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: Block;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum SubgraphErrorPolicy {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type GetSeedsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
}>;


export type GetSeedsQuery = { __typename?: 'Query', seeds: Array<{ __typename?: 'Seed', id: string, background: bigint, body: bigint, accessory: bigint, head: bigint, glasses: bigint }> };

export type GetProposalQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProposalQuery = { __typename?: 'Query', proposal?: { __typename?: 'Proposal', id: string, description: string, status?: ProposalStatus | null, proposalThreshold?: bigint | null, quorumVotes?: bigint | null, forVotes: bigint, againstVotes: bigint, abstainVotes: bigint, createdTransactionHash: "Byte", createdBlock: bigint, createdTimestamp: bigint, startBlock: bigint, endBlock: bigint, updatePeriodEndBlock?: bigint | null, objectionPeriodEndBlock: bigint, executionETA?: bigint | null, targets?: Array<"Byte"> | null, values?: Array<bigint> | null, signatures?: Array<string> | null, calldatas?: Array<"Byte"> | null, onTimelockV1?: boolean | null, voteSnapshotBlock: bigint, proposer: { __typename?: 'Delegate', id: string }, signers?: Array<{ __typename?: 'Delegate', id: string }> | null } | null };

export type GetPartialProposalsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
}>;


export type GetPartialProposalsQuery = { __typename?: 'Query', proposals: Array<{ __typename?: 'Proposal', id: string, title: string, status?: ProposalStatus | null, forVotes: bigint, againstVotes: bigint, abstainVotes: bigint, quorumVotes?: bigint | null, executionETA?: bigint | null, startBlock: bigint, endBlock: bigint, updatePeriodEndBlock?: bigint | null, objectionPeriodEndBlock: bigint, onTimelockV1?: boolean | null, signers?: Array<{ __typename?: 'Delegate', id: string }> | null }> };

export type GetActivePendingUpdatableProposersQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  currentBlock: Scalars['BigInt']['input'];
}>;


export type GetActivePendingUpdatableProposersQuery = { __typename?: 'Query', proposals: Array<{ __typename?: 'Proposal', proposer: { __typename?: 'Delegate', id: string }, signers?: Array<{ __typename?: 'Delegate', id: string }> | null }> };

export type GetUpdatableProposalsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  currentBlock: Scalars['BigInt']['input'];
}>;


export type GetUpdatableProposalsQuery = { __typename?: 'Query', proposals: Array<{ __typename?: 'Proposal', id: string }> };

export type GetCandidateProposalsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
}>;


export type GetCandidateProposalsQuery = { __typename?: 'Query', proposalCandidates: Array<{ __typename?: 'ProposalCandidate', id: string, slug: string, proposer: "Byte", lastUpdatedTimestamp: bigint, createdTransactionHash: "Byte", canceled: boolean, versions: Array<{ __typename?: 'ProposalCandidateVersion', content: { __typename?: 'ProposalCandidateContent', title: string } }>, latestVersion: { __typename?: 'ProposalCandidateVersion', content: { __typename?: 'ProposalCandidateContent', title: string, description: string, targets?: Array<"Byte"> | null, values?: Array<bigint> | null, signatures?: Array<string> | null, calldatas?: Array<"Byte"> | null, encodedProposalHash: "Byte", proposalIdToUpdate: bigint, matchingProposalIds?: Array<bigint> | null, contentSignatures: Array<{ __typename?: 'ProposalCandidateSignature', id: string, sig: "Byte", expirationTimestamp: bigint, canceled: boolean, reason: string, signer: { __typename?: 'Delegate', id: string, proposals: Array<{ __typename?: 'Proposal', id: string }> } }> } } }> };

export type GetCandidateProposalQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCandidateProposalQuery = { __typename?: 'Query', proposalCandidate?: { __typename?: 'ProposalCandidate', id: string, slug: string, proposer: "Byte", lastUpdatedTimestamp: bigint, createdTransactionHash: "Byte", canceled: boolean, versions: Array<{ __typename?: 'ProposalCandidateVersion', content: { __typename?: 'ProposalCandidateContent', title: string } }>, latestVersion: { __typename?: 'ProposalCandidateVersion', content: { __typename?: 'ProposalCandidateContent', title: string, description: string, targets?: Array<"Byte"> | null, values?: Array<bigint> | null, signatures?: Array<string> | null, calldatas?: Array<"Byte"> | null, encodedProposalHash: "Byte", proposalIdToUpdate: bigint, matchingProposalIds?: Array<bigint> | null, contentSignatures: Array<{ __typename?: 'ProposalCandidateSignature', id: string, sig: "Byte", expirationTimestamp: bigint, canceled: boolean, reason: string, signer: { __typename?: 'Delegate', id: string, proposals: Array<{ __typename?: 'Proposal', id: string }> } }> } } } | null };

export type GetCandidateProposalVersionsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCandidateProposalVersionsQuery = { __typename?: 'Query', proposalCandidate?: { __typename?: 'ProposalCandidate', id: string, slug: string, proposer: "Byte", lastUpdatedTimestamp: bigint, canceled: boolean, createdTransactionHash: "Byte", versions: Array<{ __typename?: 'ProposalCandidateVersion', id: string, createdTimestamp: bigint, updateMessage: string, content: { __typename?: 'ProposalCandidateContent', title: string, description: string, targets?: Array<"Byte"> | null, values?: Array<bigint> | null, signatures?: Array<string> | null, calldatas?: Array<"Byte"> | null, encodedProposalHash: "Byte" } }>, latestVersion: { __typename?: 'ProposalCandidateVersion', id: string } } | null };

export type GetProposalVersionsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProposalVersionsQuery = { __typename?: 'Query', proposalVersions: Array<{ __typename?: 'ProposalVersion', id: string, createdAt: bigint, updateMessage: string, title: string, description: string, targets?: Array<"Byte"> | null, values?: Array<bigint> | null, signatures?: Array<string> | null, calldatas?: Array<"Byte"> | null, proposal: { __typename?: 'Proposal', id: string } }> };

export type GetAuctionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAuctionQuery = { __typename?: 'Query', auction?: { __typename?: 'Auction', id: string, amount: bigint, settled: boolean, startTime: bigint, endTime: bigint, bidder?: { __typename?: 'Account', id: string } | null, noun: { __typename?: 'Noun', id: string, seed?: { __typename?: 'Seed', id: string, background: bigint, body: bigint, accessory: bigint, head: bigint, glasses: bigint } | null, owner: { __typename?: 'Account', id: string } }, bids: Array<{ __typename?: 'Bid', id: string, blockNumber: bigint, txIndex: bigint, amount: bigint }> } | null };

export type GetBidsByAuctionQueryVariables = Exact<{
  auctionId: Scalars['String']['input'];
}>;


export type GetBidsByAuctionQuery = { __typename?: 'Query', bids: Array<{ __typename?: 'Bid', id: string, amount: bigint, blockNumber: bigint, blockTimestamp: bigint, txIndex: bigint, bidder?: { __typename?: 'Account', id: string } | null, noun: { __typename?: 'Noun', id: string } }> };

export type GetNounQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetNounQuery = { __typename?: 'Query', noun?: { __typename?: 'Noun', id: string, seed?: { __typename?: 'Seed', background: bigint, body: bigint, accessory: bigint, head: bigint, glasses: bigint } | null, owner: { __typename?: 'Account', id: string } } | null };

export type GetNounsIndexQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNounsIndexQuery = { __typename?: 'Query', nouns: Array<{ __typename?: 'Noun', id: string, owner: { __typename?: 'Account', id: string } }> };

export type GetLatestAuctionsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetLatestAuctionsQuery = { __typename?: 'Query', auctions: Array<{ __typename?: 'Auction', id: string, amount: bigint, settled: boolean, startTime: bigint, endTime: bigint, bidder?: { __typename?: 'Account', id: string } | null, noun: { __typename?: 'Noun', id: string, owner: { __typename?: 'Account', id: string } }, bids: Array<{ __typename?: 'Bid', id: string, amount: bigint, blockNumber: bigint, blockTimestamp: bigint, txHash: "Byte", txIndex: bigint, bidder?: { __typename?: 'Account', id: string } | null }> }> };

export type GetLatestBidsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
}>;


export type GetLatestBidsQuery = { __typename?: 'Query', bids: Array<{ __typename?: 'Bid', id: string, amount: bigint, blockTimestamp: bigint, txIndex: bigint, blockNumber: bigint, bidder?: { __typename?: 'Account', id: string } | null, auction: { __typename?: 'Auction', id: string, startTime: bigint, endTime: bigint, settled: boolean } }> };

export type GetNounVotingHistoryQueryVariables = Exact<{
  nounId: Scalars['ID']['input'];
  first: Scalars['Int']['input'];
}>;


export type GetNounVotingHistoryQuery = { __typename?: 'Query', noun?: { __typename?: 'Noun', id: string, votes: Array<{ __typename?: 'Vote', blockNumber: bigint, support: boolean, supportDetailed: number, proposal: { __typename?: 'Proposal', id: string }, voter: { __typename?: 'Delegate', id: string } }> } | null };

export type GetNounTransferHistoryQueryVariables = Exact<{
  nounId: Scalars['String']['input'];
  first: Scalars['Int']['input'];
}>;


export type GetNounTransferHistoryQuery = { __typename?: 'Query', transferEvents: Array<{ __typename?: 'TransferEvent', id: string, blockNumber: bigint, previousHolder: { __typename?: 'Account', id: string }, newHolder: { __typename?: 'Account', id: string } }> };

export type GetNounDelegationHistoryQueryVariables = Exact<{
  nounId: Scalars['String']['input'];
  first: Scalars['Int']['input'];
}>;


export type GetNounDelegationHistoryQuery = { __typename?: 'Query', delegationEvents: Array<{ __typename?: 'DelegationEvent', id: string, blockNumber: bigint, previousDelegate: { __typename?: 'Delegate', id: string }, newDelegate: { __typename?: 'Delegate', id: string } }> };

export type GetCreateTimestampAllProposalsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCreateTimestampAllProposalsQuery = { __typename?: 'Query', proposals: Array<{ __typename?: 'Proposal', id: string, createdTimestamp: bigint }> };

export type GetProposalVotesQueryVariables = Exact<{
  proposalId: Scalars['String']['input'];
}>;


export type GetProposalVotesQuery = { __typename?: 'Query', votes: Array<{ __typename?: 'Vote', supportDetailed: number, voter: { __typename?: 'Delegate', id: string } }> };

export type GetDelegateNounsAtBlockQueryVariables = Exact<{
  delegates: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  block: Scalars['Int']['input'];
}>;


export type GetDelegateNounsAtBlockQuery = { __typename?: 'Query', delegates: Array<{ __typename?: 'Delegate', id: string, nounsRepresented: Array<{ __typename?: 'Noun', id: string }> }> };

export type GetCurrentlyDelegatedNounsQueryVariables = Exact<{
  delegate: Scalars['ID']['input'];
}>;


export type GetCurrentlyDelegatedNounsQuery = { __typename?: 'Query', delegates: Array<{ __typename?: 'Delegate', id: string, nounsRepresented: Array<{ __typename?: 'Noun', id: string }> }> };

export type GetAdjustedNounSupplyAtPropSnapshotQueryVariables = Exact<{
  proposalId: Scalars['ID']['input'];
}>;


export type GetAdjustedNounSupplyAtPropSnapshotQuery = { __typename?: 'Query', proposals: Array<{ __typename?: 'Proposal', adjustedTotalSupply: bigint }> };

export type GetPropUsingDynamicQuorumQueryVariables = Exact<{
  proposalId: Scalars['ID']['input'];
}>;


export type GetPropUsingDynamicQuorumQuery = { __typename?: 'Query', proposal?: { __typename?: 'Proposal', quorumCoefficient: bigint } | null };

export type GetProposalFeedbacksQueryVariables = Exact<{
  proposalId: Scalars['ID']['input'];
}>;


export type GetProposalFeedbacksQuery = { __typename?: 'Query', proposalFeedbacks: Array<{ __typename?: 'ProposalFeedback', supportDetailed: number, votes: bigint, reason?: string | null, createdTimestamp: bigint, voter: { __typename?: 'Delegate', id: string }, proposal: { __typename?: 'Proposal', id: string } }> };

export type GetCandidateFeedbacksQueryVariables = Exact<{
  candidateId: Scalars['ID']['input'];
}>;


export type GetCandidateFeedbacksQuery = { __typename?: 'Query', candidateFeedbacks: Array<{ __typename?: 'CandidateFeedback', supportDetailed: number, votes: bigint, reason?: string | null, createdTimestamp: bigint, voter: { __typename?: 'Delegate', id: string }, candidate: { __typename?: 'ProposalCandidate', id: string } }> };

export type GetOwnedNounsQueryVariables = Exact<{
  owner: Scalars['ID']['input'];
}>;


export type GetOwnedNounsQuery = { __typename?: 'Query', nouns: Array<{ __typename?: 'Noun', id: string }> };

export type GetAccountEscrowedNounsQueryVariables = Exact<{
  owner: Scalars['ID']['input'];
}>;


export type GetAccountEscrowedNounsQuery = { __typename?: 'Query', escrowedNouns: Array<{ __typename?: 'EscrowedNoun', noun: { __typename?: 'Noun', id: string }, fork: { __typename?: 'Fork', id: string } }> };

export type GetEscrowDepositEventsQueryVariables = Exact<{
  forkId: Scalars['String']['input'];
}>;


export type GetEscrowDepositEventsQuery = { __typename?: 'Query', escrowDeposits: Array<{ __typename?: 'EscrowDeposit', id: string, createdAt: bigint, reason?: string | null, tokenIDs: Array<bigint>, proposalIDs: Array<bigint>, owner: { __typename?: 'Delegate', id: string } }> };

export type GetForkJoinsQueryVariables = Exact<{
  forkId: Scalars['String']['input'];
}>;


export type GetForkJoinsQuery = { __typename?: 'Query', forkJoins: Array<{ __typename?: 'ForkJoin', id: string, createdAt: bigint, reason?: string | null, tokenIDs: Array<bigint>, proposalIDs: Array<bigint>, owner: { __typename?: 'Delegate', id: string } }> };

export type GetEscrowWithdrawEventsQueryVariables = Exact<{
  forkId: Scalars['String']['input'];
}>;


export type GetEscrowWithdrawEventsQuery = { __typename?: 'Query', escrowWithdrawals: Array<{ __typename?: 'EscrowWithdrawal', id: string, createdAt: bigint, tokenIDs: Array<bigint>, owner: { __typename?: 'Delegate', id: string } }> };

export type GetProposalTitlesQueryVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type GetProposalTitlesQuery = { __typename?: 'Query', proposals: Array<{ __typename?: 'Proposal', id: string, title: string }> };

export type GetForkDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetForkDetailsQuery = { __typename?: 'Query', fork?: { __typename?: 'Fork', id: string, forkID: bigint, executed?: boolean | null, executedAt?: bigint | null, forkTreasury?: "Byte" | null, forkToken?: "Byte" | null, tokensForkingCount: number, tokensInEscrowCount: number, forkingPeriodEndTimestamp?: bigint | null, escrowedNouns: Array<{ __typename?: 'EscrowedNoun', noun: { __typename?: 'Noun', id: string } }>, joinedNouns: Array<{ __typename?: 'ForkJoinedNoun', noun: { __typename?: 'Noun', id: string } }> } | null };

export type GetForksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetForksQuery = { __typename?: 'Query', forks: Array<{ __typename?: 'Fork', id: string, forkID: bigint, executed?: boolean | null, executedAt?: bigint | null, forkTreasury?: "Byte" | null, forkToken?: "Byte" | null, tokensForkingCount: number, tokensInEscrowCount: number, forkingPeriodEndTimestamp?: bigint | null }> };

export type GetIsForkActiveQueryVariables = Exact<{
  currentTimestamp: Scalars['BigInt']['input'];
}>;


export type GetIsForkActiveQuery = { __typename?: 'Query', forks: Array<{ __typename?: 'Fork', forkID: bigint, forkingPeriodEndTimestamp?: bigint | null }> };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType'];
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const GetSeedsDocument = new TypedDocumentString(`
    query GetSeeds($first: Int!) {
  seeds(first: $first) {
    id
    background
    body
    accessory
    head
    glasses
  }
}
    `) as unknown as TypedDocumentString<GetSeedsQuery, GetSeedsQueryVariables>;
export const GetProposalDocument = new TypedDocumentString(`
    query GetProposal($id: ID!) {
  proposal(id: $id) {
    id
    description
    status
    proposalThreshold
    quorumVotes
    forVotes
    againstVotes
    abstainVotes
    createdTransactionHash
    createdBlock
    createdTimestamp
    startBlock
    endBlock
    updatePeriodEndBlock
    objectionPeriodEndBlock
    executionETA
    targets
    values
    signatures
    calldatas
    onTimelockV1
    voteSnapshotBlock
    proposer {
      id
    }
    signers {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<GetProposalQuery, GetProposalQueryVariables>;
export const GetPartialProposalsDocument = new TypedDocumentString(`
    query GetPartialProposals($first: Int!) {
  proposals(first: $first, orderBy: createdBlock, orderDirection: asc) {
    id
    title
    status
    forVotes
    againstVotes
    abstainVotes
    quorumVotes
    executionETA
    startBlock
    endBlock
    updatePeriodEndBlock
    objectionPeriodEndBlock
    onTimelockV1
    signers {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<GetPartialProposalsQuery, GetPartialProposalsQueryVariables>;
export const GetActivePendingUpdatableProposersDocument = new TypedDocumentString(`
    query GetActivePendingUpdatableProposers($first: Int!, $currentBlock: BigInt!) {
  proposals(
    first: $first
    where: {or: [{status: PENDING, endBlock_gt: $currentBlock}, {status: ACTIVE, endBlock_gt: $currentBlock}]}
  ) {
    proposer {
      id
    }
    signers {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<GetActivePendingUpdatableProposersQuery, GetActivePendingUpdatableProposersQueryVariables>;
export const GetUpdatableProposalsDocument = new TypedDocumentString(`
    query GetUpdatableProposals($first: Int!, $currentBlock: BigInt!) {
  proposals(
    first: $first
    where: {status: PENDING, endBlock_gt: $currentBlock, updatePeriodEndBlock_gt: $currentBlock}
  ) {
    id
  }
}
    `) as unknown as TypedDocumentString<GetUpdatableProposalsQuery, GetUpdatableProposalsQueryVariables>;
export const GetCandidateProposalsDocument = new TypedDocumentString(`
    query GetCandidateProposals($first: Int!) {
  proposalCandidates(first: $first) {
    id
    slug
    proposer
    lastUpdatedTimestamp
    createdTransactionHash
    canceled
    versions {
      content {
        title
      }
    }
    latestVersion {
      content {
        title
        description
        targets
        values
        signatures
        calldatas
        encodedProposalHash
        proposalIdToUpdate
        contentSignatures {
          id
          signer {
            id
            proposals {
              id
            }
          }
          sig
          expirationTimestamp
          canceled
          reason
        }
        matchingProposalIds
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetCandidateProposalsQuery, GetCandidateProposalsQueryVariables>;
export const GetCandidateProposalDocument = new TypedDocumentString(`
    query GetCandidateProposal($id: ID!) {
  proposalCandidate(id: $id) {
    id
    slug
    proposer
    lastUpdatedTimestamp
    createdTransactionHash
    canceled
    versions {
      content {
        title
      }
    }
    latestVersion {
      content {
        title
        description
        targets
        values
        signatures
        calldatas
        encodedProposalHash
        proposalIdToUpdate
        contentSignatures {
          id
          signer {
            id
            proposals {
              id
            }
          }
          sig
          expirationTimestamp
          canceled
          reason
        }
        matchingProposalIds
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetCandidateProposalQuery, GetCandidateProposalQueryVariables>;
export const GetCandidateProposalVersionsDocument = new TypedDocumentString(`
    query GetCandidateProposalVersions($id: ID!) {
  proposalCandidate(id: $id) {
    id
    slug
    proposer
    lastUpdatedTimestamp
    canceled
    createdTransactionHash
    versions {
      id
      createdTimestamp
      updateMessage
      content {
        title
        description
        targets
        values
        signatures
        calldatas
        encodedProposalHash
      }
    }
    latestVersion {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<GetCandidateProposalVersionsQuery, GetCandidateProposalVersionsQueryVariables>;
export const GetProposalVersionsDocument = new TypedDocumentString(`
    query GetProposalVersions($id: ID!) {
  proposalVersions(where: {proposal_: {id: $id}}) {
    id
    createdAt
    updateMessage
    title
    description
    targets
    values
    signatures
    calldatas
    proposal {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<GetProposalVersionsQuery, GetProposalVersionsQueryVariables>;
export const GetAuctionDocument = new TypedDocumentString(`
    query GetAuction($id: ID!) {
  auction(id: $id) {
    id
    amount
    settled
    bidder {
      id
    }
    startTime
    endTime
    noun {
      id
      seed {
        id
        background
        body
        accessory
        head
        glasses
      }
      owner {
        id
      }
    }
    bids {
      id
      blockNumber
      txIndex
      amount
    }
  }
}
    `) as unknown as TypedDocumentString<GetAuctionQuery, GetAuctionQueryVariables>;
export const GetBidsByAuctionDocument = new TypedDocumentString(`
    query GetBidsByAuction($auctionId: String!) {
  bids(where: {auction: $auctionId}) {
    id
    amount
    blockNumber
    blockTimestamp
    txIndex
    bidder {
      id
    }
    noun {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<GetBidsByAuctionQuery, GetBidsByAuctionQueryVariables>;
export const GetNounDocument = new TypedDocumentString(`
    query GetNoun($id: ID!) {
  noun(id: $id) {
    id
    seed {
      background
      body
      accessory
      head
      glasses
    }
    owner {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<GetNounQuery, GetNounQueryVariables>;
export const GetNounsIndexDocument = new TypedDocumentString(`
    query GetNounsIndex {
  nouns {
    id
    owner {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<GetNounsIndexQuery, GetNounsIndexQueryVariables>;
export const GetLatestAuctionsDocument = new TypedDocumentString(`
    query GetLatestAuctions($first: Int = 1000, $skip: Int = 0) {
  auctions(orderBy: startTime, orderDirection: desc, first: $first, skip: $skip) {
    id
    amount
    settled
    bidder {
      id
    }
    startTime
    endTime
    noun {
      id
      owner {
        id
      }
    }
    bids {
      id
      amount
      blockNumber
      blockTimestamp
      txHash
      txIndex
      bidder {
        id
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetLatestAuctionsQuery, GetLatestAuctionsQueryVariables>;
export const GetLatestBidsDocument = new TypedDocumentString(`
    query GetLatestBids($first: Int!) {
  bids(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
    id
    bidder {
      id
    }
    amount
    blockTimestamp
    txIndex
    blockNumber
    auction {
      id
      startTime
      endTime
      settled
    }
  }
}
    `) as unknown as TypedDocumentString<GetLatestBidsQuery, GetLatestBidsQueryVariables>;
export const GetNounVotingHistoryDocument = new TypedDocumentString(`
    query GetNounVotingHistory($nounId: ID!, $first: Int!) {
  noun(id: $nounId) {
    id
    votes(first: $first) {
      blockNumber
      proposal {
        id
      }
      support
      supportDetailed
      voter {
        id
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetNounVotingHistoryQuery, GetNounVotingHistoryQueryVariables>;
export const GetNounTransferHistoryDocument = new TypedDocumentString(`
    query GetNounTransferHistory($nounId: String!, $first: Int!) {
  transferEvents(where: {noun: $nounId}, first: $first) {
    id
    previousHolder {
      id
    }
    newHolder {
      id
    }
    blockNumber
  }
}
    `) as unknown as TypedDocumentString<GetNounTransferHistoryQuery, GetNounTransferHistoryQueryVariables>;
export const GetNounDelegationHistoryDocument = new TypedDocumentString(`
    query GetNounDelegationHistory($nounId: String!, $first: Int!) {
  delegationEvents(where: {noun: $nounId}, first: $first) {
    id
    previousDelegate {
      id
    }
    newDelegate {
      id
    }
    blockNumber
  }
}
    `) as unknown as TypedDocumentString<GetNounDelegationHistoryQuery, GetNounDelegationHistoryQueryVariables>;
export const GetCreateTimestampAllProposalsDocument = new TypedDocumentString(`
    query GetCreateTimestampAllProposals {
  proposals(orderBy: createdTimestamp, orderDirection: asc, first: 1000) {
    id
    createdTimestamp
  }
}
    `) as unknown as TypedDocumentString<GetCreateTimestampAllProposalsQuery, GetCreateTimestampAllProposalsQueryVariables>;
export const GetProposalVotesDocument = new TypedDocumentString(`
    query GetProposalVotes($proposalId: String!) {
  votes(where: {proposal: $proposalId, votesRaw_gt: 0}) {
    supportDetailed
    voter {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<GetProposalVotesQuery, GetProposalVotesQueryVariables>;
export const GetDelegateNounsAtBlockDocument = new TypedDocumentString(`
    query GetDelegateNounsAtBlock($delegates: [ID!]!, $block: Int!) {
  delegates(where: {id_in: $delegates}, block: {number: $block}) {
    id
    nounsRepresented {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<GetDelegateNounsAtBlockQuery, GetDelegateNounsAtBlockQueryVariables>;
export const GetCurrentlyDelegatedNounsDocument = new TypedDocumentString(`
    query GetCurrentlyDelegatedNouns($delegate: ID!) {
  delegates(where: {id: $delegate}) {
    id
    nounsRepresented {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<GetCurrentlyDelegatedNounsQuery, GetCurrentlyDelegatedNounsQueryVariables>;
export const GetAdjustedNounSupplyAtPropSnapshotDocument = new TypedDocumentString(`
    query GetAdjustedNounSupplyAtPropSnapshot($proposalId: ID!) {
  proposals(where: {id: $proposalId}) {
    adjustedTotalSupply
  }
}
    `) as unknown as TypedDocumentString<GetAdjustedNounSupplyAtPropSnapshotQuery, GetAdjustedNounSupplyAtPropSnapshotQueryVariables>;
export const GetPropUsingDynamicQuorumDocument = new TypedDocumentString(`
    query GetPropUsingDynamicQuorum($proposalId: ID!) {
  proposal(id: $proposalId) {
    quorumCoefficient
  }
}
    `) as unknown as TypedDocumentString<GetPropUsingDynamicQuorumQuery, GetPropUsingDynamicQuorumQueryVariables>;
export const GetProposalFeedbacksDocument = new TypedDocumentString(`
    query GetProposalFeedbacks($proposalId: ID!) {
  proposalFeedbacks(where: {proposal_: {id: $proposalId}}) {
    supportDetailed
    votes
    reason
    createdTimestamp
    voter {
      id
    }
    proposal {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<GetProposalFeedbacksQuery, GetProposalFeedbacksQueryVariables>;
export const GetCandidateFeedbacksDocument = new TypedDocumentString(`
    query GetCandidateFeedbacks($candidateId: ID!) {
  candidateFeedbacks(where: {candidate_: {id: $candidateId}}) {
    supportDetailed
    votes
    reason
    createdTimestamp
    voter {
      id
    }
    candidate {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<GetCandidateFeedbacksQuery, GetCandidateFeedbacksQueryVariables>;
export const GetOwnedNounsDocument = new TypedDocumentString(`
    query GetOwnedNouns($owner: ID!) {
  nouns(where: {owner_: {id: $owner}}) {
    id
  }
}
    `) as unknown as TypedDocumentString<GetOwnedNounsQuery, GetOwnedNounsQueryVariables>;
export const GetAccountEscrowedNounsDocument = new TypedDocumentString(`
    query GetAccountEscrowedNouns($owner: ID!) {
  escrowedNouns(where: {owner_: {id: $owner}}, first: 1000) {
    noun {
      id
    }
    fork {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<GetAccountEscrowedNounsQuery, GetAccountEscrowedNounsQueryVariables>;
export const GetEscrowDepositEventsDocument = new TypedDocumentString(`
    query GetEscrowDepositEvents($forkId: String!) {
  escrowDeposits(where: {fork: $forkId, tokenIDs_not: []}, first: 1000) {
    id
    createdAt
    owner {
      id
    }
    reason
    tokenIDs
    proposalIDs
  }
}
    `) as unknown as TypedDocumentString<GetEscrowDepositEventsQuery, GetEscrowDepositEventsQueryVariables>;
export const GetForkJoinsDocument = new TypedDocumentString(`
    query GetForkJoins($forkId: String!) {
  forkJoins(where: {fork: $forkId, tokenIDs_not: []}, first: 1000) {
    id
    createdAt
    owner {
      id
    }
    reason
    tokenIDs
    proposalIDs
  }
}
    `) as unknown as TypedDocumentString<GetForkJoinsQuery, GetForkJoinsQueryVariables>;
export const GetEscrowWithdrawEventsDocument = new TypedDocumentString(`
    query GetEscrowWithdrawEvents($forkId: String!) {
  escrowWithdrawals(where: {fork: $forkId, tokenIDs_not: []}, first: 1000) {
    id
    createdAt
    owner {
      id
    }
    tokenIDs
  }
}
    `) as unknown as TypedDocumentString<GetEscrowWithdrawEventsQuery, GetEscrowWithdrawEventsQueryVariables>;
export const GetProposalTitlesDocument = new TypedDocumentString(`
    query GetProposalTitles($ids: [ID!]!) {
  proposals(where: {id_in: $ids}) {
    id
    title
  }
}
    `) as unknown as TypedDocumentString<GetProposalTitlesQuery, GetProposalTitlesQueryVariables>;
export const GetForkDetailsDocument = new TypedDocumentString(`
    query GetForkDetails($id: ID!) {
  fork(id: $id) {
    id
    forkID
    executed
    executedAt
    forkTreasury
    forkToken
    tokensForkingCount
    tokensInEscrowCount
    forkingPeriodEndTimestamp
    escrowedNouns(first: 1000) {
      noun {
        id
      }
    }
    joinedNouns(first: 1000) {
      noun {
        id
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetForkDetailsQuery, GetForkDetailsQueryVariables>;
export const GetForksDocument = new TypedDocumentString(`
    query GetForks {
  forks {
    id
    forkID
    executed
    executedAt
    forkTreasury
    forkToken
    tokensForkingCount
    tokensInEscrowCount
    forkingPeriodEndTimestamp
  }
}
    `) as unknown as TypedDocumentString<GetForksQuery, GetForksQueryVariables>;
export const GetIsForkActiveDocument = new TypedDocumentString(`
    query GetIsForkActive($currentTimestamp: BigInt!) {
  forks(where: {executed: true, forkingPeriodEndTimestamp_gt: $currentTimestamp}) {
    forkID
    forkingPeriodEndTimestamp
  }
}
    `) as unknown as TypedDocumentString<GetIsForkActiveQuery, GetIsForkActiveQueryVariables>;