import { useBlockNumber } from '@usedapp/core';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addListener, removeListener } from '../state/slices/logs';
import { EventFilter, filterToKey, Log } from '../utils/logParsing';

enum LogsState {
  // The filter is invalid
  INVALID,
  // The logs are being loaded
  LOADING,
  // Logs are from a previous block number
  SYNCING,
  // Tried to fetch logs but received an error
  ERROR,
  // Logs have been fetched as of the latest block number
  SYNCED,
}

export interface UseLogsResult {
  logs: Log[] | undefined;
  state: LogsState;
}

/**
 * Returns the logs for the given filter as of the latest block, re-fetching from the library every block.
 * @param filter The logs filter, without `blockHash`, `fromBlock` or `toBlock` defined.
 */
export function useLogs(filter: EventFilter | undefined): UseLogsResult {
  const blockNumber = useBlockNumber();

  const logs = useAppSelector(state => state.logs);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!filter) return;

    dispatch(addListener({ filter }));
    return () => {
      dispatch(removeListener({ filter }));
    };
  }, [dispatch, filter]);

  const filterKey = useMemo(() => (filter ? filterToKey(filter) : undefined), [filter]);

  return useMemo(() => {
    if (!filterKey || !blockNumber)
      return {
        logs: undefined,
        state: LogsState.INVALID,
      };

    const state = logs[filterKey];
    const result = state?.results;
    if (!result) {
      return {
        state: LogsState.LOADING,
        logs: undefined,
      };
    }

    if (result.error) {
      return {
        state: LogsState.ERROR,
        logs: undefined,
      };
    }

    return {
      state: result.blockNumber >= blockNumber ? LogsState.SYNCED : LogsState.SYNCING,
      logs: result.logs,
    };
  }, [blockNumber, filterKey, logs]);
}
