import { ApolloClient, ApolloLink, gql, HttpLink, InMemoryCache } from '@apollo/client';

import { graphql } from '@/subgraphs';
import { BigNumberish } from '@/utils/types';

export const clientFactory = (uri: string) => {
  // patch BigInt JSON serialization (runs once)
  if (
    typeof BigInt !== 'undefined' &&
    !(BigInt.prototype as unknown as { toJSON?: () => string }).toJSON
  ) {
    (BigInt.prototype as unknown as { toJSON?: () => string }).toJSON = function () {
      return this.toString();
    };
  }

  // scrub nested BigInts even before cache
  const scrubBigIntLink = new ApolloLink((operation, forward) =>
    forward(operation)!.map(result =>
      JSON.parse(JSON.stringify(result, (_k, v) => (typeof v === 'bigint' ? v.toString() : v))),
    ),
  );

  return new ApolloClient({
    link: ApolloLink.from([scrubBigIntLink, new HttpLink({ uri })]),
    cache: new InMemoryCache(),
  });
};

export interface IBid {
  id: string;
  bidder: {
    id: string;
  };
  amount: bigint;
  blockNumber: number;
  blockTimestamp: number;
  txHash: string;
  txIndex?: number;
  noun: {
    id: number;
    startTime?: BigNumberish;
    endTime?: BigNumberish;
    settled?: boolean;
  };
}

interface ProposalVote {
  supportDetailed: 0 | 1 | 2;
  voter: {
    id: string;
  };
}

export interface ProposalVotes {
  votes: ProposalVote[];
}

export interface Delegate {
  id: string;
  nounsRepresented: {
    id: string;
  }[];
}

export interface Delegates {
  delegates: Delegate[];
}

export const seedsQuery = (first = 1_000) => ({
  query: gql`
    query GetSeeds($first: Int!, $skip: Int!) {
      seeds(first: $first, skip: $skip, orderBy: id, orderDirection: asc) {
        id
        background
        body
        accessory
        head
        glasses
      }
    }
  `,
  variables: { first, skip: 0 },
});

export const proposalQuery = (id: string | number) => ({
  query: gql`
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
  `,
  variables: { id },
});

export const partialProposalsQuery = (first = 1_000) => ({
  query: gql`
    query GetPartialProposals($first: Int!, $skip: Int!) {
      proposals(first: $first, skip: $skip, orderBy: createdBlock, orderDirection: asc) {
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
  `,
  variables: { first, skip: 0 },
});

export const activePendingUpdatableProposersQuery = (first = 1_000, currentBlock: bigint = 0n) => ({
  query: gql`
    query GetActivePendingUpdatableProposers($first: Int!, $currentBlock: BigInt!, $skip: Int!) {
      proposals(
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: asc
        where: {
          or: [
            { status: PENDING, endBlock_gt: $currentBlock }
            { status: ACTIVE, endBlock_gt: $currentBlock }
          ]
        }
      ) {
        proposer {
          id
        }
        signers {
          id
        }
      }
    }
  `,
  variables: { first, currentBlock, skip: 0 },
});

export const updatableProposalsQuery = (first = 1_000, currentBlock: bigint = 0n) => ({
  query: gql`
    query GetUpdatableProposals($first: Int!, $currentBlock: BigInt!, $skip: Int!) {
      proposals(
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: asc
        where: {
          status: PENDING
          endBlock_gt: $currentBlock
          updatePeriodEndBlock_gt: $currentBlock
        }
      ) {
        id
      }
    }
  `,
  variables: { first, currentBlock: currentBlock || 0, skip: 0 },
});

export const candidateProposalsQuery = (first = 50, skip = 0) => ({
  query: gql`
    query GetCandidateProposals($first: Int!, $skip: Int!) {
      proposalCandidates(
        first: $first
        skip: $skip
        orderBy: lastUpdatedTimestamp
        orderDirection: desc
        where: { canceled: false }
      ) {
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
  `,
  variables: { first, skip },
});

export const candidateProposalQuery = (id: string) => ({
  query: gql`
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
  `,
  variables: { id },
});

export const candidateProposalVersionsQuery = (id: string) => ({
  query: gql`
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
  `,
  variables: { id },
});

export const proposalVersionsQuery = (id: string | number) => ({
  query: gql`
    query GetProposalVersions($id: ID!) {
      proposalVersions(where: { proposal_: { id: $id } }) {
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
  `,
  variables: { id },
});

export const auctionQuery = graphql(`
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
`);

export const bidsByAuctionQuery = (auctionId: string) => ({
  query: gql`
    query GetBidsByAuction($auctionId: String!) {
      bids(where: { auction: $auctionId }) {
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
  `,
  variables: { auctionId },
});

export const nounQuery = (id: string) => ({
  query: gql`
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
  `,
  variables: { id },
});

export const nounsIndex = () => ({
  query: gql`
    query GetNounsIndex {
      nouns {
        id
        owner {
          id
        }
      }
    }
  `,
  variables: {},
});

export const latestAuctionsQuery = graphql(`
  query GetLatestAuctions($first: Int = 1000, $skip: Int = 0, $nestedSkip: Int = 0) {
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
      bids(first: $first, skip: $nestedSkip, orderBy: id, orderDirection: asc) {
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
`);

export const auctionBidPagesQuery = gql`
  query GetAuctionBidPages($id: ID!, $first: Int!, $nestedSkip: Int!) {
    auction(id: $id) {
      id
      bids(first: $first, skip: $nestedSkip, orderBy: id, orderDirection: asc) {
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
`;

export const latestBidsQuery = (first = 10) => ({
  query: gql`
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
  `,
  variables: { first },
});

export const nounVotingHistoryQuery = (nounId: number, first = 1_000) => ({
  query: gql`
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
  `,
  variables: { nounId, first },
});

export const nounTransferHistoryQuery = (nounId: number, first = 1_000) => ({
  query: gql`
    query GetNounTransferHistory($nounId: String!, $first: Int!) {
      transferEvents(where: { noun: $nounId }, first: $first) {
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
  `,
  variables: { nounId, first },
});

export const nounDelegationHistoryQuery = (nounId: number, first = 1_000) => ({
  query: gql`
    query GetNounDelegationHistory($nounId: String!, $first: Int!) {
      delegationEvents(where: { noun: $nounId }, first: $first) {
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
  `,
  variables: { nounId, first },
});

export const createTimestampAllProposals = (first = 1_000, skip = 0) => ({
  query: gql`
    query GetCreateTimestampAllProposals($first: Int!, $skip: Int!) {
      proposals(orderBy: createdTimestamp, orderDirection: asc, first: $first, skip: $skip) {
        id
        createdTimestamp
      }
    }
  `,
  variables: { first, skip },
});

export const proposalVotesQuery = (proposalId: string) => ({
  query: gql`
    query GetProposalVotes($proposalId: String!, $first: Int!, $skip: Int!) {
      votes(
        where: { proposal: $proposalId, votesRaw_gt: 0 }
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: asc
      ) {
        supportDetailed
        voter {
          id
        }
      }
    }
  `,
  variables: { proposalId },
});

export const delegateNounsAtBlockQuery = (delegates: string[], block: bigint) => ({
  query: gql`
    query GetDelegateNounsAtBlock(
      $delegates: [ID!]!
      $block: Int!
      $first: Int!
      $skip: Int!
      $nestedSkip: Int!
    ) {
      delegates(
        where: { id_in: $delegates }
        block: { number: $block }
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: asc
      ) {
        id
        nounsRepresented(first: $first, skip: $nestedSkip, orderBy: id, orderDirection: asc) {
          id
        }
      }
    }
  `,
  variables: { delegates, block: Number(block) },
});

export const currentlyDelegatedNouns = (delegate: string) => ({
  query: gql`
    query GetCurrentlyDelegatedNouns($delegate: ID!, $first: Int!, $skip: Int!, $nestedSkip: Int!) {
      delegates(
        where: { id: $delegate }
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: asc
      ) {
        id
        nounsRepresented(first: $first, skip: $nestedSkip, orderBy: id, orderDirection: asc) {
          id
        }
      }
    }
  `,
  variables: { delegate },
});

export const adjustedNounSupplyAtPropSnapshot = (proposalId: string) => ({
  query: gql`
    query GetAdjustedNounSupplyAtPropSnapshot($proposalId: ID!) {
      proposals(where: { id: $proposalId }) {
        adjustedTotalSupply
      }
    }
  `,
  variables: { proposalId },
});

export const propUsingDynamicQuorum = (proposalId: string) => ({
  query: gql`
    query GetPropUsingDynamicQuorum($proposalId: ID!) {
      proposal(id: $proposalId) {
        quorumCoefficient
      }
    }
  `,
  variables: { proposalId },
});

export const proposalFeedbacksQuery = (proposalId: string) => ({
  query: gql`
    query GetProposalFeedbacks($proposalId: ID!, $first: Int!, $skip: Int!) {
      proposalFeedbacks(
        where: { proposal_: { id: $proposalId } }
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: asc
      ) {
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
  `,
  variables: { proposalId },
});
export const candidateFeedbacksQuery = (candidateId: string) => ({
  query: gql`
    query GetCandidateFeedbacks($candidateId: ID!, $first: Int!, $skip: Int!) {
      candidateFeedbacks(
        where: { candidate_: { id: $candidateId } }
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: asc
      ) {
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
  `,
  variables: { candidateId },
});

export const ownedNounsQuery = (owner: string) => ({
  query: gql`
    query GetOwnedNouns($owner: ID!, $first: Int!, $skip: Int!) {
      nouns(
        where: { owner_: { id: $owner } }
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: asc
      ) {
        id
      }
    }
  `,
  variables: { owner },
});

export const accountEscrowedNounsQuery = (owner: string) => ({
  query: gql`
    query GetAccountEscrowedNouns($owner: ID!, $first: Int!, $skip: Int!) {
      escrowedNouns(
        where: { owner_: { id: $owner } }
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: asc
      ) {
        noun {
          id
        }
        fork {
          id
        }
      }
    }
  `,
  variables: { owner },
});

export const escrowDepositEventsQuery = (forkId: string) => ({
  query: gql`
    query GetEscrowDepositEvents($forkId: String!, $first: Int!, $skip: Int!) {
      escrowDeposits(
        where: { fork: $forkId, tokenIDs_not: [] }
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: asc
      ) {
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
  `,
  variables: { forkId },
});
export const forkJoinsQuery = (forkId: string) => ({
  query: gql`
    query GetForkJoins($forkId: String!, $first: Int!, $skip: Int!) {
      forkJoins(
        where: { fork: $forkId, tokenIDs_not: [] }
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: asc
      ) {
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
  `,
  variables: { forkId },
});

export const escrowWithdrawEventsQuery = (forkId: string) => ({
  query: gql`
    query GetEscrowWithdrawEvents($forkId: String!, $first: Int!, $skip: Int!) {
      escrowWithdrawals(
        where: { fork: $forkId, tokenIDs_not: [] }
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: asc
      ) {
        id
        createdAt
        owner {
          id
        }
        tokenIDs
      }
    }
  `,
  variables: { forkId },
});

export const proposalTitlesQuery = (ids: number[]) => ({
  query: gql`
    query GetProposalTitles($ids: [ID!]!, $first: Int!, $skip: Int!) {
      proposals(
        where: { id_in: $ids }
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: asc
      ) {
        id
        title
      }
    }
  `,
  variables: { ids, first: 1_000, skip: 0 },
});

export const forkDetailsQuery = (id: string) => ({
  query: gql`
    query GetForkDetails($id: ID!, $first: Int!, $nestedSkip: Int!) {
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
        escrowedNouns(first: $first, skip: $nestedSkip, orderBy: id, orderDirection: asc) {
          noun {
            id
          }
        }
        joinedNouns(first: $first, skip: $nestedSkip, orderBy: id, orderDirection: asc) {
          noun {
            id
          }
        }
      }
    }
  `,
  variables: { id },
});

export const forksQuery = () => ({
  query: gql`
    query GetForks($first: Int!, $skip: Int!) {
      forks(first: $first, skip: $skip, orderBy: id, orderDirection: asc) {
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
  `,
  variables: {},
});

export const isForkActiveQuery = (currentTimestamp: number) => ({
  query: gql`
    query GetIsForkActive($currentTimestamp: BigInt!, $first: Int!, $skip: Int!) {
      forks(
        where: { executed: true, forkingPeriodEndTimestamp_gt: $currentTimestamp }
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: asc
      ) {
        forkID
        forkingPeriodEndTimestamp
      }
    }
  `,
  variables: { currentTimestamp },
});
