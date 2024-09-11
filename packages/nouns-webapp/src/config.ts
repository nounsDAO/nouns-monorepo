import {
  ContractAddresses as NounsContractAddresses,
  getContractAddressesForChainOrThrow,
} from '@nouns/sdk';
import { ChainId } from '@usedapp/core';

interface ExternalContractAddresses {
  lidoToken: string | undefined;
  usdcToken: string | undefined;
  chainlinkEthUsdc: string | undefined;
  payerContract: string | undefined;
  tokenBuyer: string | undefined;
  nounsStreamFactory: string | undefined;
  weth: string | undefined;
  steth: string | undefined;
}

export type ContractAddresses = NounsContractAddresses & ExternalContractAddresses;

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
  subgraphApiUri: string;
  enableHistory: boolean;
}

export const ChainId_Sepolia = 11155111;
type SupportedChains = ChainId.Mainnet | ChainId.Hardhat | ChainId.Goerli | typeof ChainId_Sepolia;

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

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '4');

export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY ?? '';

export const WALLET_CONNECT_V2_PROJECT_ID =
  process.env.REACT_APP_WALLET_CONNECT_V2_PROJECT_ID ?? '';

const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

export const createNetworkHttpUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_JSONRPC`];
  return custom || `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
};

export const createNetworkWsUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_WSRPC`];
  return custom || `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
};

const app: Record<SupportedChains, AppConfig> = {
  [ChainId.Goerli]: {
    jsonRpcUri: createNetworkHttpUrl('goerli'),
    wsRpcUri: createNetworkWsUrl('goerli'),
    subgraphApiUri:
      'https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns-v3-goerli/0.1.6/gn',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
  [ChainId_Sepolia]: {
    jsonRpcUri: createNetworkHttpUrl('sepolia'),
    wsRpcUri: createNetworkWsUrl('sepolia'),
    subgraphApiUri:
      'https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns-sepolia-the-burn/0.1.0/gn',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
  [ChainId.Mainnet]: {
    jsonRpcUri: createNetworkHttpUrl('mainnet'),
    wsRpcUri: createNetworkWsUrl('mainnet'),
    subgraphApiUri:
      'https://api.goldsky.com/api/public/project_cldf2o9pqagp43svvbk5u3kmo/subgraphs/nouns/prod/gn',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
  [ChainId.Hardhat]: {
    jsonRpcUri: 'http://localhost:8545',
    wsRpcUri: 'ws://localhost:8545',
    subgraphApiUri: 'http://localhost:8000/subgraphs/name/nounsdao/nouns-subgraph',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
};

const externalAddresses: Record<SupportedChains, ExternalContractAddresses> = {
  [ChainId.Goerli]: {
    lidoToken: '0x2DD6530F136D2B56330792D46aF959D9EA62E276',
    usdcToken: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    weth: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    steth: '0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F',
    payerContract: '0x63F8445C4549d17DB181f9ADe1a126EfF8Ee72D6',
    tokenBuyer: '0x7Ee1fE5973c2F6e42D2D40c93f0FDed078c85770',
    chainlinkEthUsdc: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
    nounsStreamFactory: '0xc08a287eCB16CeD801f28Bb011924f7DE5Cc53a3',
  },
  [ChainId_Sepolia]: {
    lidoToken: undefined,
    usdcToken: '0xEbCC972B6B3eB15C0592BE1871838963d0B94278',
    weth: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    steth: undefined,
    payerContract: '0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94',
    tokenBuyer: '0x821176470cFeF1dB78F1e2dbae136f73c36ddd48',
    chainlinkEthUsdc: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    nounsStreamFactory: '0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5',
  },
  [ChainId.Mainnet]: {
    lidoToken: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    usdcToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainlinkEthUsdc: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    payerContract: '0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D',
    tokenBuyer: '0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5',
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    steth: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    nounsStreamFactory: '0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff',
  },
  [ChainId.Hardhat]: {
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
  } catch { }
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

export const multicallOnLocalhost = '0x4A679253410272dd5232B3Ff7cF5dbB88f295319';
