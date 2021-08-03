import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ApplicationState {
  useGreyBackground: boolean;
}

const initialState: ApplicationState = {
  useGreyBackground: true,
};

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setUseGreyBackground: (state, action: PayloadAction<boolean>) => {
      state.useGreyBackground = action.payload;
    },
  },
});

export const { setUseGreyBackground } = applicationSlice.actions;

export default applicationSlice.reducer;
