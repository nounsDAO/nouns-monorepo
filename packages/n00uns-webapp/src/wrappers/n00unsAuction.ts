import { useContractCall } from '@usedapp/core';
import { BigNumber as EthersBN, utils } from 'ethers';
import { N00unsAuctionHouseABI } from '@n00uns/sdk';
import config from '../config';
import BigNumber from 'bignumber.js';
import { isN00underN00un } from '../utils/n00underN00un';
import { useAppSelector } from '../hooks';
import { AuctionState } from '../state/slices/auction';

export enum AuctionHouseContractFunction {
  auction = 'auction',
  duration = 'duration',
  minBidIncrementPercentage = 'minBidIncrementPercentage',
  n00uns = 'n00uns',
  createBid = 'createBid',
  settleCurrentAndCreateNewAuction = 'settleCurrentAndCreateNewAuction',
}

export interface Auction {
  amount: EthersBN;
  bidder: string;
  endTime: EthersBN;
  startTime: EthersBN;
  n00unId: EthersBN;
  settled: boolean;
}

const abi = new utils.Interface(N00unsAuctionHouseABI);

export const useAuction = (auctionHouseProxyAddress: string) => {
  const auction = useContractCall<Auction>({
    abi,
    address: auctionHouseProxyAddress,
    method: 'auction',
    args: [],
  });
  return auction as Auction;
};

export const useAuctionMinBidIncPercentage = () => {
  const minBidIncrement = useContractCall({
    abi,
    address: config.addresses.n00unsAuctionHouseProxy,
    method: 'minBidIncrementPercentage',
    args: [],
  });

  if (!minBidIncrement) {
    return;
  }

  return new BigNumber(minBidIncrement[0]);
};

/**
 * Computes timestamp after which a N00un could vote
 * @param n00unId TokenId of N00un
 * @returns Unix timestamp after which N00un could vote
 */
export const useN00unCanVoteTimestamp = (n00unId: number) => {
  const nextN00unId = n00unId + 1;

  const nextN00unIdForQuery = isN00underN00un(EthersBN.from(nextN00unId))
    ? nextN00unId + 1
    : nextN00unId;

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  const maybeN00unCanVoteTimestamp = pastAuctions.find((auction: AuctionState, i: number) => {
    const maybeN00unId = auction.activeAuction?.n00unId;
    return maybeN00unId
      ? EthersBN.from(maybeN00unId).eq(EthersBN.from(nextN00unIdForQuery))
      : false;
  })?.activeAuction?.startTime;

  if (!maybeN00unCanVoteTimestamp) {
    // This state only occurs during loading flashes
    return EthersBN.from(0);
  }

  return EthersBN.from(maybeN00unCanVoteTimestamp);
};
