import { log } from '@graphprotocol/graph-ts';
import {
  AuctionCreated,
} from "./types/NounsAuctionHouse/NounsAuctionHouse"
import { Auction } from './types/schema';

export function handleAuctionCreated(event: AuctionCreated): void {
  let id = event.params.nounId.toString();
  log.info('[handleAuctionCreated] Add new Auction {} at block {}', [id, event.block.number.toString()]);
  let nounsAuction = new Auction(id);
  nounsAuction.save();
}
