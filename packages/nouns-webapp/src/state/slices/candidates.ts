import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ProposalCandidate } from '@/wrappers/nouns-data';

export interface CandidatesState {
  data: ProposalCandidate[] | undefined;
  loading: boolean;
  error: Error | null;
}

const initialState: CandidatesState = {
  data: undefined,
  loading: false,
  error: null,
};

export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (_, { rejectWithValue }) => {
    try {
      // The actual fetching is done in the component through the useCandidateProposals hook
      // This thunk is primarily for triggering state updates
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setCandidates: (state, action: PayloadAction<ProposalCandidate[] | undefined>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<Error | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCandidates.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as Error;
      });
  },
});

export const { setCandidates, setLoading, setError } = candidatesSlice.actions;

export default candidatesSlice.reducer;
