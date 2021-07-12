
import { getAuctionCache, getAuctionStartedTweetText, getNounPngBuffer, updateAuctionCache } from './utils';
import { getLastAuctionId } from './subgraph';
import { twitter } from './clients';

/**
 * Process the last auction, update cache and push socials if new auction discovered
 */
async function processLastAuction() {
  const cachedAuctionId = await getAuctionCache();
  const lastAuctionId = await getLastAuctionId();
  console.log(`processLastAuction cachedAuctionId(${cachedAuctionId}) lastAuctionId(${lastAuctionId})`);


  if (cachedAuctionId < lastAuctionId) {
    const png = await getNounPngBuffer(lastAuctionId.toString());
    if(png) {
      console.log(`processLastAuction tweeting discovered auction id and noun`);
      const mediaId = await twitter.v1.uploadMedia(png, { type: 'png' });
      await twitter.v1.tweet(
        getAuctionStartedTweetText(lastAuctionId),
        {
          media_ids: mediaId,
        },
      );
    } else {
      console.error(`Error generating png for noun auction ${lastAuctionId}`);
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
