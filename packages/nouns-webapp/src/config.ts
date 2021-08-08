import { ChainId } from '@usedapp/core';
require("dotenv").config()

interface Config {
  auctionProxyAddress: string;
  tokenAddress: string;
  nounsDaoAddress: string;
  subgraphApiUri: string;
  jsonRpcUri: string;
  enableHistory: boolean;
}

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet;

type TestnetVersions = "V3" | "V4"

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '4');

const testnetConfigs: Record<TestnetVersions, Config> = {
  "V3": {
    jsonRpcUri: process.env.REACT_APP_RINKEBY_JSONRPC || `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    auctionProxyAddress: '0xBA088c634394775D89cAC7c67DFD52D73bfdFa05',
    tokenAddress: '0xc52bb4Fc4ed72f2a910BF0481D620B927Ded76f7',
    nounsDaoAddress: '0x2817A1A4Ae32AEc0D15b2E751AC207Da306Ea213',
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph-rinkeby',
    enableHistory: true
  },
  "V4": {
    jsonRpcUri:
      process.env.REACT_APP_RINKEBY_JSONRPC ||
      `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    auctionProxyAddress: '0x7cb0384b923280269b3BD85f0a7fEaB776588382',
    tokenAddress: '0x632f34c3aee991b10D4b421Bc05413a03d7a37eB',
    nounsDaoAddress: '0xd1C753D9A23eb5c57e0d023e993B9bd4F5086b04',
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph-rinkeby-v4',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true' || false,
  }
}

const config: Record<SupportedChains, Config> = {
  [ChainId.Rinkeby]: testnetConfigs[process.env.REACT_APP_TESTNET_VERSION as TestnetVersions ?? "V4"],
  [ChainId.Mainnet]: {
    auctionProxyAddress: '0x0000000000000000000000000000000000000000',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    nounsDaoAddress: '0x0000000000000000000000000000000000000000',
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph',
    jsonRpcUri:
      process.env.REACT_APP_MAINNET_JSONRPC ||
      `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true' || false,
  },
};

export default config[CHAIN_ID];
