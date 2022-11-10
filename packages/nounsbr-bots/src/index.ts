import { buildCounterName } from './utils';
import { internalDiscordWebhook, incrementCounter, publicDiscordWebhook } from './clients';
import { getAllProposals, getLastAuctionBids } from './subgraph';
import {
  getAuctionCache,
  getAuctionEndingSoonCache,
  getBidCache,
  getProposalCache,
  hasWarnedOfExpiry,
  setProposalExpiryWarningSent,
  updateAuctionCache,
  updateAuctionEndingSoonCache,
  updateBidCache,
  updateProposalCache,
} from './cache';
import { IAuctionLifecycleHandler } from './types';
import { config } from './config';
import { TwitterAuctionLifecycleHandler } from './handlers/twitter';
import { DiscordAuctionLifecycleHandler } from './handlers/discord';
import { extractNewVotes, isAtRiskOfExpiry } from './utils/proposals';
import R from 'ramda';

/**
 * Create configured `IAuctionLifecycleHandler`s
 */
const auctionLifecycleHandlers: IAuctionLifecycleHandler[] = [];
if (config.twitterEnabled) {
  auctionLifecycleHandlers.push(new TwitterAuctionLifecycleHandler());
}
if (config.discordEnabled) {
  auctionLifecycleHandlers.push(
    new DiscordAuctionLifecycleHandler([internalDiscordWebhook, publicDiscordWebhook]),
  );
}

/**
 * Seed cache the current auction id
 */
async function setupAuction() {
  const lastAuctionBids = await getLastAuctionBids();
  const lastAuctionId = lastAuctionBids.id;
  await updateAuctionCache(lastAuctionId);
}

/**
 * Process the last auction, update cache and push socials if new auction or respective bid is discovered
 */
async function processAuctionTick() {
  const cachedAuctionId = await getAuctionCache();
  const cachedBidId = await getBidCache();
  const cachedAuctionEndingSoon = await getAuctionEndingSoonCache();
  const lastAuctionBids = await getLastAuctionBids();
  const lastAuctionId = lastAuctionBids.id;
  console.log(
    `processAuctionTick: cachedAuctionId(${cachedAuctionId}) lastAuctionId(${lastAuctionId})`,
  );

  // check if new auction discovered
  if (cachedAuctionId < lastAuctionId) {
    await incrementCounter(buildCounterName(`auctions_discovered`));
    await updateAuctionCache(lastAuctionId);
    await Promise.all(auctionLifecycleHandlers.map(h => h.handleNewAuction(lastAuctionId)));
    await incrementCounter(buildCounterName('auction_cache_updates'));
  }
  await incrementCounter(buildCounterName('auction_process_last_auction'));

  // check if new bid discovered
  if (lastAuctionBids.bids.length > 0 && cachedBidId != lastAuctionBids.bids[0].id) {
    const bid = lastAuctionBids.bids[0];
    await updateBidCache(bid.id);
    await Promise.all(auctionLifecycleHandlers.map(h => h.handleNewBid(lastAuctionId, bid)));
  }

  // check if auction ending soon (within 20 min)
  const currentTimestamp = ~~(Date.now() / 1000); // second timestamp utc
  const endTime = lastAuctionBids.endTime;
  const secondsUntilAuctionEnds = endTime - currentTimestamp;
  if (secondsUntilAuctionEnds < 20 * 60 && cachedAuctionEndingSoon < lastAuctionId) {
    await updateAuctionEndingSoonCache(lastAuctionId);
    await Promise.all(
      auctionLifecycleHandlers.map(h => h.handleAuctionEndingSoon?.(lastAuctionId)),
    );
  }
}

/**
 * Seed cache with current proposals
 */
async function setupGovernance() {
  const proposals = await getAllProposals();
  await Promise.all(proposals.map(p => updateProposalCache(p)));
}

async function processGovernanceTick() {
  const proposals = await getAllProposals();
  console.log(`processGovernanceTick: all proposal ids(${proposals.map(p => p.id).join(',')})`);
  R.map(async proposal => {
    const cachedProposal = await getProposalCache(proposal.id);

    if (cachedProposal === null) {
      // New proposal
      await Promise.all(auctionLifecycleHandlers.map(h => h.handleNewProposal?.(proposal)));
    } else {
      // Proposal has changed status
      if (cachedProposal.status !== proposal.status) {
        await Promise.all(
          auctionLifecycleHandlers.map(h => h.handleUpdatedProposalStatus?.(proposal)),
        );
      }
      const newVotes = extractNewVotes(cachedProposal, proposal);
      R.map(async newVote => {
        // New proposal votes
        await Promise.all(
          auctionLifecycleHandlers.map(h => h.handleGovernanceVote?.(proposal, newVote)),
        );
      }, newVotes);

      // Proposal is at-risk of expiry
      if (isAtRiskOfExpiry(proposal) && !(await hasWarnedOfExpiry(proposal.id))) {
        await Promise.all(
          auctionLifecycleHandlers.map(h => h.handleProposalAtRiskOfExpiry?.(proposal)),
        );
        await setProposalExpiryWarningSent(proposal.id);
      }
    }
    await updateProposalCache(proposal);
  }, proposals);
}

setInterval(async () => processAuctionTick(), 30000);
setInterval(async () => processGovernanceTick(), 60000);
setupAuction().then(() => 'setupAuction');
setupGovernance().then(() => 'setupGovernance');
