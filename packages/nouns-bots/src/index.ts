import { getAuctionCache, updateAuctionCache } from './utils';
import { getLastAuctionId } from './subgraph';
import { twitter } from './clients';

/**
 * Process the last auction, update cache and push socials if new auction discovered
 */
async function processLastAuction() {
  const cachedAuctionId = await getAuctionCache();
  const lastAuctionId = await getLastAuctionId();
  console.log('lastAuctionId', lastAuctionId);

  if (cachedAuctionId < lastAuctionId) {
    await twitter.v1.tweet(['New Auction started', lastAuctionId].join(':'));
    await updateAuctionCache(lastAuctionId);
  }
}

setInterval(
  async () => processLastAuction(),
  30000,
)

processLastAuction().then(
  () => 'processLastAuction',
);
