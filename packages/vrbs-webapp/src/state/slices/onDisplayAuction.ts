import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnDisplayAuctionState {
  lastAuctionN00unId: number | undefined;
  onDisplayAuctionN00unId: number | undefined;
}

const initialState: OnDisplayAuctionState = {
  lastAuctionN00unId: undefined,
  onDisplayAuctionN00unId: undefined,
};

const onDisplayAuction = createSlice({
  name: 'onDisplayAuction',
  initialState: initialState,
  reducers: {
    setLastAuctionN00unId: (state, action: PayloadAction<number>) => {
      state.lastAuctionN00unId = action.payload;
    },
    setOnDisplayAuctionN00unId: (state, action: PayloadAction<number>) => {
      state.onDisplayAuctionN00unId = action.payload;
    },
    setPrevOnDisplayAuctionN00unId: state => {
      if (!state.onDisplayAuctionN00unId) return;
      if (state.onDisplayAuctionN00unId === 0) return;
      state.onDisplayAuctionN00unId = state.onDisplayAuctionN00unId - 1;
    },
    setNextOnDisplayAuctionN00unId: state => {
      if (state.onDisplayAuctionN00unId === undefined) return;
      if (state.lastAuctionN00unId === state.onDisplayAuctionN00unId) return;
      state.onDisplayAuctionN00unId = state.onDisplayAuctionN00unId + 1;
    },
  },
});

export const {
  setLastAuctionN00unId,
  setOnDisplayAuctionN00unId,
  setPrevOnDisplayAuctionN00unId,
  setNextOnDisplayAuctionN00unId,
} = onDisplayAuction.actions;

export default onDisplayAuction.reducer;
