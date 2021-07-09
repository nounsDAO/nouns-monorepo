import { useContractCall } from '@usedapp/core';
import { BigNumberish, utils } from 'ethers';
import auctionHouseAbi from '../abis/NounsAuctionHouse.json';
import { Contract } from '@ethersproject/contracts';

export enum AuctionHouseContractFunctions {
  auction = 'auction',
  duration = 'duration',
  minBidIncrementPercentage = 'minBidIncrementPercentage',
  nouns = 'nouns',
  createBid = 'createBid',
  settleCurrentAndCreateNewAuction = 'settleCurrentAndCreateNewAuction',
}

export interface Auction {
  amount: BigNumberish;
  bidder: string;
  endTime: BigNumberish;
  startTime: BigNumberish;
  length: number;
  nounId: BigNumberish;
  settled: boolean;
}

export const auctionHouseInterface = new utils.Interface(auctionHouseAbi);

export const auctionHouseContractFactory = (auctionHouseProxyAddress: string) =>
  new Contract(auctionHouseProxyAddress, auctionHouseInterface);

export const useAuction = (auctionHouseProxyAddress: string) => {
  const auction = useContractCall({
    abi: new utils.Interface(auctionHouseAbi),
    address: auctionHouseProxyAddress,
    method: 'auction',
    args: [],
  }) as { [key: string]: any };
  return auction as Auction;
};
