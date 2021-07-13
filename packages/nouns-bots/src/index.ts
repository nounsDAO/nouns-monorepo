import { getAuctionCache, getAuctionStartedTweetText, getNounPngBuffer, updateAuctionCache } from './utils';
import { getLastAuctionId } from './subgraph';
import { discordWebhook, incrementCounter, twitter } from './clients';
import Discord from 'discord.js';

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
      // const mediaId = await twitter.v1.uploadMedia(png, { type: 'png' });
      // await twitter.v1.tweet(
      //   getAuctionStartedTweetText(lastAuctionId),
      //   {
      //     media_ids: mediaId,
      //   },
      // // );
      // discordWebhook.send(
      //   new Discord.MessageEmbed()
      //   .setTitle(`Discovered new auction`)
      //   .setURL('https://nounsdao-dev.web.app/auction')
      //   .addField('Auction ID', lastAuctionId, true)
      //   .setTimestamp()
      //   )
      incrementCounter(buildCounterName(`auctions_discovered`));
    } else {
      console.error(`Error generating png for noun auction ${lastAuctionId}`);
      discordWebhook.send(`Error generating png for noun auction ${lastAuctionId}`);
      incrementCounter(buildCounterName('error_png_generation'));
    }
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
