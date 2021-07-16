/**
 * The OpenSea API provides information about collections that opensea-js
 * doesn't offer. While the official SDK provides the ability to interact
 * with on-chain events and perform on-chain actions, the API provides
 * indexes that can improver users' quality of life.
 */
import axios from 'axios';
import * as R from 'ramda';

export type OpenSeaNetwork = 'mainnet' | 'rinkeby';

export interface OpenSeaOptions {
  network: OpenSeaNetwork;
  tokenContract: string;
  apiKey: string | undefined;
}

const defaultOptions: OpenSeaOptions = {
  network: 'rinkeby',
  tokenContract: '0xfdb7E811ff0e7e10a0A7b14536b66A501c226739',
  apiKey: undefined,
};

const apiDomainFromNetwork = (network: OpenSeaNetwork) => {
  switch (network) {
    case 'mainnet':
      return 'api.opensea.io';
    case 'rinkeby':
    default:
      return 'rinkeby-api.opensea.io';
  }
};

const urlBuilderFactory = (network: OpenSeaNetwork) => (path: string) =>
  ['https://', apiDomainFromNetwork(network), path].join('');

const getFactory = (urlBuilder: (path: string) => string, path: string) => () =>
  axios.get(urlBuilder(path));

export const openSeaFactory = (options: OpenSeaOptions | undefined = undefined) => {
  options = { ...defaultOptions, ...options };
  const urlBuilder = urlBuilderFactory(options.network);
  const curriedGetFactory = R.curry(getFactory)(urlBuilder);
  return {
    fetchCollection: curriedGetFactory(`/api/v1/asset_contract/${options.tokenContract}`),
    fetchAsset: (id: number) =>
      axios.get(urlBuilder(`/api/v1/asset/${options?.tokenContract}/${id}`)),
  };
};
