import { twitter } from '../clients';
import { config } from '../config';
import { Bid } from '../types';
import { getAuctionStartedTweetText, getBidReplyTweetId, getBidTweetText, getNounPngBuffer, updateBidCache, updateBidReplyTweetId } from '../utils';

/**
 * Process a new auction event
 *
 * This will tweet a picture of the current noun alerting users
 * to the new auction
 * @param auctionId Auction ID o announce
 * @returns void
 */
export async function processNewAuction(auctionId: number) {
  if (!config.twitterEnabled) return;
  const png = await getNounPngBuffer(auctionId.toString());
  if (png) {
    console.log(`processLastAuction tweeting discovered auction id and noun`);
    const mediaId = await twitter.v1.uploadMedia(png, { type: 'png' });
    const tweet = await twitter.v1.tweet(getAuctionStartedTweetText(auctionId), {
      media_ids: mediaId,
    });
    await updateBidReplyTweetId(tweet.id_str);
  }
  console.log('tweeted auction update');
};

/**
 * Process a new bid and tweet out a reply update to an existing tweet
 * We intentionally update the bid cache before safety checks to ensure we do not double tweet a bid
 * @param id The auction/noun id
 * @param bid The bid
 */
export async function processNewBid(id: number, bid: Bid) {
  await updateBidCache(bid.id);
  const tweetReplyId = await getBidReplyTweetId();
  if (!tweetReplyId) {
    console.error(`twitter::processNewBid no reply tweet id exists: auction(${id}) bid(${bid.id})`);
    return;
  }
  const tweet = await twitter.v1.reply(getBidTweetText(id, bid), tweetReplyId);
  await updateBidReplyTweetId(tweet.id_str);
  console.log('tweeted bid update');
}
