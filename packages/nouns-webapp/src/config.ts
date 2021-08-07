import { ChainId } from '@usedapp/core';

interface Config {
  auctionProxyAddress: string;
  tokenAddress: string;
  nounsDaoAddress: string;
  subgraphApiUri: string;
  enableHistory: boolean;
}

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet;

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '4');

const config: Record<SupportedChains, Config> = {
  [ChainId.Rinkeby]: {
    auctionProxyAddress: '0x7cb0384b923280269b3BD85f0a7fEaB776588382',
    tokenAddress: '0x632f34c3aee991b10D4b421Bc05413a03d7a37eB',
    nounsDaoAddress: '0xd1C753D9A23eb5c57e0d023e993B9bd4F5086b04',
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph-rinkeby-v4',
    enableHistory: process.env.ENABLE_HISTORY === "true" || false
  },
  [ChainId.Mainnet]: {
    auctionProxyAddress: '0x0000000000000000000000000000000000000000',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    nounsDaoAddress: '0x0000000000000000000000000000000000000000',
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph',
    enableHistory: process.env.ENABLE_HISTORY === "true" || false
  },
};

export default config[CHAIN_ID];
