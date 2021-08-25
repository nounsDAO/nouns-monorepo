import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuctionState } from './auction';
import { BigNumber } from '@ethersproject/bignumber';

interface PastAuctionsState {
  pastAuctions: AuctionState[];
}

const initialState: PastAuctionsState = {
  pastAuctions: [],
};

const reduxSafePastAuctions = (data: any): AuctionState[] => {
  const auctions = data.data.auctions as any[];
  if (auctions.length < 0) return [];
  return auctions.map(auction => {
    return {
      activeAuction: {
        amount: BigNumber.from(auction.amount).toJSON(),
        bidder: auction.bidder ? auction.bidder.id : '',
        startTime: BigNumber.from(auction.startTime).toJSON(),
        endTime: BigNumber.from(auction.endTime).toJSON(),
        nounId: BigNumber.from(auction.id).toJSON(),
        settled: false,
      },
      bids: auction.bids,
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
