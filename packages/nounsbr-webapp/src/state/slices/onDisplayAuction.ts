import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnDisplayAuctionState {
  lastAuctionNounBRId: number | undefined;
  onDisplayAuctionNounBRId: number | undefined;
}

const initialState: OnDisplayAuctionState = {
  lastAuctionNounBRId: undefined,
  onDisplayAuctionNounBRId: undefined,
};

const onDisplayAuction = createSlice({
  name: 'onDisplayAuction',
  initialState: initialState,
  reducers: {
    setLastAuctionNounBRId: (state, action: PayloadAction<number>) => {
      state.lastAuctionNounBRId = action.payload;
    },
    setOnDisplayAuctionNounBRId: (state, action: PayloadAction<number>) => {
      state.onDisplayAuctionNounBRId = action.payload;
    },
    setPrevOnDisplayAuctionNounBRId: state => {
      if (!state.onDisplayAuctionNounBRId) return;
      if (state.onDisplayAuctionNounBRId === 0) return;
      state.onDisplayAuctionNounBRId = state.onDisplayAuctionNounBRId - 1;
    },
    setNextOnDisplayAuctionNounBRId: state => {
      if (state.onDisplayAuctionNounBRId === undefined) return;
      if (state.lastAuctionNounBRId === state.onDisplayAuctionNounBRId) return;
      state.onDisplayAuctionNounBRId = state.onDisplayAuctionNounBRId + 1;
    },
  },
});

export const {
  setLastAuctionNounBRId,
  setOnDisplayAuctionNounBRId,
  setPrevOnDisplayAuctionNounBRId,
  setNextOnDisplayAuctionNounBRId,
} = onDisplayAuction.actions;

export default onDisplayAuction.reducer;
