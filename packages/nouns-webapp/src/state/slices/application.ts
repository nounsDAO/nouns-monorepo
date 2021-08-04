import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AlertModal {
  show: boolean;
  title?: string;
  message?: string;
}

interface ApplicationState {
  useGreyBackground: boolean;
  alertModal: AlertModal;
}

const initialState: ApplicationState = {
  useGreyBackground: true,
  alertModal: {
    show: false,
  },
};

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setUseGreyBackground: (state, action: PayloadAction<boolean>) => {
      state.useGreyBackground = action.payload;
    },
    setAlertModal: (state, action: PayloadAction<AlertModal>) => {
      state.alertModal = action.payload;
    },
  },
});

export const { setUseGreyBackground, setAlertModal } = applicationSlice.actions;

export default applicationSlice.reducer;
