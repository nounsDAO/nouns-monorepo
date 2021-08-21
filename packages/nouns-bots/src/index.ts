import { buildCounterName } from './utils';
import { internalDiscordWebhook, incrementCounter, publicDiscordWebhook } from './clients';
import { getLastAuctionBids } from './subgraph';
import {
  getAuctionCache,
  getAuctionEndingSoonCache,
  getBidCache,
  updateAuctionCache,
  updateAuctionEndingSoonCache,
  updateBidCache,
} from './cache';
import { IAuctionLifecycleHandler } from './types';
import { config } from './config';
import { TwitterAuctionLifecycleHandler } from './handlers/twitter';
import { DiscordAuctionLifecycleHandler } from './handlers/discord';

/**
 * Create configured `IAuctionLifecycleHandler`s
 */
const auctionLifecycleHandlers: IAuctionLifecycleHandler[] = [];
if (config.twitterEnabled) {
  auctionLifecycleHandlers.push(new TwitterAuctionLifecycleHandler());
}
if (config.discordEnabled) {
  auctionLifecycleHandlers.push(
    new DiscordAuctionLifecycleHandler([internalDiscordWebhook, publicDiscordWebhook]),
  );
}

/**
 * Process the last auction, update cache and push socials if new auction or respective bid is discovered
 */
async function processAuctionTick() {
  const cachedAuctionId = await getAuctionCache();
  const cachedBidId = await getBidCache();
  const cachedAuctionEndingSoon = await getAuctionEndingSoonCache();
  const lastAuctionBids = await getLastAuctionBids();
  const lastAuctionId = lastAuctionBids.id;
  console.log(
    `processAuctionTick: cachedAuctionId(${cachedAuctionId}) lastAuctionId(${lastAuctionId})`,
  );

  // check if new auction discovered
  if (cachedAuctionId < lastAuctionId) {
    await incrementCounter(buildCounterName(`auctions_discovered`));
    await updateAuctionCache(lastAuctionId);
    await Promise.all(auctionLifecycleHandlers.map(h => h.handleNewAuction(lastAuctionId)));
    await incrementCounter(buildCounterName('auction_cache_updates'));
  }
  await incrementCounter(buildCounterName('auction_process_last_auction'));

  // check if new bid discovered
  if (lastAuctionBids.bids.length > 0 && cachedBidId != lastAuctionBids.bids[0].id) {
    const bid = lastAuctionBids.bids[0];
    await updateBidCache(bid.id);
    await Promise.all(auctionLifecycleHandlers.map(h => h.handleNewBid(lastAuctionId, bid)));
  }

  // check if auction ending soon (within 20 min)
  const currentTimestamp = ~~(Date.now() / 1000); // second timestamp utc
  const endTime = lastAuctionBids.endTime;
  const secondsUntilAuctionEnds = endTime - currentTimestamp;
  if (secondsUntilAuctionEnds < 20 * 60 && cachedAuctionEndingSoon < lastAuctionId) {
    await updateAuctionEndingSoonCache(lastAuctionId);
    await Promise.all(auctionLifecycleHandlers.map(h => h.handleAuctionEndingSoon(lastAuctionId)));
  }
}

setInterval(async () => processAuctionTick(), 30000);
processAuctionTick().then(() => 'processAuctionTick');
