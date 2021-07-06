import { config } from './config';
import Redis from 'ioredis';

/**
 * Redis Client
 */
export const redis = new Redis(config.redisPort, config.redisHost);
