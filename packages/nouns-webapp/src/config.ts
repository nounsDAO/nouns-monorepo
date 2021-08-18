import { ChainId } from '@usedapp/core';

interface Config {
  auctionProxyAddress: string;
  tokenAddress: string;
  nounsDaoAddress: string;
  subgraphApiUri: string;
  jsonRpcUri: string;
  enableHistory: boolean;
}

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet | typeof LOCAL_CHAIN_ID;

export const LOCAL_CHAIN_ID = 31337

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '4');

const config: Record<SupportedChains, Config> = {
  [ChainId.Rinkeby]: {
    jsonRpcUri:
      process.env.REACT_APP_RINKEBY_JSONRPC ||
      `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    auctionProxyAddress: '0x7cb0384b923280269b3BD85f0a7fEaB776588382',
    tokenAddress: '0x632f34c3aee991b10D4b421Bc05413a03d7a37eB',
    nounsDaoAddress: '0xd1C753D9A23eb5c57e0d023e993B9bd4F5086b04',
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph-rinkeby-v4',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true' || false,
  },
  [ChainId.Mainnet]: {
    auctionProxyAddress: '0x830BD73E4184ceF73443C15111a1DF14e495C706',
    tokenAddress: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
    nounsDaoAddress: '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10',
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph',
    jsonRpcUri:
      process.env.REACT_APP_MAINNET_JSONRPC ||
      `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true' || false,
  },
  [LOCAL_CHAIN_ID]: {
    auctionProxyAddress: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    tokenAddress: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    // Temporarily set this to _any_ address until local deployment is configured
    nounsDaoAddress:"0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    subgraphApiUri:"",
    jsonRpcUri:"http://localhost:8545",
    enableHistory:false
  }
};

export default config[CHAIN_ID];
