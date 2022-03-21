import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { grey } from '../../utils/nounBgColors';

export interface AlertModal {
  show: boolean;
  title?: string;
  isEthereum?: boolean;
  message?: string;
  onSuccess?: () => void;
}

interface ApplicationState {
  stateBackgroundColor: string;
  isCoolBackground: boolean;
  alertModal: AlertModal;
  eth: number;
  mona: number;
}

const initialState: ApplicationState = {
  stateBackgroundColor: grey,
  isCoolBackground: true,
  alertModal: {
    show: false,
  },
  eth: 0,
  mona: 0,
};

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setStateBackgroundColor: (state, action: PayloadAction<string>) => {
      state.stateBackgroundColor = action.payload;
      state.isCoolBackground = action.payload === grey;
    },
    setPrices: (state, action: PayloadAction<{ eth: number; mona: number }>) => {
      state.eth = action.payload.eth;
      state.mona = action.payload.mona;
    },
    setAlertModal: (state, action: PayloadAction<AlertModal>) => {
      state.alertModal = action.payload;
    },
  },
});

export const { setStateBackgroundColor, setAlertModal, setPrices } = applicationSlice.actions;

export default applicationSlice.reducer;
