import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GetLatestAuctionsQuery } from '@/subgraphs/graphql';
import { Address } from '@/utils/types';

import { AuctionState } from './auction';

interface PastAuctionsState {
  pastAuctions: AuctionState[];
}

const initialState: PastAuctionsState = {
  pastAuctions: [],
};

const reduxSafePastAuctions = (data: GetLatestAuctionsQuery): AuctionState[] => {
  const auctions = data.auctions;
  if (!auctions) return [];
  return auctions.map(auction => {
    return {
      activeAuction: {
        amount: auction.amount ? BigInt(auction.amount).toString() : undefined,
        bidder: auction.bidder ? (auction.bidder.id as Address) : undefined,
        startTime: BigInt(auction.startTime).toString(),
        endTime: BigInt(auction.endTime).toString(),
        nounId: BigInt(auction.id).toString(),
        settled: false,
      },
      bids: auction.bids.map(bid => {
        return {
          nounId: BigInt(auction.id).toString(),
          sender: bid?.bidder?.id as Address,
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
    addPastAuctions: (state, action: PayloadAction<GetLatestAuctionsQuery>) => {
      state.pastAuctions = reduxSafePastAuctions(action.payload);
    },
  },
});

export const { addPastAuctions } = pastAuctionsSlice.actions;

export default pastAuctionsSlice.reducer;
