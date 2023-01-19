import { Auction } from '../wrappers/n00unsAuction';
import { AuctionState } from '../state/slices/auction';
import { BigNumber } from '@ethersproject/bignumber';

export const isN00underN00un = (n00unId: BigNumber) => {
  return n00unId.mod(10).eq(0) || n00unId.eq(0);
};

const emptyN00underAuction = (onDisplayAuctionId: number): Auction => {
  return {
    amount: BigNumber.from(0).toJSON(),
    bidder: '',
    startTime: BigNumber.from(0).toJSON(),
    endTime: BigNumber.from(0).toJSON(),
    n00unId: BigNumber.from(onDisplayAuctionId).toJSON(),
    settled: false,
  };
};

const findAuction = (id: BigNumber, auctions: AuctionState[]): Auction | undefined => {
  return auctions.find(auction => {
    return BigNumber.from(auction.activeAuction?.n00unId).eq(id);
  })?.activeAuction;
};

/**
 *
 * @param n00unId
 * @param pastAuctions
 * @returns empty `Auction` object with `startTime` set to auction after param `n00unId`
 */
export const generateEmptyN00underAuction = (
  n00unId: BigNumber,
  pastAuctions: AuctionState[],
): Auction => {
  const n00underAuction = emptyN00underAuction(n00unId.toNumber());
  // use n00underAuction.n00unId + 1 to get mint time
  const auctionAbove = findAuction(n00unId.add(1), pastAuctions);
  const auctionAboveStartTime = auctionAbove && BigNumber.from(auctionAbove.startTime);
  if (auctionAboveStartTime) n00underAuction.startTime = auctionAboveStartTime.toJSON();

  return n00underAuction;
};
