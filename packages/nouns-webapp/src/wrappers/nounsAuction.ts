import { Address, BigNumberish } from '@/utils/types';

export interface Auction {
  amount: BigNumberish;
  bidder: Address;
  endTime: BigNumberish;
  startTime: BigNumberish;
  nounId: BigNumberish;
  settled: boolean;
}
