import { useContractCall } from '@usedapp/core';
import { BigNumber as EthersBN, utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import auctionHouseAbi from '../abis/NounsAuctionHouse.json';
import config from '../config';
import BigNumber from 'bignumber.js';

export enum AuctionHouseContractFunctions {
  auction = 'auction',
  duration = 'duration',
  minBidIncrementPercentage = 'minBidIncrementPercentage',
  nouns = 'nouns',
  createBid = 'createBid',
  settleCurrentAndCreateNewAuction = 'settleCurrentAndCreateNewAuction',
}

export interface Auction {
  amount: EthersBN;
  bidder: string;
  endTime: EthersBN;
  startTime: EthersBN;
  length: number;
  nounId: EthersBN;
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

export const useAuctionMinBidIncPercentage = () => {
  const minBidIncrement = useContractCall({
    abi: new utils.Interface(auctionHouseAbi),
    address: config.auctionProxyAddress,
    method: 'minBidIncrementPercentage',
    args: [],
  });

  if (!minBidIncrement) {
    return;
  }

  return new BigNumber(minBidIncrement[0]);
};
