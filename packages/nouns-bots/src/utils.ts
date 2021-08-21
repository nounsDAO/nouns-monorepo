import { ethers } from 'ethers';
import sharp from 'sharp';
import { isError, tryF } from 'ts-try';
import { nounsTokenContract, redis } from './clients';
import { Bid, TokenMetadata } from './types';

/**
 * Get tweet text for auction started.
 * @param auctionId The started auction id.
 * @param durationSeconds The duration of the auction in seconds.
 * @returns Text to be used in tweet when auction starts.
 */
export function formatAuctionStartedTweetText(auctionId: number) {
  return `＊Bleep Bloop Blop＊
        
 An auction has started for Noun #${auctionId}
 Learn more at https://nouns.wtf`;
}

/**
 * Get the formatted text for a new bid.
 * @param id The auction/noun id
 * @param bid The amount of the current bid
 * @returns The bid update tweet text
 */
export function formatBidMessageText(id: number, bid: Bid) {
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
