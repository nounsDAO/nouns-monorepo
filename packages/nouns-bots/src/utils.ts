import { redis } from './clients';

export const getAuctionCacheKey = 'NOUNS_AUCTION_CACHE';

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

/**
 * Update the auction cache with `id`
 * @param id 
 */
export async function updateAuctionCache(id: number) {
  await redis.set(getAuctionCacheKey, id);
}
