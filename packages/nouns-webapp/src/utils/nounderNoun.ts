import { Auction } from '../wrappers/nounsbrAuction';
import { AuctionState } from '../state/slices/auction';
import { BigNumber } from '@ethersproject/bignumber';

export const isNounderBRBRNounBR = (nounbrId: BigNumber) => {
  return nounbrId.mod(10).eq(0) || nounbrId.eq(0);
};

const emptyNounderBRBRAuction = (onDisplayAuctionId: number): Auction => {
  return {
    amount: BigNumber.from(0).toJSON(),
    bidder: '',
    startTime: BigNumber.from(0).toJSON(),
    endTime: BigNumber.from(0).toJSON(),
    nounbrId: BigNumber.from(onDisplayAuctionId).toJSON(),
    settled: false,
  };
};

const findAuction = (id: BigNumber, auctions: AuctionState[]): Auction | undefined => {
  return auctions.find(auction => {
    return BigNumber.from(auction.activeAuction?.nounbrId).eq(id);
  })?.activeAuction;
};

/**
 *
 * @param nounbrId
 * @param pastAuctions
 * @returns empty `Auction` object with `startTime` set to auction after param `nounbrId`
 */
export const generateEmptyNounderBRBRAuction = (
  nounbrId: BigNumber,
  pastAuctions: AuctionState[],
): Auction => {
  const nounderbrAuction = emptyNounderBRBRAuction(nounbrId.toNumber());
  // use nounderbrAuction.nounbrId + 1 to get mint time
  const auctionAbove = findAuction(nounbrId.add(1), pastAuctions);
  const auctionAboveStartTime = auctionAbove && BigNumber.from(auctionAbove.startTime);
  if (auctionAboveStartTime) nounderbrAuction.startTime = auctionAboveStartTime.toJSON();

  return nounderbrAuction;
};
