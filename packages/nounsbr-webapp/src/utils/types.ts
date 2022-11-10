import { BigNumber, BigNumberish } from '@ethersproject/bignumber';

export interface BidEvent {
  nounbrId: BigNumberish;
  sender: string;
  value: BigNumberish;
  extended: boolean;
  transactionHash: string;
  timestamp: BigNumberish;
}

export interface AuctionCreateEvent {
  nounbrId: BigNumberish;
  startTime: BigNumberish;
  endTime: BigNumberish;
  settled: boolean;
}

export interface AuctionSettledEvent {
  nounbrId: BigNumberish;
  winner: string;
  amount: BigNumberish;
}

export interface AuctionExtendedEvent {
  nounbrId: BigNumberish;
  endTime: BigNumberish;
}

export interface Bid {
  nounbrId: BigNumber;
  sender: string;
  value: BigNumber;
  extended: boolean;
  transactionHash: string;
  timestamp: BigNumber;
}
