import { ChainId } from '@usedapp/core';
import { CHAIN_ID, ETHERSCAN_API_KEY } from '../config';

const getBaseURL = (network: ChainId) => {
  switch (network) {
    case ChainId.Rinkeby:
      return 'https://rinkeby.etherscan.io/';
    case ChainId.Polygon:
      return 'https://polygonscan.com/';
    case ChainId.Fuji:
      return 'https://snowtrace.io/';
    default:
      return 'https://etherscan.io/';
  }
};

const BASE_URL = getBaseURL(CHAIN_ID);

export const buildEtherscanTxLink = (txHash: string): string => {
  const path = `tx/${txHash}`;
  return new URL(path, BASE_URL).toString();
};

export const buildEtherscanAddressLink = (address: string): string => {
  const path = `address/${address}`;
  return new URL(path, BASE_URL).toString();
};

export const buildEtherscanTokenLink = (address: string): string => {
  const path = `token/${address}`;
  return new URL(path, BASE_URL).toString();
};

const getApiBaseURL = (network: ChainId) => {
  switch (network) {
    case ChainId.Rinkeby:
      return `https://api-rinkeby.etherscan.io/`;
    case ChainId.Polygon:
      return 'https://api.polygonscan.com/';
    case ChainId.Fuji:
      return 'https://api.testnet.snowtrace.io/'
    default:
      return 'https://api.etherscan.io/';
  }
};

const API_BASE_URL = getApiBaseURL(CHAIN_ID);

export const buildEtherscanApiQuery = (
  address: string,
  module = 'contract',
  action = 'getsourcecode',
): string => {
  const params = new URLSearchParams({
    module,
    action,
    address,
    apikey: ETHERSCAN_API_KEY,
  });
  const path = `api?${params.toString()}`;
  return new URL(path, API_BASE_URL).toString();
};
