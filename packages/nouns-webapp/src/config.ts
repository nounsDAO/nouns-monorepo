import { ChainId } from '@usedapp/core';

interface Config {
  auctionProxyAddress: string;
  tokenAddress: string;
  nounsDaoAddress: string;
  subgraphApiUri: string;
  jsonRpcUri: string;
  enableHistory: boolean;
}

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet;

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '4');

const config: Record<SupportedChains, Config> = {
  [ChainId.Rinkeby]: {
    jsonRpcUri:process.env.REACT_APP_RINKEBY_JSONRPC || `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    auctionProxyAddress: '0xBA088c634394775D89cAC7c67DFD52D73bfdFa05',
    tokenAddress: '0xc52bb4Fc4ed72f2a910BF0481D620B927Ded76f7',
    nounsDaoAddress: '0x2817A1A4Ae32AEc0D15b2E751AC207Da306Ea213',
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph-rinkeby',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === "true" || false
  },
  [ChainId.Mainnet]: {
    auctionProxyAddress: '0x0000000000000000000000000000000000000000',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    nounsDaoAddress: '0x0000000000000000000000000000000000000000',
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph',
    jsonRpcUri: process.env.REACT_APP_MAINNET_JSONRPC || `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    enableHistory: process.env.ENABLE_HISTORY === "true" || false

  },
};

export default config[CHAIN_ID];
