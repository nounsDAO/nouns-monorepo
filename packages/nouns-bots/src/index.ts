import { getAuctionCache, getNounPngBuffer, updateAuctionCache } from './utils';
import { getLastAuctionId } from './subgraph';
import { twitter } from './clients';

/**
 * Process the last auction, update cache and push socials if new auction discovered
 */
async function processLastAuction() {
  const cachedAuctionId = await getAuctionCache();
  const lastAuctionId = await getLastAuctionId();
  console.log('cachedAuctionId', cachedAuctionId);
  console.log('lastAuctionId', lastAuctionId);

  if (cachedAuctionId < lastAuctionId) {
    const png = await getNounPngBuffer(lastAuctionId.toString());
    if(png) {
      const mediaId = await twitter.v1.uploadMedia(png, { type: 'png' });
      await twitter.v1.tweet(
        `An auction has started for noun #${lastAuctionId}!
        
  Learn more at https://nouns.wtf`,
        {
          media_ids: mediaId,
        },
      );
    }
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
