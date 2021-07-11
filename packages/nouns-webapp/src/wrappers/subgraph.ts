import {
	ApolloClient,
	InMemoryCache,
	gql
} from "@apollo/client";

export const auctionQuery = gql`
{
	auction(id: 1) {
	  id
	  amount
	  settled
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
  `

 export const bidsByAuctionQuery = (auctionId: string) => gql`
 {
	bids(where:{auction: "${auctionId}"}) {
	  id
	  amount
	  blockNumber
	  txIndex
	  bidder {
	  	id
	  }
	  noun {
		id
	  }
	}
  }
 `

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
 `

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
`

export const clientFactory = (uri: string) => new ApolloClient({
	uri,
	cache: new InMemoryCache()
});