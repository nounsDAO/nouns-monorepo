import { ethers } from 'ethers';

/**
 * Get address from query param
 *
 * @param paramName query param name i.e. for the URL nouns.wtf/delegate?to=0xabv... to would be the paramName
 * @param useLocationResult string returned by react-router-v5 useLocation
 */
export const getAddressFromQueryParams = (
  paramName: string,
  useLocationResult: string,
): string | undefined => {
  console.log(useLocationResult);
  const splitLocationResult = useLocationResult
    .split('=')
    .map((s: string) => s.replace('?', '').replace('&', ''));

  const paramIndex = splitLocationResult.indexOf(paramName);
  if (paramIndex < 0 || paramIndex === splitLocationResult.length - 1) {
    return undefined;
  }

  const maybeAddress = splitLocationResult[paramIndex + 1];

  if (maybeAddress.endsWith('.eth') || maybeAddress.endsWith(encodeURIComponent('.⌐◨-◨'))) {
    return decodeURIComponent(maybeAddress);
  }

  return ethers.utils.isAddress(maybeAddress) ? maybeAddress : undefined;
};
