import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnDisplayAuctionState {
  lastAuctionNounId: number | undefined;
  onDisplayAuctionNounId: number | undefined;
}

const initialState: OnDisplayAuctionState = {
  lastAuctionNounId: undefined,
  onDisplayAuctionNounId: undefined,
};

const onDisplayAuction = createSlice({
  name: 'onDisplayAuction',
  initialState: initialState,
  reducers: {
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
  setLastAuctionNounId,
  setOnDisplayAuctionNounId,
  setPrevOnDisplayAuctionNounId,
  setNextOnDisplayAuctionNounId,
} = onDisplayAuction.actions;

export default onDisplayAuction.reducer;
