import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnDisplayAuctionState {
  lastAuctionNounId: number | undefined;
  onDisplayAuctionNounId: number | undefined;
  isNewAuction: boolean;
}

const initialState: OnDisplayAuctionState = {
  lastAuctionNounId: undefined,
  onDisplayAuctionNounId: undefined,
  isNewAuction: false,
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
      if (!state.onDisplayAuctionNounId) return;
      if (state.lastAuctionNounId === state.onDisplayAuctionNounId) return;
      state.onDisplayAuctionNounId = state.onDisplayAuctionNounId + 1;
    },
    setIsNewAuction: (state, action: PayloadAction<boolean>) => {
      state.isNewAuction = true;
    },
  },
});

export const {
  setLastAuctionNounId,
  setOnDisplayAuctionNounId,
  setPrevOnDisplayAuctionNounId,
  setNextOnDisplayAuctionNounId,
  setIsNewAuction,
} = onDisplayAuction.actions;

export default onDisplayAuction.reducer;
