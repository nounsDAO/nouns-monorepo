import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnDisplayAuctionState {
  lastAuctionVrbId: number | undefined;
  onDisplayAuctionVrbId: number | undefined;
}

const initialState: OnDisplayAuctionState = {
  lastAuctionVrbId: undefined,
  onDisplayAuctionVrbId: undefined,
};

const onDisplayAuction = createSlice({
  name: 'onDisplayAuction',
  initialState: initialState,
  reducers: {
    setLastAuctionVrbId: (state, action: PayloadAction<number>) => {
      state.lastAuctionVrbId = action.payload;
    },
    setOnDisplayAuctionVrbId: (state, action: PayloadAction<number>) => {
      state.onDisplayAuctionVrbId = action.payload;
    },
    setPrevOnDisplayAuctionVrbId: state => {
      if (!state.onDisplayAuctionVrbId) return;
      if (state.onDisplayAuctionVrbId === 0) return;
      state.onDisplayAuctionVrbId = state.onDisplayAuctionVrbId - 1;
    },
    setNextOnDisplayAuctionVrbId: state => {
      if (state.onDisplayAuctionVrbId === undefined) return;
      if (state.lastAuctionVrbId === state.onDisplayAuctionVrbId) return;
      state.onDisplayAuctionVrbId = state.onDisplayAuctionVrbId + 1;
    },
  },
});

export const {
  setLastAuctionVrbId,
  setOnDisplayAuctionVrbId,
  setPrevOnDisplayAuctionVrbId,
  setNextOnDisplayAuctionVrbId,
} = onDisplayAuction.actions;

export default onDisplayAuction.reducer;
