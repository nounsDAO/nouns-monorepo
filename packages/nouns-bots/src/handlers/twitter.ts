import { getAuctionReplyTweetId, updateAuctionEndingSoonCache, updateAuctionReplyTweetId, updateBidCache } from '../cache';
import { twitter } from '../clients';
import { config } from '../config';
import { IAuctionLifecycleHandler, Bid } from '../types';
import {
  getAuctionEndingSoonTweetText,
  getAuctionStartedTweetText,
  getBidTweetText,
  getNounPngBuffer,
} from '../utils';

export class TwitterAuctionLifecycleHandler implements IAuctionLifecycleHandler {
  /**
   * Tweet a picture of the current noun alerting users
   * to the new auction and update the tweet reply id cache
   * @param auctionId The current auction ID
   */
  async handleNewAuction(auctionId: number) {
    if (!config.twitterEnabled) return;
    const png = await getNounPngBuffer(auctionId.toString());
    if (png) {
      console.log(`handleNewAuction tweeting discovered auction id ${auctionId}`);
      const mediaId = await twitter.v1.uploadMedia(png, { type: 'png' });
      const tweet = await twitter.v1.tweet(getAuctionStartedTweetText(auctionId), {
        media_ids: mediaId,
      });
      await updateAuctionReplyTweetId(tweet.id_str);
    }
    console.log(`tweeted new auction ${auctionId}`);
  }

  /**
   * Tweet a reply with new bid information to the reply id cache
   * We intentionally update the bid cache before safety checks to ensure we do not double tweet a bid
   * @param auctionId The current auction id
   * @param bid The current bid
   */
  async handleNewBid(auctionId: number, bid: Bid) {
    if (!config.twitterEnabled) return;
    await updateBidCache(bid.id);
    const tweetReplyId = await getAuctionReplyTweetId();
    if (!tweetReplyId) {
      console.error(`handleNewBid no reply tweet id exists: auction(${auctionId}) bid(${bid.id})`);
      return;
    }
    const tweet = await twitter.v1.reply(getBidTweetText(auctionId, bid), tweetReplyId);
    await updateAuctionReplyTweetId(tweet.id_str);
    console.log(`tweeted bid update ${bid.id} for auction ${auctionId}`);
  }

  /**
   * Tweet a reply informing observers that the auction is ending soon
   * @param auctionId The current auction id
   */
  async handleAuctionEndingSoon(auctionId: number) {
    if (!config.twitterEnabled) return;
    await updateAuctionEndingSoonCache(auctionId);
    const tweetReplyId = await getAuctionReplyTweetId();
    if (!tweetReplyId) {
      console.error(`handleAuctionEndingSoon no reply tweet id exists for auction ${auctionId}`);
      return;
    }
    const tweet = await twitter.v1.reply(getAuctionEndingSoonTweetText(), tweetReplyId);
    await updateAuctionReplyTweetId(tweet.id_str);
    console.log(`tweeted auction ending soon update for auction ${auctionId}`);
  }
}
