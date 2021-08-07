import { ethers } from 'ethers';
import sharp from 'sharp';
import { isError, tryF } from 'ts-try';
import { nounsTokenContract, redis } from './clients';
import { Bid, TokenMetadata } from './types';

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
 * Get tweet text for auction started.
 * @param auctionId The started auction id.
 * @param durationSeconds The duration of the auction in seconds.
 * @returns Text to be used in tweet when auction starts.
 */
export function getAuctionStartedTweetText(auctionId: number) {
  return `＊Bleep Bloop Blop＊
        
 An auction has started for Noun #${auctionId}
 Learn more at https://nouns.wtf`;
}

/**
 * Get the tweet text for a new bid.
 * @param id The auction/noun id
 * @param bid The amount of the current bid
 * @returns The bid update tweet text
 */
export function getBidTweetText(id: number, bid: Bid) {
  return `Noun ${id} has received a bid of Ξ${ethers.utils.formatEther(bid.amount)}`;
}

/**
 * Get the tweet text for an auction ending soon.
 * @returns The auction ending soon text
 */
export function getAuctionEndingSoonTweetText() {
  return `This auction is ending soon! Bid now at https://nouns.wtf`;
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
 * Get the PNG buffer data of a Noun
 * @param tokenId The ERC721 token id
 * @returns The png buffer of the Noun or undefined
 */
export async function getNounPngBuffer(tokenId: string): Promise<Buffer | undefined> {
  const dataURI = await tryF(() => nounsTokenContract.dataURI(tokenId));
  if (isError(dataURI)) {
    console.error(`Error fetching dataURI for token ID ${tokenId}: ${dataURI.message}`);
    return;
  }

  const data: TokenMetadata = JSON.parse(
    Buffer.from(dataURI.substring(29), 'base64').toString('ascii'),
  );
  const svg = Buffer.from(data.image.substring(26), 'base64');
  return sharp(svg).png().toBuffer();
}

/**
 * Generate a counter name with the appropriate
 * prefix
 * @param counterName Counter name to prefix
 * @returns Prefixed counter name
 */
export const buildCounterName = (counterName: string) => `bots_${counterName}`;

/**
 * Build an IPFS gateway URL using an iPFS hash
 * @param ipfsHash IPFS hash to generate a URL to
 * @returns HTTP url using an active IPFS gateway
 */
export const buildIpfsUrl = (ipfsHash: string) => `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
