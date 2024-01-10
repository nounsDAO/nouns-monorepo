import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnDisplayAuctionState {
  firstAuctionNounId: number;
  lastAuctionNounId: number | undefined;
  onDisplayAuctionNounId: number | undefined;
}

const initialState: OnDisplayAuctionState = {
  firstAuctionNounId: 0, // Num of air drops
  lastAuctionNounId: undefined,
  onDisplayAuctionNounId: undefined,
};

const onDisplayAuction = createSlice({
  name: 'onDisplayAuction',
  initialState: initialState,
  reducers: {
    setFirstAuctionNounId: (state, action: PayloadAction<number>) => {
      if (state.firstAuctionNounId == null) return;
      state.firstAuctionNounId = action.payload;
    },
    setLastAuctionNounId: (state, action: PayloadAction<number>) => {
      state.lastAuctionNounId = action.payload;
    },
    setOnDisplayAuctionNounId: (state, action: PayloadAction<number>) => {
      state.onDisplayAuctionNounId = action.payload;
    },
    setPrevOnDisplayAuctionNounId: state => {
      if (!state.onDisplayAuctionNounId) return;
      if (state.onDisplayAuctionNounId === 0) return;
      state.onDisplayAuctionNounId = state.onDisplayAuctionNounId - 1;
    },
    setNextOnDisplayAuctionNounId: state => {
      if (state.onDisplayAuctionNounId === undefined) return;
      if (state.lastAuctionNounId === state.onDisplayAuctionNounId) return;
      state.onDisplayAuctionNounId = state.onDisplayAuctionNounId + 1;
    },
  },
});

export const {
  setFirstAuctionNounId,
  setLastAuctionNounId,
  setOnDisplayAuctionNounId,
  setPrevOnDisplayAuctionNounId,
  setNextOnDisplayAuctionNounId,
} = onDisplayAuction.actions;

export default onDisplayAuction.reducer;
