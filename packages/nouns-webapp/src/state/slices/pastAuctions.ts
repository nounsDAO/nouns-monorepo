import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuctionState } from './auction';

import { IBid } from '@/wrappers/subgraph';

interface PastAuctionsState {
  pastAuctions: AuctionState[];
}

const initialState: PastAuctionsState = {
  pastAuctions: [],
};

const reduxSafePastAuctions = (data: any): AuctionState[] => {
  const auctions = data.data.auctions as any[];
  if (auctions.length == 0) return [];
  return auctions.map(auction => {
    return {
      activeAuction: {
        amount: BigInt(auction.amount).toString(),
        bidder: auction.bidder ? auction.bidder.id : '',
        startTime: BigInt(auction.startTime).toString(),
        endTime: BigInt(auction.endTime).toString(),
        nounId: BigInt(auction.id).toString(),
        settled: false,
      },
      bids: auction.bids.map((bid: IBid) => {
        return {
          nounId: BigInt(auction.id).toString(),
          sender: bid.bidder.id,
          value: BigInt(bid.amount).toString(),
          extended: false,
          transactionHash: bid.txHash,
          transactionIndex: Number(bid.txIndex),
          timestamp: BigInt(bid.blockTimestamp).toString(),
        };
      }),
    };
  });
};

const pastAuctionsSlice = createSlice({
  name: 'pastAuctions',
  initialState: initialState,
  reducers: {
    addPastAuctions: (state, action: PayloadAction<any>) => {
      state.pastAuctions = reduxSafePastAuctions(action.payload);
    },
  },
});

export const { addPastAuctions } = pastAuctionsSlice.actions;

export default pastAuctionsSlice.reducer;
