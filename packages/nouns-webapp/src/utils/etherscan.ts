import { sepolia } from 'viem/chains';

import { ETHERSCAN_API_KEY } from '@/config';
import { defaultChain } from '@/wagmi';

const getBaseURL = (network: number) => {
  if (network === sepolia.id) {
    return 'https://sepolia.etherscan.io/';
  } else {
    return 'https://etherscan.io/';
  }
};

const BASE_URL = getBaseURL(defaultChain.id);

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

const getApiBaseURL = (network: number) => {
  if (network === sepolia.id) {
    return 'https://api-sepolia.etherscan.io/';
  } else {
    return 'https://api.etherscan.io/';
  }
};

const API_BASE_URL = getApiBaseURL(defaultChain.id);

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
