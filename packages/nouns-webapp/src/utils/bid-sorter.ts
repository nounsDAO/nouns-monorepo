import { IBid } from '@/wrappers/subgraph';

/**
 * Sorts bids chronologically using block timestamp and
 * transaction index within the block.
 * @param a First bid
 * @param b Second bid
 */
export const compareBidsChronologically = (a: IBid, b: IBid): number => {
  const adjustedTimes = {
    a: BigInt(a.blockTimestamp) * BigInt(1_000_000) + BigInt(a.txIndex ?? 0),
    b: BigInt(b.blockTimestamp) * BigInt(1_000_000) + BigInt(b.txIndex ?? 0),
  };
  // Convert the bigint difference to a number for the sort function
  return Number(adjustedTimes.b - adjustedTimes.a);
};
