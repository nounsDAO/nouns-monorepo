export enum Network {
  rinkeby = 'rinkeby',
  mainnet = '',
}

const baseURL = (network: Network) => {
  switch (network) {
    case Network.rinkeby:
      return `https://${Network.rinkeby}.etherscan.io/`;
    case Network.mainnet:
      return `https://etherscan.io/`;
  }
};

export const buildEtherscanTxLink = (txHash: string, network: Network = Network.mainnet): URL => {
  const path = `tx/${txHash}`;
  return new URL(path, baseURL(network));
};

export const buildEtherscanAddressLink = (
  address: string,
  network: Network = Network.mainnet,
): URL => {
  const path = `address/${address}`;
  return new URL(path, baseURL(network));
};
