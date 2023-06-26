import { ContractAddresses as PunkContractAddresses } from '@punks/sdk';
import { ChainId } from '@usedapp/core';
import addresses from './addresses.json';

interface ExternalContractAddresses {
  lidoToken: string | undefined;
}

export type ContractAddresses = PunkContractAddresses & ExternalContractAddresses;

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
  subgraphApiUri: string;
  enableHistory: boolean;
}

export enum ChainSepolia {
  id = 11155111,
}

type SupportedChains = ChainId.Goerli | ChainId.Mainnet | ChainId.Hardhat;

type ExtendedSupportedChains = SupportedChains | ChainSepolia.id;

interface CacheBucket {
  name: string;
  version: string;
}

export const cache: Record<string, CacheBucket> = {
  seed: {
    name: 'seed',
    version: 'v1',
  },
  ens: {
    name: 'ens',
    version: 'v1',
  },
};

export const cacheKey = (bucket: CacheBucket, ...parts: (string | number)[]) => {
  return [bucket.name, bucket.version, ...parts].join('-').toLowerCase();
};

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '5');

export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY ?? '';

const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

export const createNetworkHttpUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_JSONRPC`];
  return custom || `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
};

export const createNetworkWsUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_WSRPC`];
  return custom || `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
};

const app: Record<ExtendedSupportedChains, AppConfig> = {
  [ChainId.Goerli]: {
    jsonRpcUri: createNetworkHttpUrl('goerli'),
    wsRpcUri: createNetworkWsUrl('goerli'),
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/stan7123/punks2',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
  [ChainSepolia.id]: {
    jsonRpcUri: createNetworkHttpUrl('sepolia'),
    wsRpcUri: createNetworkWsUrl('sepolia'),
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/stan7123/punks2',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
  [ChainId.Mainnet]: {
    jsonRpcUri: createNetworkHttpUrl('mainnet'),
    wsRpcUri: createNetworkWsUrl('mainnet'),
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/punks-subgraph',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
  [ChainId.Hardhat]: {
    jsonRpcUri: 'http://localhost:8545',
    wsRpcUri: 'ws://localhost:8545',
    subgraphApiUri: '',
    enableHistory: false,
  },
};

const externalAddresses: Record<ExtendedSupportedChains, ExternalContractAddresses> = {
  [ChainId.Goerli]: {
    lidoToken: '0x2DD6530F136D2B56330792D46aF959D9EA62E276',
  },
  [ChainSepolia.id]: {
    lidoToken: '0x93556903C7517120544418d5ceacDAbc09414D32',
  },
  [ChainId.Mainnet]: {
    lidoToken: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  },
  [ChainId.Hardhat]: {
    lidoToken: undefined,
  },
};

// TODO remove when added properly to punks-sdk
const getContractAddressesForChainOrThrow = (chainId: number): ContractAddresses => {
  // @ts-ignore
  const _addresses: Record<string, ContractAddresses> = addresses;
  if (!_addresses[chainId]) {
    throw new Error(
      `Unknown chain id (${chainId}). No known contracts have been deployed on this chain.`,
    );
  }
  return _addresses[chainId];
};

const getAddresses = (): ContractAddresses => {
  let nounsAddresses = {} as PunkContractAddresses;
  try {
    nounsAddresses = getContractAddressesForChainOrThrow(CHAIN_ID);
  } catch {}
  return { ...nounsAddresses, ...externalAddresses[CHAIN_ID] };
};

const config = {
  app: app[CHAIN_ID],
  addresses: getAddresses(),
};

export default config;
