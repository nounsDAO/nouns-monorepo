import { Auction } from '../wrappers/vrbsAuction';
import { AuctionState } from '../state/slices/auction';
import { BigNumber } from '@ethersproject/bignumber';

export const isFounderVrb = (vrbId: BigNumber) => {
  return vrbId.mod(10).eq(0) || vrbId.eq(0);
};

const emptyFounderAuction = (onDisplayAuctionId: number): Auction => {
  return {
    amount: BigNumber.from(0).toJSON(),
    bidder: '',
    startTime: BigNumber.from(0).toJSON(),
    endTime: BigNumber.from(0).toJSON(),
    vrbId: BigNumber.from(onDisplayAuctionId).toJSON(),
    settled: false,
  };
};

const findAuction = (id: BigNumber, auctions: AuctionState[]): Auction | undefined => {
  return auctions.find(auction => {
    return BigNumber.from(auction.activeAuction?.vrbId).eq(id);
  })?.activeAuction;
};

/**
 *
 * @param vrbId
 * @param pastAuctions
 * @returns empty `Auction` object with `startTime` set to auction after param `vrbId`
 */
export const generateEmptyFounderAuction = (
  vrbId: BigNumber,
  pastAuctions: AuctionState[],
): Auction => {
  const founderAuction = emptyFounderAuction(vrbId.toNumber());
  // use founderAuction.vrbId + 1 to get mint time
  const auctionAbove = findAuction(vrbId.add(1), pastAuctions);
  const auctionAboveStartTime = auctionAbove && BigNumber.from(auctionAbove.startTime);
  if (auctionAboveStartTime) founderAuction.startTime = auctionAboveStartTime.toJSON();

  return founderAuction;
};
