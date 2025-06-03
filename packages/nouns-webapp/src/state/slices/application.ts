import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { grey } from '@/utils/nounBgColors';

interface ApplicationState {
  stateBackgroundColor: string;
  isCoolBackground: boolean;
}

const initialState: ApplicationState = {
  stateBackgroundColor: grey,
  isCoolBackground: true,
};

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setStateBackgroundColor: (state, action: PayloadAction<string>) => {
      state.stateBackgroundColor = action.payload;
      state.isCoolBackground = action.payload === grey;
    },
  },
});

export const { setStateBackgroundColor } = applicationSlice.actions;

export default applicationSlice.reducer;
