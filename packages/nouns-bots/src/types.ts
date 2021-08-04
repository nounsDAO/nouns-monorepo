export interface Bid {
  id: string;
  amount: string;
}

export interface AuctionBids {
  id: number;
  bids: Bid[];
}

export interface TokenMetadata {
  name: string;
  description: string;
  image: string;
}
