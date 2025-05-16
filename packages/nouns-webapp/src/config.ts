import {
  ContractAddresses as NounsContractAddresses,
  getContractAddressesForChainOrThrow,
} from '@nouns/sdk';

import { Address } from '@/utils/types';
import { hardhat, mainnet, sepolia } from 'viem/chains';

interface ExternalContractAddresses {
  lidoToken: Address | undefined;
  usdcToken: Address | undefined;
  chainlinkEthUsdc: Address | undefined;
  payerContract: Address | undefined;
  tokenBuyer: Address | undefined;
  nounsStreamFactory: Address | undefined;
  weth: Address | undefined;
  steth: Address | undefined;
}

export type ContractAddresses = NounsContractAddresses & ExternalContractAddresses;

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
  subgraphApiUri: string;
  enableHistory: boolean;
}

type SupportedChains = typeof mainnet.id | typeof hardhat.id | typeof sepolia.id;

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

export const CHAIN_ID: SupportedChains = import.meta.env.VITE_CHAIN_ID ?? sepolia.id;

export const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY ?? '';

export const WALLET_CONNECT_V2_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_V2_PROJECT_ID ?? '';

const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID;

export const createNetworkHttpUrl = (network: string): string => {
  const custom = import.meta.env.VITE_MAINNET_JSONRPC;
  return custom || `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
};

export const createNetworkWsUrl = (network: string): string => {
  const custom = import.meta.env.VITE_MAINNET_WSRPC;
  return custom || `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
};

const app: Record<SupportedChains, AppConfig> = {
  [sepolia.id]: {
    jsonRpcUri: createNetworkHttpUrl('sepolia'),
    wsRpcUri: createNetworkWsUrl('sepolia'),
    subgraphApiUri: import.meta.env.VITE_SEPOLIA_SUBGRAPH ?? '',
    enableHistory: import.meta.env.VITE_ENABLE_HISTORY === 'true',
  },
  [mainnet.id]: {
    jsonRpcUri: createNetworkHttpUrl('mainnet'),
    wsRpcUri: createNetworkWsUrl('mainnet'),
    subgraphApiUri: import.meta.env.VITE_MAINNET_SUBGRAPH ?? '',
    enableHistory: import.meta.env.VITE_ENABLE_HISTORY === 'true',
  },
  [hardhat.id]: {
    jsonRpcUri: 'http://localhost:8545',
    wsRpcUri: 'ws://localhost:8545',
    subgraphApiUri: 'http://localhost:8000/subgraphs/name/nounsdao/nouns-subgraph',
    enableHistory: import.meta.env.VITE_ENABLE_HISTORY === 'true',
  },
};

const externalAddresses: Record<SupportedChains, ExternalContractAddresses> = {
  [sepolia.id]: {
    lidoToken: undefined,
    usdcToken: '0xEbCC972B6B3eB15C0592BE1871838963d0B94278',
    weth: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    steth: undefined,
    payerContract: '0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94',
    tokenBuyer: '0x821176470cFeF1dB78F1e2dbae136f73c36ddd48',
    chainlinkEthUsdc: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    nounsStreamFactory: '0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5',
  },
  [mainnet.id]: {
    lidoToken: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    usdcToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainlinkEthUsdc: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    payerContract: '0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D',
    tokenBuyer: '0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5',
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    steth: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    nounsStreamFactory: '0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff',
  },
  [hardhat.id]: {
    lidoToken: undefined,
    usdcToken: undefined,
    payerContract: undefined,
    tokenBuyer: undefined,
    chainlinkEthUsdc: undefined,
    weth: undefined,
    steth: undefined,
    nounsStreamFactory: undefined,
  },
};

const getAddresses = (): ContractAddresses => {
  let nounsAddresses = {} as NounsContractAddresses;
  try {
    nounsAddresses = getContractAddressesForChainOrThrow(CHAIN_ID);
  } catch {
    /* empty */
  }
  return { ...nounsAddresses, ...externalAddresses[CHAIN_ID] };
};

const config = {
  app: app[CHAIN_ID],
  addresses: getAddresses(),
  featureToggles: {
    daoGteV3: false,
    proposeOnV1: true,
    candidates: true,
    fork: true,
  },
};

export default config;
