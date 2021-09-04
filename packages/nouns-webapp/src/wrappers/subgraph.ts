import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import BigNumber from 'bignumber.js';

export interface IBid {
  amount: BigNumber;
  bidder: {
    id: string;
  };
  blockNumber: number;
  blockTimestamp: number;
  id: string;
  noun: {
    id: number;
  };
}

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

export const latestAuctionsQuery = (first: number = 50) => gql`
 {
	auctions(orderDirection: desc, first: ${first}) {
	  id
	  amount
	  settled
	  startTime
	  endTime
	  noun {
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
