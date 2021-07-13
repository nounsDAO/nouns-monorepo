import { config } from './config';
import Redis from 'ioredis';
import TwitterApi from 'twitter-api-v2';
import { Contract, providers } from 'ethers';
import { NounsERC721ABI } from '@nouns/contracts';
import Discord from 'discord.js';
import axios from 'axios';

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

/**
 * Discord webhook client for sending messages to discord
 */
export const discordWebhook = new Discord.WebhookClient(
  config.discordWebhookId,
  config.discordWebhookToken,
);

/**
 * Increment one of the Nouns infra counters
 * @param counterName counter name to increment
 * @returns
 */
export const incrementCounter = (counterName: string) =>
  axios.post(`https://simple-counter.nouns.tools/count/inc/${counterName}`);
