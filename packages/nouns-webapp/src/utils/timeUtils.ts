export const currentUnixEpoch = () => {
  return new Date().getTime() / 1000;
};

/**
 * Converts date string to unix timestamp
 * @param dateString
 */
export const toUnixEpoch = (dateString: string) => {
  return new Date(dateString).valueOf() / 1000;
};
