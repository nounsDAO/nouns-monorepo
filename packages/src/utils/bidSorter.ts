import { BigNumber } from '@ethersproject/bignumber';
import { IBid } from '../wrappers/subgraph';

/**
 * Sorts bids chronologically using block timestamp and
 * transaction index within the block.
 * @param a First bid
 * @param b Second bid
 */
export const compareBidsChronologically = (a: IBid, b: IBid): number => {
  const adjustedTimes = {
    a: BigNumber.from(a.blockTimestamp).mul(1_000_000).add(BigNumber.from(a.txIndex)),
    b: BigNumber.from(b.blockTimestamp).mul(1_000_000).add(BigNumber.from(b.txIndex)),
  };
  return adjustedTimes.b.sub(adjustedTimes.a).toNumber();
};
