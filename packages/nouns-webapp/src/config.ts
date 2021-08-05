const config = {
  auctionProxyAddress: '0xBA088c634394775D89cAC7c67DFD52D73bfdFa05',
  tokenAddress: '0xc52bb4Fc4ed72f2a910BF0481D620B927Ded76f7',
  subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph-rinkeby',
  rinkebyJsonRpc: process.env.REACT_APP_RINKEBY_JSONRPC ||
      `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
  supportedChainIds: [4]
};

export default config;
