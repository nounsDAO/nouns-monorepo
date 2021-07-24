import {
  buildCounterName,
  buildIpfsUrl,
  getAuctionCache,
  getAuctionStartedTweetText,
  getNounPngBuffer,
  updateAuctionCache,
} from './utils';
import { internalDiscordWebhook, incrementCounter, twitter, publicDiscordWebhook } from './clients';
import { getLastAuction } from './subgraph';
import { config } from './config';
import { processNewAuction as twitterProcessNewAuction } from './handlers/twitter';
import { processNewAuction as discordProcessNewAuction } from './handlers/discord';
import { processNewAuction as pinataProcessNewAuction } from './handlers/pinata';

/**
 * Process the last auction, update cache and push socials if new auction discovered
 */
async function processLastAuction() {
  const cachedAuctionId = await getAuctionCache();
  const { id: lastAuctionId } = await getLastAuction();
  console.log(
    `processLastAuction cachedAuctionId(${cachedAuctionId}) lastAuctionId(${lastAuctionId})`,
  );

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
}

setInterval(async () => processLastAuction(), 30000);

processLastAuction().then(() => 'processLastAuction');
