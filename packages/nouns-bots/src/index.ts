import {
  buildCounterName,
  buildIpfsUrl,
  getAuctionCache,
  getBidCache,
  updateAuctionCache,
} from './utils';
import { internalDiscordWebhook, incrementCounter, publicDiscordWebhook } from './clients';
import { getLastAuctionBids } from './subgraph';
import { processNewAuction as twitterProcessNewAuction, processNewBid as twitterProcessNewBid } from './handlers/twitter';
import { processNewAuction as discordProcessNewAuction } from './handlers/discord';
import { processNewAuction as pinataProcessNewAuction } from './handlers/pinata';

/**
 * Process the last auction, update cache and push socials if new auction or respective bid is discovered
 */
async function processAuction() {
  const cachedAuctionId = await getAuctionCache();
  const cachedBidId = await getBidCache();
  const lastAuctionBids = await getLastAuctionBids();
  const lastAuctionId = lastAuctionBids.id;
  console.log(`processAuction cachedAuctionId(${cachedAuctionId}) lastAuctionId(${lastAuctionId})`);

  // check if new auction discovered
  if (cachedAuctionId < lastAuctionId) {
    const pinataUpload = await pinataProcessNewAuction(lastAuctionId);
    await twitterProcessNewAuction(lastAuctionId);
    if (pinataUpload !== undefined) {
      await discordProcessNewAuction(
        internalDiscordWebhook,
        lastAuctionId,
        buildIpfsUrl(pinataUpload.IpfsHash),
      );
      await discordProcessNewAuction(
        publicDiscordWebhook,
        lastAuctionId,
        buildIpfsUrl(pinataUpload.IpfsHash),
      );
    }
    incrementCounter(buildCounterName(`auctions_discovered`));
    await updateAuctionCache(lastAuctionId);
    incrementCounter(buildCounterName('auction_cache_updates'));
  }
  incrementCounter(buildCounterName('auction_process_last_auction'));

  // check if new bid discovered
  if (lastAuctionBids.bids.length > 0 && cachedBidId != lastAuctionBids.bids[0].id) {
    await twitterProcessNewBid(lastAuctionId, lastAuctionBids.bids[0]);
  }
}

setInterval(
  async () => processAuction(),
  30000,
)

processAuction().then(
  () => 'processAuction',
);
