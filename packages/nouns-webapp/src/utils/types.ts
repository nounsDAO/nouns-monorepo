export type Address = `0x${string}`;

export type BigNumberish = bigint | boolean | number | string;

export interface BidEvent {
  nounId: BigNumberish;
  sender: Address;
  value: BigNumberish;
  extended: boolean;
  transactionHash: string;
  transactionIndex: number;
  timestamp: BigNumberish;
}

export interface AuctionCreateEvent {
  nounId: BigNumberish;
  startTime: BigNumberish;
  endTime: BigNumberish;
  settled: boolean;
}

export interface AuctionSettledEvent {
  nounId: BigNumberish;
  winner: Address;
  amount: BigNumberish;
}

export interface AuctionExtendedEvent {
  nounId: BigNumberish;
  endTime: BigNumberish;
}

export interface Bid {
  nounId: bigint;
  sender: Address;
  value: bigint;
  extended: boolean;
  transactionHash: string;
  transactionIndex: number;
  timestamp: bigint;
}
