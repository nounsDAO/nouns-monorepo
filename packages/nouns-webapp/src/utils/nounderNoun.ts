import { AuctionState } from '@/state/slices/auction';
import { Auction } from '@/wrappers/nounsAuction';

export const isNounderNoun = (nounId: bigint) => {
  return nounId % 10n === 0n || nounId === 0n;
};

const emptyNounderAuction = (onDisplayAuctionId: number): Auction => {
  return {
    amount: 0n,
    bidder: '',
    startTime: 0n,
    endTime: 0n,
    nounId: BigInt(onDisplayAuctionId),
    settled: false,
  };
};

const findAuction = (id: bigint, auctions: AuctionState[]): Auction | undefined => {
  return auctions.find(auction => {
    return (
      auction.activeAuction?.nounId !== undefined && BigInt(auction.activeAuction.nounId) === id
    );
  })?.activeAuction;
};

/**
 *
 * @param nounId
 * @param pastAuctions
 * @returns empty `Auction` object with `startTime` set to auction after param `nounId`
 */
export const generateEmptyNounderAuction = (
  nounId: bigint,
  pastAuctions: AuctionState[],
): Auction => {
  const nounderAuction = emptyNounderAuction(Number(nounId));
  // use nounderAuction.nounId + 1 to get mint time
  const auctionAbove = findAuction(nounId + 1n, pastAuctions);
  const auctionAboveStartTime = auctionAbove && BigInt(auctionAbove.startTime);
  if (auctionAboveStartTime) nounderAuction.startTime = auctionAboveStartTime;

  return nounderAuction;
};
