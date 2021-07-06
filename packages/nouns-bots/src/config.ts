export const config = {
  redisPort: Number(process.env.REDIS_PORT ?? 6379),
  redisHost: process.env.REDIS_HOST ?? 'localhost',
  nounsSubgraph: process.env.NOUNS_SUBGRAPH_URL ?? 'https://api.thegraph.com/subgraphs/name/vapeape4464/nouns-rinkeby-two',
};
