import { config } from './config';
import Redis from 'ioredis';
import TwitterApi from 'twitter-api-v2';
import { Contract, providers } from 'ethers';
import { NounsERC721ABI } from '@nouns/contracts';

/**
 * Redis Client
 */
export const redis = new Redis(config.redisPort, config.redisHost, {
  db: config.redisDb,
  password: config.redisPassword,
});

/**
 * Twitter Client
 */
export const twitter = new TwitterApi({
  appKey: config.twitterAppKey,
  appSecret: config.twitterAppSecret,
  accessToken: config.twitterAccessToken,
  accessSecret: config.twitterAccessSecret,
});

/**
 * Ethers JSON RPC Provider
 */
export const jsonRpcProvider = new providers.JsonRpcProvider(config.jsonRpcUrl);

/**
 * Nouns ERC721 Token Contract
 */
export const nounsTokenContract = new Contract(
  config.nounsTokenAddress,
  NounsERC721ABI,
  jsonRpcProvider,
);
