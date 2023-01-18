import { config } from './config';
import { Contract, providers } from 'ethers';
import { NFTStorage } from 'nft.storage';
import { N00unsTokenABI } from '@n00uns/contracts';
import Redis from 'ioredis';

/**
 * IFPS Storage Client
 */
export const storage = new NFTStorage({ token: config.nftStorageApiKey });

/**
 * Redis Client
 */
export const redis = new Redis(config.redisPort, config.redisHost);

/**
 * Ethers JSON RPC Provider
 */
export const jsonRpcProvider = new providers.JsonRpcProvider(config.jsonRpcUrl);

/**
 * N00uns ERC721 Token Contract
 */
export const n00unsTokenContract = new Contract(
  config.n00unsTokenAddress,
  N00unsTokenABI,
  jsonRpcProvider,
);
