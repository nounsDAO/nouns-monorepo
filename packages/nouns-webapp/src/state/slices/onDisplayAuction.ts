import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnDisplayAuctionState {
  lastAuctionTokenId: number | undefined;
  onDisplayAuctionTokenId: number | undefined;
}

const initialState: OnDisplayAuctionState = {
  lastAuctionTokenId: undefined,
  onDisplayAuctionTokenId: undefined,
};

const onDisplayAuction = createSlice({
  name: 'onDisplayAuction',
  initialState: initialState,
  reducers: {
    setLastAuctionTokenId: (state, action: PayloadAction<number>) => {
      state.lastAuctionTokenId = action.payload;
    },
    setOnDisplayAuctionTokenId: (state, action: PayloadAction<number>) => {
      state.onDisplayAuctionTokenId = action.payload;
    },
    setPrevOnDisplayAuctionTokenId: state => {
      if (!state.onDisplayAuctionTokenId) return;
      if (state.onDisplayAuctionTokenId === 0) return;
      state.onDisplayAuctionTokenId = state.onDisplayAuctionTokenId - 1;
    },
    setNextOnDisplayAuctionTokenId: state => {
      if (state.onDisplayAuctionTokenId === undefined) return;
      if (state.lastAuctionTokenId === state.onDisplayAuctionTokenId) return;
      state.onDisplayAuctionTokenId = state.onDisplayAuctionTokenId + 1;
    },
  },
});

export const {
  setLastAuctionTokenId,
  setOnDisplayAuctionTokenId,
  setPrevOnDisplayAuctionTokenId,
  setNextOnDisplayAuctionTokenId,
} = onDisplayAuction.actions;

export default onDisplayAuction.reducer;
