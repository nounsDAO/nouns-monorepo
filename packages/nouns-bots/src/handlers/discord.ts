import Discord from 'discord.js';
import { ethers } from 'ethers';
import { config } from '../config';
import { Bid } from '../types';
import { getBidTweetText } from '../utils';

/**
 * Process a new auction event
 * @param client The Discord Webhook client to send the message via
 * @param auctionId The auction ID to include in the message
 * @param imageUrl A URL where the Noun's image is uploaded to
 * @returns void
 */
export const processNewAuction = async (
  client: Discord.WebhookClient,
  auctionId: number,
  imageUrl: string,
) => {
  if (!config.discordEnabled) return;
  client.send(
    new Discord.MessageEmbed()
      .setTitle(`New Auction Discovered`)
      .setDescription(`An auction has started for Noun #${auctionId}`)
      .setURL('https://nouns.wtf')
      .setImage(imageUrl)
      .addField('Noun ID', auctionId, true)
      .setTimestamp(),
  );
  console.log('posted discord update');
};

/**
 * Process a new bid event
 * @param client Discord webhook client
 * @param auctionId Noun auction number
 * @param bid Bid amount and ID
 * @returns void
 */
export const processNewBid = async (client: Discord.WebhookClient, auctionId: number, bid: Bid) => {
  if (!config.discordEnabled) return;
  client.send(
    new Discord.MessageEmbed()
      .setTitle(`New Bid Placed`)
      .setDescription(getBidTweetText(auctionId, bid))
      .setTimestamp(),
  );
  console.log('posted discord bid update');
};
