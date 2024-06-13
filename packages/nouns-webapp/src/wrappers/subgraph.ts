import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { BigNumberish } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

export interface IBid {
  id: string;
  bidder: {
    id: string;
  };
  amount: BigNumber;
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

export const seedsQuery = (first = 1_000) => gql`
{
  seeds(first: ${first}) {
    id
    background
    body
    accessory
    head
    glasses
  }
}
`;

export const proposalQuery = (id: string | number) => gql`
{
  proposal(id: ${id}) {
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
`;

export const partialProposalsQuery = (first = 1_000) => gql`
{
  proposals(first: ${first}, orderBy: createdBlock, orderDirection: asc) {
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
`;

export const activePendingUpdatableProposersQuery = (first = 1_000, currentBlock?: number) => gql`
{
  proposals(
    where: {
      or: [{status: PENDING, endBlock_gt: ${currentBlock}}, {status: ACTIVE, endBlock_gt: ${currentBlock}}], 
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
`;

export const updatableProposalsQuery = (first = 1_000, currentBlock?: number) => gql`
{
  proposals(
    where: {
    	status: PENDING, endBlock_gt: ${currentBlock}, updatePeriodEndBlock_gt: ${currentBlock},      
    }
    ) {
      id
  }
}
`;

export const candidateProposalsQuery = (first = 1_000) => gql`
  {
    proposalCandidates(first: ${first}) {
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
        matchingProposalIds {
          id
        }
      }
    }
    }
  }
`;

export const candidateProposalQuery = (id: string) => gql`
{
  proposalCandidate(id: "${id}") {
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
        matchingProposalIds {
          id
        }
      }
    }
  }
}
`;

export const candidateProposalVersionsQuery = (id: string) => gql`
{
  proposalCandidate(id: "${id}") {
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
`;

export const proposalVersionsQuery = (id: string | number) => gql`
  {
    proposalVersions(where: { proposal_: { id: "${id}" } }) {
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
`;

export const auctionQuery = (auctionId: number) => gql`
{
	auction(id: ${auctionId}) {
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
`;

export const bidsByAuctionQuery = (auctionId: string) => gql`
 {
	bids(where:{auction: "${auctionId}"}) {
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
 `;

export const nounQuery = (id: string) => gql`
 {
	noun(id:"${id}") {
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
 `;

export const nounsIndex = () => gql`
  {
    nouns {
      id
      owner {
        id
      }
    }
  }
`;

export const latestAuctionsQuery = () => gql`
  {
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
`;

export const latestBidsQuery = (first: number = 10) => gql`
{
	bids(
	  first: ${first},
	  orderBy:blockTimestamp,
	  orderDirection: desc
	) {
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
`;

export const nounVotingHistoryQuery = (nounId: number, first = 1_000) => gql`
{
	noun(id: ${nounId}) {
		id
		votes(first: ${first}) {
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
`;

export const nounTransferHistoryQuery = (nounId: number, first = 1_000) => gql`
{
  transferEvents(where: {noun: "${nounId}"}, first: ${first}) {
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
`;

export const nounDelegationHistoryQuery = (nounId: number, first = 1_000) => gql`
{
  delegationEvents(where: {noun: "${nounId}"}, first: ${first}) {
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
`;

export const createTimestampAllProposals = () => gql`
  {
    proposals(orderBy: createdTimestamp, orderDirection: asc, first: 1000) {
      id
      createdTimestamp
    }
  }
`;

export const proposalVotesQuery = (proposalId: string) => gql`
  {
    votes(where: { proposal: "${proposalId}", votesRaw_gt: 0 }) {
      supportDetailed
      voter {
        id
      }

    }	
  }
`;

export const delegateNounsAtBlockQuery = (delegates: string[], block: number) => {
  return gql`
{
  delegates(where: { id_in: ${JSON.stringify(delegates)} }, block: { number: ${block} }) {
    id
    nounsRepresented {
      id
    }
  }
}
`;
};

export const currentlyDelegatedNouns = (delegate: string) => gql`
{
  delegates(where: { id: "${delegate}"} ) {
    id
    nounsRepresented {
      id
    }
  }
}
`;

export const adjustedNounSupplyAtPropSnapshot = (proposalId: string) => gql`
{
  proposals(where: {id: ${proposalId}}) {
    adjustedTotalSupply
  }
}
`;

export const propUsingDynamicQuorum = (propoaslId: string) => gql`
{
  proposal(id: "${propoaslId}") {
    quorumCoefficient 
  }
}
`;

export const clientFactory = (uri: string) =>
  new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });

export const proposalFeedbacksQuery = (proposalId: string) => gql`
  {
    proposalFeedbacks(where: {proposal_:{id: "${proposalId}"}}) {
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
`;
export const candidateFeedbacksQuery = (candidateId: string) => gql`
  {
    candidateFeedbacks(where: {candidate_:{id: "${candidateId}"}}) {
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
`;

export const ownedNounsQuery = (owner: string) => gql`
  {
    nouns(where: {owner_: {id: "${owner}"}}) {
      id      
    }
  }
`;

export const accountEscrowedNounsQuery = (owner: string, forkId: string) => gql`
  {
    escrowedNouns(where: {owner_: {id: "${owner}"}}, first: 1000) {
      noun {
        id
      }
      fork {
        id
      }
    }
  }
`;

export const escrowDepositEventsQuery = (forkId: string) => gql`
  {
    escrowDeposits (where: {fork: "${forkId}", tokenIDs_not: []}, first: 1000) {
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
`;
export const forkJoinsQuery = (forkId: string) => gql`
  {
    forkJoins (where: {fork: "${forkId}", tokenIDs_not: []}, first: 1000) {
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
`;

export const escrowWithdrawEventsQuery = (forkId: string) => gql`
  {
    escrowWithdrawals (where: {fork: "${forkId}", tokenIDs_not: []}, first: 1000) {
      id 
      createdAt
      owner {
        id
      }
      tokenIDs
    }
  }
`;

export const proposalTitlesQuery = (ids: number[]) => {
  return gql`
  {
    proposals(where: {id_in: [${ids?.join(',')}]}) {
      id
      title
    }
  }
`;
};

export const forkDetailsQuery = (id: string) => gql`
  {
    fork(id: ${id}) {
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
  }`;

export const forksQuery = () => gql`
  {
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
`;

export const isForkActiveQuery = (currentTimestamp: number) => gql`
{
  forks(where: {executed:true, forkingPeriodEndTimestamp_gt:${currentTimestamp}}) {
    forkID
    forkingPeriodEndTimestamp
  }
}
`;
