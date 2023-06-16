import { BigInt, log } from '@graphprotocol/graph-ts';
import {
  AuctionBid,
  AuctionCreated,
  AuctionExtended,
  AuctionSettled,
} from './types/N00unsAuctionHouse/N00unsAuctionHouse';
import { Auction, N00un, Bid } from './types/schema';
import { getOrCreateAccount } from './utils/helpers';

export function handleAuctionCreated(event: AuctionCreated): void {
  const n00unId = event.params.n00unId.toString();

  const n00un = N00un.load(n00unId);
  if (n00un == null) {
    log.error('[handleAuctionCreated] N00un #{} not found. Hash: {}', [
      n00unId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  const auction = new Auction(n00unId);
  auction.n00un = n00un.id;
  auction.amount = BigInt.fromI32(0);
  auction.startTime = event.params.startTime;
  auction.endTime = event.params.endTime;
  auction.settled = false;
  auction.save();
}

export function handleAuctionBid(event: AuctionBid): void {
  const n00unId = event.params.n00unId.toString();
  const bidderAddress = event.params.sender.toHex();

  const bidder = getOrCreateAccount(bidderAddress);

  const auction = Auction.load(n00unId);
  if (auction == null) {
    log.error('[handleAuctionBid] Auction not found for N00un #{}. Hash: {}', [
      n00unId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  auction.amount = event.params.value;
  auction.bidder = bidder.id;
  auction.save();

  // Save Bid
  const bid = new Bid(event.transaction.hash.toHex());
  bid.bidder = bidder.id;
  bid.amount = auction.amount;
  bid.n00un = auction.n00un;
  bid.txIndex = event.transaction.index;
  bid.blockNumber = event.block.number;
  bid.blockTimestamp = event.block.timestamp;
  bid.auction = auction.id;
  bid.save();
}

export function handleAuctionExtended(event: AuctionExtended): void {
  const n00unId = event.params.n00unId.toString();

  const auction = Auction.load(n00unId);
  if (auction == null) {
    log.error('[handleAuctionExtended] Auction not found for N00un #{}. Hash: {}', [
      n00unId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  auction.endTime = event.params.endTime;
  auction.save();
}

export function handleAuctionSettled(event: AuctionSettled): void {
  const n00unId = event.params.n00unId.toString();

  const auction = Auction.load(n00unId);
  if (auction == null) {
    log.error('[handleAuctionSettled] Auction not found for N00un #{}. Hash: {}', [
      n00unId,
      event.transaction.hash.toHex(),
    ]);
    return;
  }

  auction.settled = true;
  auction.save();
}
