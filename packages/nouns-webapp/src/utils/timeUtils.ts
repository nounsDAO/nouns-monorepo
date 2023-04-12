import dayjs from 'dayjs';

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
