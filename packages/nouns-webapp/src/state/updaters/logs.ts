import { useBlockNumber, useEthers } from '@usedapp/core';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { EventFilter, keyToFilter } from '../../utils/logParsing';
import { fetchedLogs, fetchedLogsError, fetchingLogs } from '../slices/logs';

const Updater = (): null => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.logs);
  const { library } = useEthers();

  const blockNumber = useBlockNumber();
  const BLOCKS_PER_CHUNK = 14000000;

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
    if (!library || typeof blockNumber !== 'number' || filtersNeedFetch.length === 0) return;

    dispatch(fetchingLogs({ filters: filtersNeedFetch, blockNumber }));
    filtersNeedFetch.forEach(filter => {
      const chunks = Array.from(
        { length: Math.ceil(blockNumber / BLOCKS_PER_CHUNK) },
        (_, i) => i,
      ).map((val: number) => [
        val * BLOCKS_PER_CHUNK,
        Math.min(blockNumber, (val + 1) * BLOCKS_PER_CHUNK),
      ]);

      Promise.all(
        chunks.map((chunkBoundary: Array<number>) =>
          library.getLogs({
            ...filter,
            fromBlock: chunkBoundary[0],
            toBlock: chunkBoundary[1],
          }),
        ),
      )
        .then(nestedLogs => nestedLogs.flat())
        .then(logs => {
          dispatch(
            fetchedLogs({
              filter,
              results: { logs, blockNumber },
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
  }, [blockNumber, dispatch, filtersNeedFetch, library]);

  return null;
};

export default Updater;
