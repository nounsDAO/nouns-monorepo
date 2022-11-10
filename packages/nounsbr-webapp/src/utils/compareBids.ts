import { BigNumber } from 'ethers';

const blockMultiple = BigNumber.from(1_000_000);

const generateBidScore = (bid: any) =>
  BigNumber.from(bid.blockNumber).mul(blockMultiple).add(BigNumber.from(bid.txIndex));

export const compareBids = (bidA: any, bidB: any): number => {
  const aScore = generateBidScore(bidA);
  const bScore = generateBidScore(bidB);
  return aScore.sub(bScore).toNumber();
};
