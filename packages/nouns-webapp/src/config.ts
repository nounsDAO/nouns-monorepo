import { ContractAddresses, getContractAddressesForChainOrThrow } from '@nouns/sdk';
import { ChainId } from '@usedapp/core';
import maticLogo from "./assets/matic-logo.svg";

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
  subgraphApiUri: string;
  enableHistory: boolean;
}

export const CURRENCY_SYMBOL = "MATIC";
export const CURRENCY_LOGO = maticLogo;
export const INITIAL_DEFAULT_PRICE = 50;

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet | ChainId.Polygon | ChainId.Hardhat | ChainId.Avalanche | ChainId.Fuji;

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '4');

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

const app: Record<SupportedChains, AppConfig> = {
  [ChainId.Rinkeby]: {
    jsonRpcUri: createNetworkHttpUrl('rinkeby'),
    wsRpcUri: createNetworkWsUrl('rinkeby'),
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph-rinkeby-v4',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
  [ChainId.Polygon]: {
    jsonRpcUri: createNetworkHttpUrl('polygon'),
    wsRpcUri: createNetworkWsUrl('polygon'),
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/noname-dao/noname-subgraph-main',
    enableHistory: false,
  },
  [ChainId.Mainnet]: {
    jsonRpcUri: createNetworkHttpUrl('mainnet'),
    wsRpcUri: createNetworkWsUrl('mainnet'),
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
  [ChainId.Hardhat]: {
    jsonRpcUri: 'http://localhost:8545',
    wsRpcUri: 'ws://localhost:8545',
    subgraphApiUri: '',
    enableHistory: false,
  },
  [ChainId.Fuji]: {
    jsonRpcUri: 'https://api.avax-test.network/ext/bc/C/rpc',
    wsRpcUri: 'wss://api.avax-test.network/ext/bc/C/rpc',
    subgraphApiUri: '',
    enableHistory: ProcessingInstruction.env.REACT_APP_ENABLE_HISTORY === 'true',
  }
};

const getAddresses = () => {
  try {
    return getContractAddressesForChainOrThrow(CHAIN_ID);
  } catch {
    return {} as ContractAddresses;
  }
};

const config = {
  app: app[CHAIN_ID],
  addresses: getAddresses(),
};

export default config;