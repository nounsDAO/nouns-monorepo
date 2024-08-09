import { BigInt, log } from '@graphprotocol/graph-ts';
import {
  AuctionBid,
  AuctionCreated,
  AuctionExtended,
  AuctionSettled,
} from './types/NounsAuctionHouse/NounsAuctionHouse';
import {
  AuctionSettledWithClientId,
  AuctionBidWithClientId,
} from './types/NounsAuctionHouseV2/NounsAuctionHouseV2';
import { Auction, Noun, Bid } from './types/schema';
import { getOrCreateAccount } from './utils/helpers';

export function handleAuctionCreated(event: AuctionCreated): void {
  let nounId = event.params.nounId.toString();

  let noun = Noun.load(nounId);
  if (noun == null) {
    log.error('[handleAuctionCreated] Noun #{} not found. Hash: {}', [
      nounId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  let auction = new Auction(nounId);
  auction.noun = noun.id;
  auction.amount = BigInt.fromI32(0);
  auction.startTime = event.params.startTime;
  auction.endTime = event.params.endTime;
  auction.settled = false;
  auction.clientId = 0;
  auction.save();
}

export function handleAuctionBid(event: AuctionBid): void {
  let bidder = getOrCreateAccount(event.params.sender.toHex());
  let auction = Auction.load(event.params.nounId.toString());
  if (auction == null) {
    log.error('[handleAuctionBid] Auction not found for Noun #{}. Hash: {}', [
      event.params.nounId.toString(),
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  auction.amount = event.params.value;
  auction.bidder = bidder.id;
  auction.save();

  // Save Bid
  const bidId = event.params.nounId.toString().concat('-').concat(event.params.value.toString());
  let bid = new Bid(bidId);
  bid.bidder = bidder.id;
  bid.amount = auction.amount;
  bid.noun = auction.noun;
  bid.txHash = event.transaction.hash;
  bid.txIndex = event.transaction.index;
  bid.blockNumber = event.block.number;
  bid.blockTimestamp = event.block.timestamp;
  bid.auction = auction.id;
  bid.save();
}

export function handleAuctionBidWithClientId(event: AuctionBidWithClientId): void {
  const bidId = event.params.nounId.toString().concat('-').concat(event.params.value.toString());
  const bid = Bid.load(bidId);
  if (bid == null) {
    log.error('[handleAuctionBidWithClientId] Bid not found for Noun #{}. Hash: {}', [
      event.params.nounId.toString(),
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  bid.clientId = event.params.clientId.toI32();
  bid.save();
}

export function handleAuctionExtended(event: AuctionExtended): void {
  let nounId = event.params.nounId.toString();

  let auction = Auction.load(nounId);
  if (auction == null) {
    log.error('[handleAuctionExtended] Auction not found for Noun #{}. Hash: {}', [
      nounId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  auction.endTime = event.params.endTime;
  auction.save();
}

export function handleAuctionSettled(event: AuctionSettled): void {
  let nounId = event.params.nounId.toString();
  let auction = Auction.load(nounId);
  if (auction == null) {
    log.error('[handleAuctionSettled] Auction not found for Noun #{}. Hash: {}', [
      nounId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  auction.settled = true;
  auction.save();
}

export function handleAuctionSettledWithClientId(event: AuctionSettledWithClientId): void {
  let nounId = event.params.nounId.toString();
  let auction = Auction.load(nounId);
  if (auction == null) {
    log.error('[handleAuctionSettled] Auction not found for Noun #{}. Hash: {}', [
      nounId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  auction.clientId = event.params.clientId.toI32();
  auction.save();
}
