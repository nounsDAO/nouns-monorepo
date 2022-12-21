import Discord from 'discord.js';
import {
  formatBidMessageText,
  formatNewGovernanceProposalText,
  formatNewGovernanceVoteText,
  formatProposalAtRiskOfExpiryText,
  formatUpdatedGovernanceProposalStatusText,
  getNounPngBuffer,
} from '../utils';
import { Bid, IAuctionLifecycleHandler, Proposal, Vote } from '../types';

export class DiscordWebhookAuctionLifecycleHandler implements IAuctionLifecycleHandler {
  constructor(public readonly discordClients: Discord.WebhookClient[]) {}

  /**
   * Send Discord message with an image of the current noun alerting users
   * @param auctionId The current auction ID
   */
  async handleNewAuction(auctionId: number) {
    const png = await getNounPngBuffer(auctionId.toString());
    if (png) {
      const attachmentName = `Auction-${auctionId}.png`;
      const attachment = new Discord.AttachmentBuilder(png, {name: attachmentName});
      const embed = new Discord.EmbedBuilder()
        .setTitle(`New Auction Discovered`)
        .setDescription(`An auction has started for Noun #${auctionId}`)
        .setURL('https://nouns.wtf')
        .addFields([{name: 'Noun ID', value: auctionId.toString(), inline: true}])
        .setImage(`attachment://${attachmentName}`)
        .setTimestamp();
      await Promise.all(this.discordClients.map(c => c.send({embeds: [embed], files: [attachment]})));
    }
    console.log(`processed discord new auction ${auctionId}`);
  }

  /**
   * Send Discord message with new bid event data
   * @param auctionId Noun auction number
   * @param bid Bid amount and ID
   */
  async handleNewBid(auctionId: number, bid: Bid) {
    const embed = new Discord.EmbedBuilder()
      .setTitle(`New Bid Placed`)
      .setURL('https://nouns.wtf')
      .setDescription(await formatBidMessageText(auctionId, bid))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send({embeds:[embed]})));
    console.log(`processed discord new bid ${auctionId}:${bid.id}`);
  }

  async handleNewProposal(proposal: Proposal) {
    const embed = new Discord.EmbedBuilder()
      .setTitle(`New Governance Proposal`)
      .setURL(`https://nouns.wtf/vote/${proposal.id}`)
      .setDescription(formatNewGovernanceProposalText(proposal))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send({embeds: [embed]})));
    console.log(`processed discord new proposal ${proposal.id}`);
  }

  async handleUpdatedProposalStatus(proposal: Proposal) {
    const embed = new Discord.EmbedBuilder()
      .setTitle(`Proposal Status Update`)
      .setURL(`https://nouns.wtf/vote/${proposal.id}`)
      .setDescription(formatUpdatedGovernanceProposalStatusText(proposal))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send({embeds: [embed]})));
    console.log(`processed discord proposal update ${proposal.id}`);
  }

  async handleProposalAtRiskOfExpiry(proposal: Proposal) {
    const embed = new Discord.EmbedBuilder()
      .setTitle(`Proposal At-Risk of Expiry`)
      .setURL(`https://nouns.wtf/vote/${proposal.id}`)
      .setDescription(formatProposalAtRiskOfExpiryText(proposal))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send({embeds: [embed]})));
    console.log(`processed discord proposal expiry warning ${proposal.id}`);
  }

  async handleGovernanceVote(proposal: Proposal, vote: Vote) {
    const embed = new Discord.EmbedBuilder()
      .setTitle(`New Proposal Vote`)
      .setURL(`https://nouns.wtf/vote/${proposal.id}`)
      .setDescription(await formatNewGovernanceVoteText(proposal, vote))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send({embeds: [embed]})));
    console.log(`processed discord new vote for proposal ${proposal.id};${vote.id}`);
  }
}
