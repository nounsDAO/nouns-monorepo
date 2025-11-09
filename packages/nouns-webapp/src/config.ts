import { hardhat, mainnet, sepolia } from 'viem/chains';

interface ContractParameters {
  executor: {
    GRACE_PERIOD_SECONDS: number;
  };
}
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

const ENV_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
export const CHAIN_ID: SupportedChains =
  ENV_CHAIN_ID === mainnet.id || ENV_CHAIN_ID === hardhat.id || ENV_CHAIN_ID === sepolia.id
    ? (ENV_CHAIN_ID as SupportedChains)
    : sepolia.id;

export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? '';

export const WALLET_CONNECT_V2_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_V2_PROJECT_ID ?? '';

const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

export const createNetworkHttpUrl = (network: string): string => {
  const custom = process.env.NEXT_PUBLIC_MAINNET_JSONRPC as string;
  return custom || `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
};

export const createNetworkWsUrl = (network: string): string => {
  const custom = process.env.NEXT_PUBLIC_MAINNET_WSRPC as string;
  return custom || `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
};

const app: Record<SupportedChains, AppConfig> = {
  [sepolia.id]: {
    jsonRpcUri: createNetworkHttpUrl('sepolia'),
    wsRpcUri: createNetworkWsUrl('sepolia'),
    subgraphApiUri: process.env.NEXT_PUBLIC_SEPOLIA_SUBGRAPH ?? '',
    enableHistory: process.env.NEXT_PUBLIC_ENABLE_HISTORY === 'true',
  },
  [mainnet.id]: {
    jsonRpcUri: createNetworkHttpUrl('mainnet'),
    wsRpcUri: createNetworkWsUrl('mainnet'),
    subgraphApiUri: process.env.NEXT_PUBLIC_MAINNET_SUBGRAPH ?? '',
    enableHistory: process.env.NEXT_PUBLIC_ENABLE_HISTORY === 'true',
  },
  [hardhat.id]: {
    jsonRpcUri: 'http://localhost:8545',
    wsRpcUri: 'ws://localhost:8545',
    subgraphApiUri: 'http://localhost:8000/subgraphs/name/nounsdao/nouns-subgraph',
    enableHistory: process.env.NEXT_PUBLIC_ENABLE_HISTORY === 'true',
  },
};

const contractParameters: Record<SupportedChains, ContractParameters> = {
  [sepolia.id]: {
    executor: {
      GRACE_PERIOD_SECONDS: 1814400,
    },
  },
  [mainnet.id]: {
    executor: {
      GRACE_PERIOD_SECONDS: 1814400,
    },
  },
  [hardhat.id]: {
    executor: {
      GRACE_PERIOD_SECONDS: 1814400,
    },
  },
};

const config = {
  app: app[CHAIN_ID],
  contractParameters: contractParameters[CHAIN_ID],
  featureToggles: {
    daoGteV3: false,
    proposeOnV1: true,
    candidates: true,
    fork: true,
  },
};

export default config;
