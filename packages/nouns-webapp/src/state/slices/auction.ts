import { BigNumber } from '@ethersproject/bignumber';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AuctionCreateEvent,
  AuctionExtendedEvent,
  AuctionSettledEvent,
  BidEvent,
} from '../../utils/types';
import { Auction as IAuction } from '../../wrappers/nounsAuction';

export interface AuctionState {
  activeAuction?: IAuction;
  bids: BidEvent[];
}

const initialState: AuctionState = {
  activeAuction: undefined,
  bids: [],
};

export const reduxSafeNewAuction = (auction: AuctionCreateEvent): IAuction => ({
  amount: BigNumber.from(0).toJSON(),
  bidder: '',
  startTime: BigNumber.from(auction.startTime).toJSON(),
  endTime: BigNumber.from(auction.endTime).toJSON(),
  nounId: BigNumber.from(auction.nounId).toJSON(),
  settled: false,
});

export const reduxSafeAuction = (auction: IAuction): IAuction => ({
  amount: BigNumber.from(auction.amount).toJSON(),
  bidder: auction.bidder,
  startTime: BigNumber.from(auction.startTime).toJSON(),
  endTime: BigNumber.from(auction.endTime).toJSON(),
  nounId: BigNumber.from(auction.nounId).toJSON(),
  settled: auction.settled,
});

export const reduxSafeBid = (bid: BidEvent): BidEvent => ({
  nounId: BigNumber.from(bid.nounId).toJSON(),
  sender: bid.sender,
  value: BigNumber.from(bid.value).toJSON(),
  extended: bid.extended,
  transactionHash: bid.transactionHash,
  timestamp: bid.timestamp,
});

const auctionsEqual = (
  a: IAuction,
  b: AuctionSettledEvent | AuctionCreateEvent | BidEvent | AuctionExtendedEvent,
) => BigNumber.from(a.nounId).eq(BigNumber.from(b.nounId));

export const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setActiveAuction: (state, action: PayloadAction<AuctionCreateEvent>) => {
      state.activeAuction = reduxSafeNewAuction(action.payload);
      state.bids = [];
      console.log('processed auction create', action.payload);
    },
    setFullAuction: (state, action: PayloadAction<IAuction>) => {
      console.log(`from set full auction: `, action.payload);
      state.activeAuction = reduxSafeAuction(action.payload);
    },
    appendBid: (state, action: PayloadAction<BidEvent>) => {
      if (!(state.activeAuction && auctionsEqual(state.activeAuction, action.payload))) return;
      state.bids = [reduxSafeBid(action.payload), ...state.bids];
      console.log('processed bid', action.payload);
    },
    setAuctionSettled: (state, action: PayloadAction<AuctionSettledEvent>) => {
      if (!(state.activeAuction && auctionsEqual(state.activeAuction, action.payload))) return;
      state.activeAuction.settled = true;
      state.activeAuction.bidder = action.payload.winner;
      state.activeAuction.amount = BigNumber.from(action.payload.amount).toJSON();
      console.log('processed auction settled', action.payload);
    },
    setAuctionExtended: (state, action: PayloadAction<AuctionExtendedEvent>) => {
      if (!(state.activeAuction && auctionsEqual(state.activeAuction, action.payload))) return;
      state.activeAuction.endTime = BigNumber.from(action.payload.endTime).toJSON();
      console.log('processed auction extended', action.payload);
    },
  },
});

export const {
  setActiveAuction,
  appendBid,
  setAuctionExtended,
  setAuctionSettled,
  setFullAuction,
} = auctionSlice.actions;

export default auctionSlice.reducer;
