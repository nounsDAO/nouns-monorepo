import { useBlockNumber } from '@usedapp/core';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useReadonlyProvider } from '../../hooks/useReadonlyProvider';
import { EventFilter, keyToFilter } from '../../utils/logParsing';
import { fetchedLogs, fetchedLogsError, fetchingLogs } from '../slices/logs';

const MAX_BLOCKS_PER_CALL = 1_000_000;

const Updater = (): null => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.logs);
  const provider = useReadonlyProvider();

  const blockNumber = useBlockNumber();

  const filtersNeedFetch: EventFilter[] = useMemo(() => {
    if (typeof blockNumber !== 'number') return [];

    return Object.keys(state)
      .filter(key => {
        const { fetchingBlockNumber, results, listeners } = state[key];
        if (listeners === 0) return false;
        if (typeof fetchingBlockNumber === 'number' && fetchingBlockNumber >= blockNumber)
          return false;
        if (
          results &&
          typeof results.blockNumber === 'number' &&
          results.blockNumber >= blockNumber
        )
          return false;
        return true;
      })
      .map(key => keyToFilter(key));
  }, [blockNumber, state]);

  useEffect(() => {
    if (!provider || typeof blockNumber !== 'number' || filtersNeedFetch.length === 0) return;

    dispatch(fetchingLogs({ filters: filtersNeedFetch, blockNumber }));
    filtersNeedFetch.forEach(filter => {
      const ranges: { fromBlock: number; toBlock: number }[] = [];

      let fromBlock = filter.fromBlock ?? 0;
      while (fromBlock <= blockNumber) {
        ranges.push({
          fromBlock: fromBlock,
          toBlock: Math.min(fromBlock + MAX_BLOCKS_PER_CALL, blockNumber),
        });
        fromBlock += MAX_BLOCKS_PER_CALL;
      }

      Promise.all(
        ranges.map(range =>
          provider.getLogs({
            ...filter,
            ...range,
          }),
        ),
      )
        .then(logs => {
          dispatch(
            fetchedLogs({
              filter,
              results: { logs: logs.flat(), blockNumber },
            }),
          );
        })
        .catch(error => {
          console.error('Failed to get logs', filter, error);
          dispatch(
            fetchedLogsError({
              filter,
              blockNumber,
            }),
          );
        });
    });
  }, [blockNumber, dispatch, filtersNeedFetch, provider]);

  return null;
};

export default Updater;
