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
  token: {
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
  nRepresented: {
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
    punkType
    skinTone
    accessory_types
    accessory_ids
  }
}
`;

export const proposalsQuery = (first = 1_000) => gql`
{
  proposals(first: ${first}, orderBy: createdBlock, orderDirection: asc) {
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
	  punk {
		id
		seed {
		  id
          punkType
          skinTone
          accessory_types
          accessory_ids
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
	  punk {
		id
	  }
	}
  }
 `;

export const nQuery = (id: string) => gql`
 {
	punk(id:"${id}") {
	  id
	  seed {
        punkType
        skinTone
        accessory_types
        accessory_ids
	  }
	  owner {
		id
	  }
	}
  }
 `;

export const tokensIndex = () => gql`
  {
    punks {
      id
      owner {
        id
      }
    }
  }
`;

export const ogpunksByOwner = (address: string) => gql`
 {
    ogpunks(where:{owner:"${address}"}) {
      id
      delegate {
        id
      }
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
      punk {
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

export const nVotingHistoryQuery = (tokenId: number) => gql`
{
	punk(id: ${tokenId}) {
        id
        votes {
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

export const nTransferHistoryQuery = (tokenId: number) => gql`
{
  transferEvents(where: {id: "${tokenId}"}) {
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

export const nDelegationHistoryQuery = (tokenId: number) => gql`
{
  delegationEvents(where: {id: "${tokenId}"}) {
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

export const delegateTokensAtBlockQuery = (delegates: string[], block: number) => gql`
{
  delegates(where: { id_in: ${JSON.stringify(delegates)} }, block: { number: ${block} }) {
    id
    nRepresented {
      id
    }
  }
}
`;

export const currentlyDelegatedTokens = (delegate: string) => gql`
{
  delegates(where: { id: "${delegate}"} ) {
    id
    nRepresented {
      id
    }
  }
}
`;

export const clientFactory = (uri: string) =>
  new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });
