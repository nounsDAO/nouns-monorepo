import { ApolloClient, ApolloLink, gql, HttpLink, InMemoryCache } from '@apollo/client';
import { BigNumberish } from '@/utils/types';

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
  `,
  variables: { first },
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
  `,
  variables: { first },
});

export const activePendingUpdatableProposersQuery = (first = 1_000, currentBlock?: number) => ({
  query: gql`
    query GetActivePendingUpdatableProposers($first: Int!, $currentBlock: BigInt!) {
      proposals(
        first: $first
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
  variables: { first, currentBlock: currentBlock || 0 },
});

export const updatableProposalsQuery = (first = 1_000, currentBlock?: number) => ({
  query: gql`
    query GetUpdatableProposals($first: Int!, $currentBlock: BigInt!) {
      proposals(
        first: $first
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
  variables: { first, currentBlock: currentBlock || 0 },
});

export const candidateProposalsQuery = (first = 1_000) => ({
  query: gql`
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
  `,
  variables: { first },
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

export const auctionQuery = (auctionId: number) => ({
  query: gql`
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
  `,
  variables: { id: auctionId },
});

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

export const latestAuctionsQuery = () => ({
  query: gql`
    query GetLatestAuctions {
      auctions(orderBy: startTime, orderDirection: desc, first: 1000) {
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
  `,
  variables: {},
});

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

export const createTimestampAllProposals = () => ({
  query: gql`
    query GetCreateTimestampAllProposals {
      proposals(orderBy: createdTimestamp, orderDirection: asc, first: 1000) {
        id
        createdTimestamp
      }
    }
  `,
  variables: {},
});

export const proposalVotesQuery = (proposalId: string) => ({
  query: gql`
    query GetProposalVotes($proposalId: String!) {
      votes(where: { proposal: $proposalId, votesRaw_gt: 0 }) {
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
    query GetDelegateNounsAtBlock($delegates: [ID!]!, $block: Int!) {
      delegates(where: { id_in: $delegates }, block: { number: $block }) {
        id
        nounsRepresented {
          id
        }
      }
    }
  `,
  variables: { delegates, block: Number(block) },
});

export const currentlyDelegatedNouns = (delegate: string) => ({
  query: gql`
    query GetCurrentlyDelegatedNouns($delegate: ID!) {
      delegates(where: { id: $delegate }) {
        id
        nounsRepresented {
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

export const clientFactory = (uri: string) => {
  return new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });
};

export const proposalFeedbacksQuery = (proposalId: string) => ({
  query: gql`
    query GetProposalFeedbacks($proposalId: ID!) {
      proposalFeedbacks(where: { proposal_: { id: $proposalId } }) {
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
    query GetCandidateFeedbacks($candidateId: ID!) {
      candidateFeedbacks(where: { candidate_: { id: $candidateId } }) {
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
    query GetOwnedNouns($owner: ID!) {
      nouns(where: { owner_: { id: $owner } }) {
        id
      }
    }
  `,
  variables: { owner },
});

export const accountEscrowedNounsQuery = (owner: string) => ({
  query: gql`
    query GetAccountEscrowedNouns($owner: ID!) {
      escrowedNouns(where: { owner_: { id: $owner } }, first: 1000) {
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
    query GetEscrowDepositEvents($forkId: String!) {
      escrowDeposits(where: { fork: $forkId, tokenIDs_not: [] }, first: 1000) {
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
    query GetForkJoins($forkId: String!) {
      forkJoins(where: { fork: $forkId, tokenIDs_not: [] }, first: 1000) {
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
    query GetEscrowWithdrawEvents($forkId: String!) {
      escrowWithdrawals(where: { fork: $forkId, tokenIDs_not: [] }, first: 1000) {
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
    query GetProposalTitles($ids: [ID!]!) {
      proposals(where: { id_in: $ids }) {
        id
        title
      }
    }
  `,
  variables: { ids },
});

export const forkDetailsQuery = (id: string) => ({
  query: gql`
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
  `,
  variables: { id },
});

export const forksQuery = () => ({
  query: gql`
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
  `,
  variables: {},
});

export const isForkActiveQuery = (currentTimestamp: number) => ({
  query: gql`
    query GetIsForkActive($currentTimestamp: BigInt!) {
      forks(where: { executed: true, forkingPeriodEndTimestamp_gt: $currentTimestamp }) {
        forkID
        forkingPeriodEndTimestamp
      }
    }
  `,
  variables: { currentTimestamp },
});
