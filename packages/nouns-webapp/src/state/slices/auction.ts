import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuctionCreateEvent, AuctionExtendedEvent, AuctionSettledEvent, BidEvent } from '../../utils/types';

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

const createActiveAuction = (event: AuctionCreateEvent): ActiveAuction => ({
  nounId: BigNumber.from(event.nounId),
  startTime: BigNumber.from(event.startTime),
  endTime: BigNumber.from(event.endTime),
  settled: false
})

export const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setActiveAuction: (state, action: PayloadAction<AuctionCreateEvent>) => {
      state.activeAuction = createActiveAuction(action.payload)
      state.bids = []
      console.log('processed auction create', action.payload)
    },
    appendBid: (state, action: PayloadAction<BidEvent>) => {
      state.bids = [action.payload, ...state.bids]
      console.log('processed bid', action.payload)
    },
    setAuctionSettled: (state, action: PayloadAction<AuctionSettledEvent>) => {
      if (state.activeAuction
        && BigNumber.from(state.activeAuction.nounId).eq(BigNumber.from(action.payload.nounId))
        ) {
        state.activeAuction.settled = true;
        state.activeAuction.winner = action.payload.winner
        state.activeAuction.winAmount = BigNumber.from(action.payload.amount)
      }
      console.log('processed auction settled', action.payload)
    },
    setAuctionExtended: (state, action: PayloadAction<AuctionExtendedEvent>) => {
      if (state.activeAuction
        && BigNumber.from(state.activeAuction.nounId).eq(BigNumber.from(action.payload.nounId))
        ) {
        state.activeAuction.endTime = BigNumber.from(action.payload.endTime)
      }
      console.log('processed auction extended', action.payload)
    },
  },
});

export const { setActiveAuction, appendBid, setAuctionExtended, setAuctionSettled } = auctionSlice.actions;

export default auctionSlice.reducer;
