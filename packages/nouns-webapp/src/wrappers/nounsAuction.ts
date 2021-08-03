import { useContractCall } from '@usedapp/core';
import { BigNumber as EthersBN, utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { NounsAuctionHouseABI } from '@nouns/contracts';
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

const abi = new utils.Interface(NounsAuctionHouseABI);

export const auctionHouseContractFactory = (auctionHouseProxyAddress: string) =>
  new Contract(auctionHouseProxyAddress, abi);

export const useAuction = (auctionHouseProxyAddress: string) => {
  const auction = useContractCall({
    abi,
    address: auctionHouseProxyAddress,
    method: 'auction',
    args: [],
  }) as { [key: string]: any };
  return auction as Auction;
};

export const useAuctionMinBidIncPercentage = () => {
  const minBidIncrement = useContractCall({
    abi,
    address: config.auctionProxyAddress,
    method: 'minBidIncrementPercentage',
    args: [],
  });

  if (!minBidIncrement) {
    return;
  }

  return new BigNumber(minBidIncrement[0]);
};
