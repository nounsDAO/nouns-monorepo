import { redis } from './clients';

/**
 * Key mapped to the current auction
 */
export const getAuctionCacheKey = 'NOUNS_AUCTION_CACHE';

/**
 * Key mapped to the last processed bid
 */
export const getBidCacheKey = 'NOUNS_BID_CACHE';

/**
 * Key mapped to the tweet id to reply updates to
 */
export const getReplyTweetIdKey = 'NOUNS_REPLY_TWEET_ID';

/**
 * Key mapped to the latest auction id processed for auction ending soon
 */
export const getAuctionEndingSoonCacheKey = 'NOUNS_AUCTION_ENDING_SOON_CACHE';

/**
 * Update the auction cache with `id`
 * @param id
 */
export async function updateAuctionCache(id: number) {
  await redis.set(getAuctionCacheKey, id);
}

/**
 * Get the contents of the bid cache
 * @returns The bid cache id or null
 */
export async function getBidCache(): Promise<string> {
  return (await redis.get(getBidCacheKey)) ?? '';
}

/**
 * Update the bid cache with an id
 * @param id The bid id to place in the cache
 */
export async function updateBidCache(id: string) {
  await redis.set(getBidCacheKey, id);
}

/**
 * Get the current tweet id to reply bids to or null
 * @returns The current tweet id to reply to or null
 */
export async function getAuctionReplyTweetId(): Promise<string | null> {
  return redis.get(getReplyTweetIdKey);
}

/**
 * Update the cache with the id_str of the tweet to reply to next
 * @param id The id_str of the tweet
 */
export async function updateAuctionReplyTweetId(id: string) {
  await redis.set(getReplyTweetIdKey, id);
}

/**
 * Get the last auction id processed for ending soon
 * @returns The last auction to be processed for ending soon
 */
export async function getAuctionEndingSoonCache(): Promise<number> {
  const auctionId = await redis.get(getAuctionEndingSoonCacheKey);
  if (auctionId) {
    return Number(auctionId);
  }
  return 0;
}

/**
 * Update the auction ending soon cache with `id`
 * @param id The auction id
 */
export async function updateAuctionEndingSoonCache(id: number) {
  await redis.set(getAuctionEndingSoonCacheKey, id);
}

/**
 * Get the current cache contents or 0 if empty
 * @returns The current cache contents as number or 0 if null
 */
export async function getAuctionCache(): Promise<number> {
  const auctionId = await redis.get(getAuctionCacheKey);
  if (auctionId) {
    return Number(auctionId);
  }
  return 0;
}
