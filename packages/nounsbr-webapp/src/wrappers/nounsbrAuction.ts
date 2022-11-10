import { useContractCall } from '@usedapp/core';
import { BigNumber as EthersBN, utils } from 'ethers';
import { NounsBRAuctionHouseABI } from '@nounsbr/sdk';
import config from '../config';
import BigNumber from 'bignumber.js';
import { isNounderBRNounBR } from '../utils/nounderbrNounBR';
import { useAppSelector } from '../hooks';
import { AuctionState } from '../state/slices/auction';

export enum AuctionHouseContractFunction {
  auction = 'auction',
  duration = 'duration',
  minBidIncrementPercentage = 'minBidIncrementPercentage',
  nounsbr = 'nounsbr',
  createBid = 'createBid',
  settleCurrentAndCreateNewAuction = 'settleCurrentAndCreateNewAuction',
}

export interface Auction {
  amount: EthersBN;
  bidder: string;
  endTime: EthersBN;
  startTime: EthersBN;
  nounbrId: EthersBN;
  settled: boolean;
}

const abi = new utils.Interface(NounsBRAuctionHouseABI);

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
    address: config.addresses.nounsbrAuctionHouseProxy,
    method: 'minBidIncrementPercentage',
    args: [],
  });

  if (!minBidIncrement) {
    return;
  }

  return new BigNumber(minBidIncrement[0]);
};

/**
 * Computes timestamp after which a NounBR could vote
 * @param nounbrId TokenId of NounBR
 * @returns Unix timestamp after which NounBR could vote
 */
export const useNounBRCanVoteTimestamp = (nounbrId: number) => {
  const nextNounBRId = nounbrId + 1;

  const nextNounBRIdForQuery = isNounderBRNounBR(EthersBN.from(nextNounBRId)) ? nextNounBRId + 1 : nextNounBRId;

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  const maybeNounBRCanVoteTimestamp = pastAuctions.find((auction: AuctionState, i: number) => {
    const maybeNounBRId = auction.activeAuction?.nounbrId;
    return maybeNounBRId ? EthersBN.from(maybeNounBRId).eq(EthersBN.from(nextNounBRIdForQuery)) : false;
  })?.activeAuction?.startTime;

  if (!maybeNounBRCanVoteTimestamp) {
    // This state only occurs during loading flashes
    return EthersBN.from(0);
  }

  return EthersBN.from(maybeNounBRCanVoteTimestamp);
};
