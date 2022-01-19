import { redis } from './clients';
import { Proposal } from './types';

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
 * Key prefix for caching proposal records
 */
export const getProposalCacheKeyPrefix = 'NOUNS_PROPOSAL_';

/**
 * Key prefix for caching proposal expiry warning sent records
 */
export const getProposalExpiryWarningSentCacheKeyPrefix = 'NOUNS_PROPOSAL_EXPIRY_WARNING_SENT_';

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

/**
 * Proposal functions
 */

/**
 * Build the proposal cache redis key
 * @param id Proposal ID
 * @returns Proposal cache redis key
 */
const proposalCacheKey = (id: number) => `${getProposalCacheKeyPrefix}${id}`;

/**
 * Build the proposal expiry warning sent cache redis key
 * @param id Proposal ID
 * @returns Proposal expiry warning sent cache redis key
 */
// prettier-ignore
const proposalExpiryWarningSentCacheKey = (id: number) => `${getProposalExpiryWarningSentCacheKeyPrefix}${id}`;

/**
 * Store a proposal into the redis cache
 * @param proposal Proposal to store
 * @returns "OK" | null
 */
export const updateProposalCache = async (proposal: Proposal) => {
  const cacheKey = proposalCacheKey(proposal.id);
  return await redis.set(cacheKey, JSON.stringify(proposal));
};

/**
 * Attempt to fetch a proposal from the redis cache
 * @param id ID of the proposal to fetch
 * @returns Proposal | null
 */
export const getProposalCache = async (id: number) => {
  const cacheKey = proposalCacheKey(id);
  const proposal = await redis.get(cacheKey);
  if (proposal) {
    return JSON.parse(proposal) as Proposal;
  }
  return null;
};

/**
 * Store a proposal expiry notification receipt in the redis cache
 * @param id ID of the at-risk proposal
 * @returns "OK" | null
 */
export const setProposalExpiryWarningSent = async (id: number) => {
  const cacheKey = proposalExpiryWarningSentCacheKey(id);
  return redis.set(cacheKey, 1);
};

/**
 * Determine if an expiry warning has been sent for a specific proposal id
 * @param id ID of the at-risk proposal
 * @returns boolean
 */
export const hasWarnedOfExpiry = async (id: number) => {
  const cacheKey = proposalExpiryWarningSentCacheKey(id);
  return Boolean(await redis.exists(cacheKey));
};
