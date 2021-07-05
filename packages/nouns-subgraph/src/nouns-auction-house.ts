import {
  AuctionCreated as AuctionCreatedEvent,
} from "./types/NounsAuctionHouse/NounsAuctionHouse"
import { Auction } from './types/schema';

export function handleAuctionCreated(event: AuctionCreatedEvent): void {
  let nounsAuction = new Auction(event.params.nounId.toString());
  nounsAuction.save();
}
