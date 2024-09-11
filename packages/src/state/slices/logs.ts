import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventFilter, filterToKey, Log } from '../../utils/logParsing';

export interface LogsState {
  [filterKey: string]: {
    listeners: number;
    fetchingBlockNumber?: number;
    results?:
      | {
          blockNumber: number;
          logs: Log[];
          error?: undefined;
        }
      | {
          blockNumber: number;
          logs?: undefined;
          error: true;
        };
  };
}

const slice = createSlice({
  name: 'logs',
  initialState: {} as LogsState,
  reducers: {
    addListener(state, { payload: { filter } }: PayloadAction<{ filter: EventFilter }>) {
      const key = filterToKey(filter);
      if (!state[key])
        state[key] = {
          listeners: 1,
        };
      else state[key].listeners++;
    },
    fetchingLogs(
      state,
      {
        payload: { filters, blockNumber },
      }: PayloadAction<{ filters: EventFilter[]; blockNumber: number }>,
    ) {
      for (const filter of filters) {
        const key = filterToKey(filter);
        if (!state[key]) continue;
        state[key].fetchingBlockNumber = blockNumber;
      }
    },
    fetchedLogs(
      state,
      {
        payload: { filter, results },
      }: PayloadAction<{ filter: EventFilter; results: { blockNumber: number; logs: Log[] } }>,
    ) {
      const key = filterToKey(filter);
      const fetchState = state[key];
      if (
        !fetchState ||
        (fetchState.results && fetchState.results.blockNumber > results.blockNumber)
      )
        return;
      fetchState.results = results;
    },
    fetchedLogsError(
      state,
      {
        payload: { filter, blockNumber },
      }: PayloadAction<{ blockNumber: number; filter: EventFilter }>,
    ) {
      const key = filterToKey(filter);
      const fetchState = state[key];
      if (!fetchState || (fetchState.results && fetchState.results.blockNumber > blockNumber))
        return;
      fetchState.results = {
        blockNumber,
        error: true,
      };
    },
    removeListener(state, { payload: { filter } }: PayloadAction<{ filter: EventFilter }>) {
      const key = filterToKey(filter);
      if (!state[key]) return;
      state[key].listeners--;
    },
  },
});

export default slice.reducer;
export const { addListener, removeListener, fetchedLogs, fetchedLogsError, fetchingLogs } =
  slice.actions;
