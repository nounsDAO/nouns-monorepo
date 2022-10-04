import { Auction } from '../wrappers/nounsAuction';
import { AuctionState } from '../state/slices/auction';
import { BigNumber } from '@ethersproject/bignumber';

export const isRewardNoun = (nounId: BigNumber) => {
  return (nounId.mod(10).eq(0) || nounId.eq(0)) && nounId.lte(730);
};

export const isNounderNoun = (nounId: BigNumber) => {
  return (nounId.mod(30).eq(0) || nounId.eq(0)) && nounId.lte(730);
};

export const isPNounsTreasuryNoun = (nounId: BigNumber) => {
  return nounId.sub(10).mod(30).eq(0) && nounId.lte(730);
};

export const isNounsTreasuryNoun = (nounId: BigNumber) => {
  return nounId.sub(20).mod(30).eq(0) && nounId.lte(730);
};

export const rewardRecipient = (nounId: BigNumber): string => {
  return isNounderNoun(nounId)
    ? 'pNounders.eth'
    : isPNounsTreasuryNoun(nounId)
    ? 'executor.PublicNouns.eth'
    : isNounsTreasuryNoun(nounId)
    ? '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10'
    : 'n/a';
};

const emptyNounderAuction = (onDisplayAuctionId: number): Auction => {
  return {
    amount: BigNumber.from(0).toJSON(),
    bidder: '',
    startTime: BigNumber.from(0).toJSON(),
    endTime: BigNumber.from(0).toJSON(),
    nounId: BigNumber.from(onDisplayAuctionId).toJSON(),
    settled: false,
  };
};

const findAuction = (id: BigNumber, auctions: AuctionState[]): Auction | undefined => {
  return auctions.find(auction => {
    return BigNumber.from(auction.activeAuction?.nounId).eq(id);
  })?.activeAuction;
};

/**
 *
 * @param nounId
 * @param pastAuctions
 * @returns empty `Auction` object with `startTime` set to auction after param `nounId`
 */
export const generateEmptyNounderAuction = (
  nounId: BigNumber,
  pastAuctions: AuctionState[],
): Auction => {
  const nounderAuction = emptyNounderAuction(nounId.toNumber());
  // use nounderAuction.nounId + 1 to get mint time
  const auctionAbove = findAuction(nounId.add(1), pastAuctions);
  const auctionAboveStartTime = auctionAbove && BigNumber.from(auctionAbove.startTime);
  if (auctionAboveStartTime) nounderAuction.startTime = auctionAboveStartTime.toJSON();

  return nounderAuction;
};
