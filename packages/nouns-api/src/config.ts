export const config = {
  serverPort: Number(process.env.SERVER_PORT ?? 5000),
  redisPort: Number(process.env.REDIS_PORT ?? 6379),
  redisHost: process.env.REDIS_HOST ?? 'localhost',
  nounsTokenAddress: process.env.NOUNS_TOKEN_ADDRESS ?? '0x0000000000000000000000000000000000000000',
  jsonRpcUrl: process.env.JSON_RPC_URL ?? 'https://rinkeby.infura.io/v3/7ec322178a4849f0888bae9b59401b39',
  nftStorageApiKey: process.env.NFT_STORAGE_API_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI1NjA0ZTA0YTkxYzcwOGM0MTU2OGZCRTcwMWVjNzVDY2IyMEM3MDciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyNDgxNDkxNzE4NCwibmFtZSI6Im5vdW5zIn0.f3D9WFLQv4fNGBivXMtbXiKK0ta_UN5RRS_eZCiNLJY',
};
