import {
  buildCounterName,
  getAuctionCache,
  getAuctionStartedTweetText,
  getNounPngBuffer,
  updateAuctionCache,
} from './utils';
import { discordWebhook, incrementCounter, twitter } from './clients';
import { getLastAuction } from './subgraph';
import { config } from './config';
import { processNewAuction as twitterProcessNewAuction } from './handlers/twitter';
import { processNewAuction as discordProcessNewAuction } from './handlers/discord';

/**
 * Process the last auction, update cache and push socials if new auction discovered
 */
async function processLastAuction() {
  const cachedAuctionId = await getAuctionCache();
  const { id: lastAuctionId } = await getLastAuction();
  console.log(`processLastAuction cachedAuctionId(${cachedAuctionId}) lastAuctionId(${lastAuctionId})`);

  if (cachedAuctionId < lastAuctionId) {

    await twitterProcessNewAuction(lastAuctionId)
    await discordProcessNewAuction(lastAuctionId)
    incrementCounter(buildCounterName(`auctions_discovered`));
    await updateAuctionCache(lastAuctionId);
    incrementCounter(buildCounterName('auction_cache_updates'));
  }
  incrementCounter(buildCounterName('auction_process_last_auction'));
}

setInterval(
  async () => processLastAuction(),
  30000,
)

processLastAuction().then(
  () => 'processLastAuction',
);
