import dayjs from 'dayjs';
import { AVERAGE_BLOCK_TIME_IN_SECS } from './constants';

export const currentUnixEpoch = () => {
  return Math.floor(new Date().getTime() / 1000);
};

/**
 * Converts date string to unix timestamp
 * @param dateString
 */
export const toUnixEpoch = (dateString: string) => {
  return new Date(dateString).valueOf() / 1000;
};

export const unixToDateString = (timestamp?: number) => {
  return dayjs
    .unix(timestamp ?? 0)
    .utc()
    .format('MMMM DD, YYYY');
};

export const timestampFromBlockNumber = (targetBlock: number, currentBlock: number) => {
  const timestampNow = Date.now();
  const timestamp = dayjs(timestampNow).add(
    AVERAGE_BLOCK_TIME_IN_SECS * (targetBlock - currentBlock),
    'seconds',
  );
  return timestamp;
};
