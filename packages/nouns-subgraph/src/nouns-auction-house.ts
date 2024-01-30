import { BigInt, log } from '@graphprotocol/graph-ts';
import {
  AuctionBid,
  AuctionCreated,
  AuctionExtended,
  AuctionSettled,
} from './types/NounsAuctionHouse/NounsAuctionHouse';
import {
  AuctionSettled as AuctionSettledV2,
  AuctionBid as AuctionBidV2,
} from './types/NounsAuctionHouseV2/NounsAuctionHouseV2';
import { Auction, Noun, Bid } from './types/schema';
import { getOrCreateAccount } from './utils/helpers';

class BidData {
  nounId: string;
  bidderAddress: string;
  value: BigInt;
  txHash: string;
  txIndex: BigInt;
  blockNumber: BigInt;
  blockTimestamp: BigInt;
  clientId: BigInt;

  constructor(
    nounId: string,
    bidderAddress: string,
    value: BigInt,
    txHash: string,
    txIndex: BigInt,
    blockNumber: BigInt,
    blockTimestamp: BigInt,
    clientId: BigInt,
  ) {
    this.nounId = nounId;
    this.bidderAddress = bidderAddress;
    this.value = value;
    this.txHash = txHash;
    this.txIndex = txIndex;
    this.blockNumber = blockNumber;
    this.blockTimestamp = blockTimestamp;
    this.clientId = clientId;
  }
}

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
  let bidData = new BidData(
    event.params.nounId.toString(),
    event.params.sender.toHex(),
    event.params.value,
    event.transaction.hash.toHex(),
    event.transaction.index,
    event.block.number,
    event.block.timestamp,
    BigInt.fromI32(0),
  );

  handleBidData(bidData);
}

export function handleAuctionBidWithClientId(event: AuctionBidV2): void {
  let bidData = new BidData(
    event.params.nounId.toString(),
    event.params.sender.toHex(),
    event.params.value,
    event.transaction.hash.toHex(),
    event.transaction.index,
    event.block.number,
    event.block.timestamp,
    event.params.clientId,
  );

  handleBidData(bidData);
}

function handleBidData(bidData: BidData): void {
  let bidder = getOrCreateAccount(bidData.bidderAddress);
  let auction = Auction.load(bidData.nounId);
  if (auction == null) {
    log.error('[handleAuctionBid] Auction not found for Noun #{}. Hash: {}', [
      bidData.nounId,
      bidData.txHash,
    ]);
    return;
  }

  auction.amount = bidData.value;
  auction.bidder = bidder.id;
  auction.save();

  // Save Bid
  let bid = new Bid(bidData.txHash);
  bid.bidder = bidder.id;
  bid.amount = auction.amount;
  bid.noun = auction.noun;
  bid.txIndex = bidData.txIndex;
  bid.blockNumber = bidData.blockNumber;
  bid.blockTimestamp = bidData.blockTimestamp;
  bid.auction = auction.id;
  bid.clientId = bidData.clientId.toI32();
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

export function handleAuctionSettledWithClientId(event: AuctionSettledV2): void {
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
  auction.clientId = event.params.clientId.toI32();
  auction.save();
}
