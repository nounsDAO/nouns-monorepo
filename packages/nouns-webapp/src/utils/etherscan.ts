import { ETHERSCAN_API_KEY } from '@/config';
import { defaultChain } from '@/wagmi';

export const buildEtherscanTxLink = (txHash: string): string => {
  const { url } = defaultChain.blockExplorers.default;
  const path = `/tx/${txHash}`;

  return new URL(path, url).toString();
};

export const buildEtherscanAddressLink = (address: string): string => {
  const { url } = defaultChain.blockExplorers.default;
  const path = `/address/${address}`;

  return new URL(path, url).toString();
};

export const buildEtherscanTokenLink = (tokenContractAddress: string, tokenId: number): string => {
  const { url } = defaultChain.blockExplorers.default;
  const path = `/token/${tokenContractAddress}?a=${tokenId}`;

  return new URL(path, url).toString();
};

export const buildEtherscanHoldingsLink = (address: string): string => {
  const { url } = defaultChain.blockExplorers.default;
  const path = `/tokenholdings?a=${address}`;

  return new URL(path, url).toString();
};

export const buildEtherscanApiQuery = (
  address: string,
  module = 'contract',
  action = 'getsourcecode',
): string => {
  const params = new URLSearchParams({
    chainid: String(defaultChain.id),
    module,
    action,
    address,
    apikey: ETHERSCAN_API_KEY,
  });
  return `https://api.etherscan.io/v2/api?${params.toString()}`;
};
