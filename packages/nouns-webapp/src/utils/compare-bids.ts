import { Bid } from './types';

const timestampMultiple = 1_000_000n;

const generateBidScore = (bid: Bid) =>
  BigInt(bid.timestamp) * timestampMultiple + BigInt(bid.transactionIndex);

export const compareBids = (bidA: Bid, bidB: Bid): number => {
  const aScore = generateBidScore(bidA);
  const bScore = generateBidScore(bidB);
  return Number(bScore - aScore);
};
