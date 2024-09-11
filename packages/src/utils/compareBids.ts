import { BigNumber } from 'ethers';
import { Bid } from './types';

const timestampMultiple = BigNumber.from(1_000_000);

const generateBidScore = (bid: Bid) =>
  BigNumber.from(bid.timestamp).mul(timestampMultiple).add(bid.transactionIndex);

export const compareBids = (bidA: Bid, bidB: Bid): number => {
  const aScore = generateBidScore(bidA);
  const bScore = generateBidScore(bidB);
  return bScore.sub(aScore).toNumber();
};
