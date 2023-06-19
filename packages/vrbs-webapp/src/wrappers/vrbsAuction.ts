import { useContractCall } from '@usedapp/core';
import { BigNumber as EthersBN, utils } from 'ethers';
import { AuctionHouseABI } from '@vrbs/sdk';
import config from '../config';
import BigNumber from 'bignumber.js';
import { isFounderVrb } from '../utils/founderVrb';
import { useAppSelector } from '../hooks';
import { AuctionState } from '../state/slices/auction';

export enum AuctionHouseContractFunction {
  auction = 'auction',
  duration = 'duration',
  minBidIncrementPercentage = 'minBidIncrementPercentage',
  vrbs = 'vrbs',
  createBid = 'createBid',
  settleCurrentAndCreateNewAuction = 'settleCurrentAndCreateNewAuction',
}

export interface Auction {
  amount: EthersBN;
  bidder: string;
  endTime: EthersBN;
  startTime: EthersBN;
  vrbId: EthersBN;
  settled: boolean;
}

const abi = new utils.Interface(AuctionHouseABI);

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
    address: config.addresses.vrbsAuctionHouseProxy,
    method: 'minBidIncrementPercentage',
    args: [],
  });

  if (!minBidIncrement) {
    return;
  }

  return new BigNumber(minBidIncrement[0]);
};

/**
 * Computes timestamp after which a Vrb could vote
 * @param vrbId TokenId of Vrb
 * @returns Unix timestamp after which Vrb could vote
 */
export const useVrbCanVoteTimestamp = (vrbId: number) => {
  const nextVrbId = vrbId + 1;

  const nextVrbIdForQuery = isFounderVrb(EthersBN.from(nextVrbId))
    ? nextVrbId + 1
    : nextVrbId;

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  const maybeVrbCanVoteTimestamp = pastAuctions.find((auction: AuctionState, i: number) => {
    const maybeVrbId = auction.activeAuction?.vrbId;
    return maybeVrbId
      ? EthersBN.from(maybeVrbId).eq(EthersBN.from(nextVrbIdForQuery))
      : false;
  })?.activeAuction?.startTime;

  if (!maybeVrbCanVoteTimestamp) {
    // This state only occurs during loading flashes
    return EthersBN.from(0);
  }

  return EthersBN.from(maybeVrbCanVoteTimestamp);
};
