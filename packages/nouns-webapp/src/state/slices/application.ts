import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { grey } from '../../utils/nounBgColors';

export interface AlertModal {
  show: boolean;
  title?: string;
  message?: string;
}

interface ApplicationState {
  stateBackgroundColor: string;
  alertModal: AlertModal;
}

const initialState: ApplicationState = {
  stateBackgroundColor: grey,
  alertModal: {
    show: false,
  },
};

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setStateBackgroundColor: (state, action: PayloadAction<string>) => {
      state.stateBackgroundColor = action.payload;
    },
    setAlertModal: (state, action: PayloadAction<AlertModal>) => {
      state.alertModal = action.payload;
    },
  },
});

export const { setStateBackgroundColor, setAlertModal } = applicationSlice.actions;

export default applicationSlice.reducer;
