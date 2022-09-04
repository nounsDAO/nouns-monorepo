import { ChainId } from '@usedapp/core';
import { CHAIN_ID, ETHERSCAN_API_KEY } from '../config';

const getBaseURL = (network: ChainId) => {
  switch (network) {
    case ChainId.Rinkeby:
      return 'https://rinkeby.etherscan.io/';
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

export const buildEtherscanTokenLink = (tokenContractAddress: string, tokenId: number): string => {
  const path = `token/${tokenContractAddress}?a=${tokenId}`;
  return new URL(path, BASE_URL).toString();
};

export const buildEtherscanHoldingsLink = (address: string): string => {
  const path = `tokenholdings?a=${address}`;
  return new URL(path, BASE_URL).toString();
};

const getApiBaseURL = (network: ChainId) => {
  switch (network) {
    case ChainId.Rinkeby:
      return `https://api-rinkeby.etherscan.io/`;
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
