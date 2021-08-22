export interface Bid {
  id: string;
  amount: string;
}

export interface AuctionBids {
  id: number;
  endTime: number;
  bids: Bid[];
}

export interface TokenMetadata {
  name: string;
  description: string;
  image: string;
}

export interface IAuctionLifecycleHandler {
  handleNewAuction(auctionId: number): Promise<void>;
  handleNewBid(auctionId: number, bid: Bid): Promise<void>;
  handleAuctionEndingSoon(auctionId: number): Promise<void>;
}
