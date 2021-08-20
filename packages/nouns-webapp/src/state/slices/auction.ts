import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuctionCreateEvent, AuctionExtendedEvent, AuctionSettledEvent, BidEvent } from '../../utils/types';
import { Auction as IAuction } from '../../wrappers/nounsAuction'

interface ActiveAuction {
  nounId: BigNumberish;
  startTime: BigNumberish;
  endTime: BigNumberish;
  settled: boolean;
  winner?: string;
  winAmount?: BigNumberish;
}

interface AuctionState {
  activeAuction?: ActiveAuction;
  bids: BidEvent[];
}

const initialState: AuctionState = {
  activeAuction: undefined,
  bids: []
};

export const reduxSafeActiveAuction = (auction: IAuction | AuctionCreateEvent): ActiveAuction => ({
  nounId: BigNumber.from(auction.nounId).toJSON(),
  startTime: BigNumber.from(auction.startTime).toJSON(),
  endTime: BigNumber.from(auction.startTime).toJSON(),
  settled: auction.settled
})

export const reduxSafeBid = (bid: BidEvent): BidEvent => ({
	nounId: BigNumber.from(bid.nounId).toJSON(),
	sender: bid.sender,
	value: BigNumber.from(bid.value).toJSON(),
	extended: bid.extended
})

const auctionsEqual = (a: ActiveAuction, b: AuctionSettledEvent | AuctionCreateEvent | BidEvent | AuctionExtendedEvent) =>
  BigNumber.from(a.nounId).eq(BigNumber.from(b.nounId))

export const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setActiveAuction: (state, action: PayloadAction<AuctionCreateEvent>) => {
      state.activeAuction = reduxSafeActiveAuction(action.payload);
      state.bids = [];
      console.log('processed auction create', action.payload);
    },
    setFullAuction: (state, action: PayloadAction<ActiveAuction>) => {
      state.activeAuction = reduxSafeActiveAuction(action.payload);
    },
    appendBid: (state, action: PayloadAction<BidEvent>) => {
      if (!(state.activeAuction && auctionsEqual(state.activeAuction, action.payload))) return;
      state.bids = [reduxSafeBid(action.payload), ...state.bids];
      console.log('processed bid', action.payload);
    },
    setAuctionSettled: (state, action: PayloadAction<AuctionSettledEvent>) => {
      if (!(state.activeAuction && auctionsEqual(state.activeAuction, action.payload))) return;
      state.activeAuction.settled = true;
      state.activeAuction.winner = action.payload.winner;
      state.activeAuction.winAmount = BigNumber.from(action.payload.amount);
      console.log('processed auction settled', action.payload);
    },
    setAuctionExtended: (state, action: PayloadAction<AuctionExtendedEvent>) => {
      if (!(state.activeAuction && auctionsEqual(state.activeAuction, action.payload))) return;
      state.activeAuction.endTime = BigNumber.from(action.payload.endTime);
      console.log('processed auction extended', action.payload);
    },
  },
});

export const { setActiveAuction, appendBid, setAuctionExtended, setAuctionSettled, setFullAuction } = auctionSlice.actions;

export default auctionSlice.reducer;
