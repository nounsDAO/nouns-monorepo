import { ethers } from 'ethers';
import sharp from 'sharp';
import { isError, tryF } from 'ts-try';
import { nounsTokenContract } from './clients';
import { Bid, Proposal, TokenMetadata, Vote, VoteDirection } from './types';
import { extractProposalTitle } from './utils/proposals';

const shortAddress = (address: string) =>
  `${address.substr(0, 4)}...${address.substr(address.length - 4)}`;

const voteDirectionToText = (direction: VoteDirection) => {
  const map = {
    [VoteDirection.FOR]: 'for',
    [VoteDirection.AGAINST]: 'against',
    [VoteDirection.ABSTAIN]: 'to abstain on',
  };
  return map[direction];
};

/**
 * Try to reverse resolve an ENS domain and return it for display,
 * If no result truncate the address and return it
 * @param address The address to ENS lookup or format
 * @returns The resolved ENS lookup domain or a formatted address
 */
export async function resolveEnsOrFormatAddress(address: string) {
  return (await ethers.getDefaultProvider().lookupAddress(address)) || shortAddress(address);
}

/**
 * Get tweet text for auction started.
 * @param auctionId The started auction id.
 * @param durationSeconds The duration of the auction in seconds.
 * @returns Text to be used in tweet when auction starts.
 */
export function formatAuctionStartedTweetText(auctionId: number) {
  return `＊Bleep Bloop Blop＊
        
 An auction has started for Noun #${auctionId}
 Learn more at https://nouns.wtf`;
}

/**
 * Get the formatted text for a new bid.
 * @param id The auction/noun id
 * @param bid The amount of the current bid
 * @returns The bid update tweet text
 */
export async function formatBidMessageText(id: number, bid: Bid) {
  const bidder = await resolveEnsOrFormatAddress(bid.bidder.id);
  return `Noun ${id} has received a bid of Ξ${ethers.utils.formatEther(bid.amount)} from ${bidder}`;
}

/**
 * Get the tweet text for an auction ending soon.
 * @returns The auction ending soon text
 */
export function getAuctionEndingSoonTweetText() {
  return `This auction is ending soon! Bid now at https://nouns.wtf`;
}

export function formatNewGovernanceProposalText(proposal: Proposal) {
  return `A new NounsDAO proposal (#${proposal.id}) has been created: ${extractProposalTitle(
    proposal,
  )}`;
}

export function formatUpdatedGovernanceProposalStatusText(proposal: Proposal) {
  return `Nouns DAO proposal #${proposal.id} (${extractProposalTitle(
    proposal,
  )}) has changed to status: ${proposal.status.toLocaleLowerCase()}`;
}

export function formatProposalAtRiskOfExpiryText(proposal: Proposal) {
  return `Nouns DAO proposal #${proposal.id} (${extractProposalTitle(
    proposal,
  )}) expires in less than two days. Please execute it immediately!`;
}

export async function formatNewGovernanceVoteText(proposal: Proposal, vote: Vote) {
  return `${await resolveEnsOrFormatAddress(vote.voter.id)} has voted ${voteDirectionToText(
    vote.supportDetailed,
  )} Proposal #${proposal.id} (${extractProposalTitle(proposal)})${
    vote.reason ? `\n\nReason: ${vote.reason}` : ''
  }`;
}

/**
 * Get the PNG buffer data of a Noun
 * @param tokenId The ERC721 token id
 * @returns The png buffer of the Noun or undefined
 */
export async function getNounPngBuffer(tokenId: string): Promise<Buffer | undefined> {
  const dataURI = await tryF(() => nounsTokenContract.dataURI(tokenId));
  if (isError(dataURI)) {
    console.error(`Error fetching dataURI for token ID ${tokenId}: ${dataURI.message}`);
    return;
  }

  const data: TokenMetadata = JSON.parse(
    Buffer.from(dataURI.substring(29), 'base64').toString('ascii'),
  );
  const svg = Buffer.from(data.image.substring(26), 'base64');
  return sharp(svg).png().toBuffer();
}

/**
 * Generate a counter name with the appropriate
 * prefix
 * @param counterName Counter name to prefix
 * @returns Prefixed counter name
 */
export const buildCounterName = (counterName: string) => `bots_${counterName}`;
