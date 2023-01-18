import Discord from 'discord.js';
import {
  formatBidMessageText,
  formatNewGovernanceProposalText,
  formatNewGovernanceVoteText,
  formatProposalAtRiskOfExpiryText,
  formatUpdatedGovernanceProposalStatusText,
  getN00unPngBuffer,
} from '../utils';
import { Bid, IAuctionLifecycleHandler, Proposal, Vote } from '../types';

export class DiscordAuctionLifecycleHandler implements IAuctionLifecycleHandler {
  constructor(public readonly discordClients: Discord.WebhookClient[]) {}

  /**
   * Send Discord message with an image of the current n00un alerting users
   * @param auctionId The current auction ID
   */
  async handleNewAuction(auctionId: number) {
    const png = await getN00unPngBuffer(auctionId.toString());
    if (png) {
      const attachmentName = `Auction-${auctionId}.png`;
      const attachment = new Discord.MessageAttachment(png, attachmentName);
      const message = new Discord.MessageEmbed()
        .setTitle(`New Auction Discovered`)
        .setDescription(`An auction has started for N00un #${auctionId}`)
        .setURL('https://n00uns.wtf')
        .addField('N00un ID', auctionId, true)
        .attachFiles([attachment])
        .setImage(`attachment://${attachmentName}`)
        .setTimestamp();
      await Promise.all(this.discordClients.map(c => c.send(message)));
    }
    console.log(`processed discord new auction ${auctionId}`);
  }

  /**
   * Send Discord message with new bid event data
   * @param auctionId N00un auction number
   * @param bid Bid amount and ID
   */
  async handleNewBid(auctionId: number, bid: Bid) {
    const message = new Discord.MessageEmbed()
      .setTitle(`New Bid Placed`)
      .setURL('https://n00uns.wtf')
      .setDescription(await formatBidMessageText(auctionId, bid))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord new bid ${auctionId}:${bid.id}`);
  }

  async handleNewProposal(proposal: Proposal) {
    const message = new Discord.MessageEmbed()
      .setTitle(`New Governance Proposal`)
      .setURL(`https://n00uns.wtf/vote/${proposal.id}`)
      .setDescription(formatNewGovernanceProposalText(proposal))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord new proposal ${proposal.id}`);
  }

  async handleUpdatedProposalStatus(proposal: Proposal) {
    const message = new Discord.MessageEmbed()
      .setTitle(`Proposal Status Update`)
      .setURL(`https://n00uns.wtf/vote/${proposal.id}`)
      .setDescription(formatUpdatedGovernanceProposalStatusText(proposal))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord proposal update ${proposal.id}`);
  }

  async handleProposalAtRiskOfExpiry(proposal: Proposal) {
    const message = new Discord.MessageEmbed()
      .setTitle(`Proposal At-Risk of Expiry`)
      .setURL(`https://n00uns.wtf/vote/${proposal.id}`)
      .setDescription(formatProposalAtRiskOfExpiryText(proposal))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord proposal expiry warning ${proposal.id}`);
  }

  async handleGovernanceVote(proposal: Proposal, vote: Vote) {
    const message = new Discord.MessageEmbed()
      .setTitle(`New Proposal Vote`)
      .setURL(`https://n00uns.wtf/vote/${proposal.id}`)
      .setDescription(await formatNewGovernanceVoteText(proposal, vote))
      .setTimestamp();
    await Promise.all(this.discordClients.map(c => c.send(message)));
    console.log(`processed discord new vote for proposal ${proposal.id};${vote.id}`);
  }
}
