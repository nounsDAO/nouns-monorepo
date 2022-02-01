import { getAuctionReplyTweetId, updateAuctionReplyTweetId } from '../cache';
import { IAuctionLifecycleHandler, Bid } from '../types';
import { twitter } from '../clients';
import {
  getAuctionEndingSoonTweetText,
  formatAuctionStartedTweetText,
  formatBidMessageText,
  getNounPngBuffer,
} from '../utils';

export class TwitterAuctionLifecycleHandler implements IAuctionLifecycleHandler {
  /**
   * Tweet an image of the current noun alerting users
   * to the new auction and update the tweet reply id cache
   * @param auctionId The current auction ID
   */
  async handleNewAuction(auctionId: number) {
    const png = await getNounPngBuffer(auctionId.toString());
    if (png) {
      console.log(`handleNewAuction tweeting discovered auction id ${auctionId}`);
      const mediaId = await twitter.v1.uploadMedia(png, { type: 'png' });
      const tweet = await twitter.v1.tweet(formatAuctionStartedTweetText(auctionId), {
        media_ids: mediaId,
      });
      await updateAuctionReplyTweetId(tweet.id_str);
    }
    console.log(`processed twitter new auction ${auctionId}`);
  }

  /**
   * Tweet a reply with new bid information to the reply id cache
   * We intentionally update the bid cache before safety checks to ensure we do not double tweet a bid
   * @param auctionId The current auction id
   * @param bid The current bid
   */
  async handleNewBid(auctionId: number, bid: Bid) {
    const tweetReplyId = await getAuctionReplyTweetId();
    if (!tweetReplyId) {
      console.error(`handleNewBid no reply tweet id exists: auction(${auctionId}) bid(${bid.id})`);
      return;
    }
    const tweet = await twitter.v1.reply(await formatBidMessageText(auctionId, bid), tweetReplyId);
    await updateAuctionReplyTweetId(tweet.id_str);
    console.log(`processed twitter new bid ${bid.id}:${auctionId}`);
  }

  /**
   * Tweet a reply informing observers that the auction is ending soon
   * @param auctionId The current auction id
   */
  async handleAuctionEndingSoon(auctionId: number) {
    const tweetReplyId = await getAuctionReplyTweetId();
    if (!tweetReplyId) {
      console.error(`handleAuctionEndingSoon no reply tweet id exists for auction ${auctionId}`);
      return;
    }
    const tweet = await twitter.v1.reply(getAuctionEndingSoonTweetText(), tweetReplyId);
    await updateAuctionReplyTweetId(tweet.id_str);
    console.log(`processed twitter auction ending soon update for auction ${auctionId}`);
  }
}
