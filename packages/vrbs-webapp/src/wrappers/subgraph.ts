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
  txIndex?: number;
  vrb: {
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
  vrbsRepresented: {
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
    startBlock
    endBlock
    executionETA
    targets
    values
    signatures
    calldatas
    proposer {
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
	  vrb {
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
	  vrb {
		id
	  }
	}
  }
 `;

export const vrbQuery = (id: string) => gql`
 {
	vrb(id:"${id}") {
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

export const vrbsIndex = () => gql`
  {
    vrbs {
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
      vrb {
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

export const vrbVotingHistoryQuery = (vrbId: number, first = 1_000) => gql`
{
	vrb(id: ${vrbId}) {
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

export const vrbTransferHistoryQuery = (vrbId: number, first = 1_000) => gql`
{
  transferEvents(where: {vrb: "${vrbId}"}, first: ${first}) {
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

export const vrbDelegationHistoryQuery = (vrbId: number, first = 1_000) => gql`
{
  delegationEvents(where: {vrb: "${vrbId}"}, first: ${first}) {
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

export const delegateVrbsAtBlockQuery = (delegates: string[], block: number) => gql`
{
  delegates(where: { id_in: ${JSON.stringify(delegates)} }, block: { number: ${block} }) {
    id
    vrbsRepresented {
      id
    }
  }
}
`;

export const currentlyDelegatedVrbs = (delegate: string) => gql`
{
  delegates(where: { id: "${delegate}"} ) {
    id
    vrbsRepresented {
      id
    }
  }
}
`;

export const totalVrbSupplyAtPropSnapshot = (proposalId: string) => gql`
{
  proposals(where: {id: ${proposalId}}) {
    totalSupply
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
