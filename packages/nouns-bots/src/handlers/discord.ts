import Discord from 'discord.js';
import { discordWebhook } from "../clients"
import { config } from '../config';

export const processNewAuction = async (auctionId: number) => {
	if (!config.discordEnabled) return;
    discordWebhook.send(
      new Discord.MessageEmbed()
        .setTitle(`Discovered new auction`)
        .setURL('https://nounsdao-dev.web.app/auction')
        .addField('Auction ID', auctionId, true)
        .setTimestamp()
    )
}