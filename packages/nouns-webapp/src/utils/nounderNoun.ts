import { Auction } from '../wrappers/nAuction';
import { AuctionState } from '../state/slices/auction';
import { BigNumber } from '@ethersproject/bignumber';

export const isNounderNoun = (tokenId: BigNumber) => {
  return tokenId.mod(10).eq(0) || tokenId.eq(0);
};

const emptyNounderAuction = (onDisplayAuctionId: number): Auction => {
  return {
    amount: BigNumber.from(0).toJSON(),
    bidder: '',
    startTime: BigNumber.from(0).toJSON(),
    endTime: BigNumber.from(0).toJSON(),
    tokenId: BigNumber.from(onDisplayAuctionId).toJSON(),
    settled: false,
  };
};

const findAuction = (id: BigNumber, auctions: AuctionState[]): Auction | undefined => {
  return auctions.find(auction => {
    return BigNumber.from(auction.activeAuction?.tokenId).eq(id);
  })?.activeAuction;
};

/**
 *
 * @param tokenId
 * @param pastAuctions
 * @returns empty `Auction` object with `startTime` set to auction after param `tokenId`
 */
export const generateEmptyNounderAuction = (
  tokenId: BigNumber,
  pastAuctions: AuctionState[],
): Auction => {
  const nounderAuction = emptyNounderAuction(tokenId.toNumber());
  // use nounderAuction.tokenId + 1 to get mint time
  const auctionAbove = findAuction(tokenId.add(1), pastAuctions);
  const auctionAboveStartTime = auctionAbove && BigNumber.from(auctionAbove.startTime);
  if (auctionAboveStartTime) nounderAuction.startTime = auctionAboveStartTime.toJSON();

  return nounderAuction;
};
