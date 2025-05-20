import { useAppSelector } from '@/hooks';
import { AuctionState } from '@/state/slices/auction';
import { isNounderNoun } from '@/utils/nounderNoun';
import { Address, BigNumberish } from '@/utils/types';

export interface Auction {
  amount: BigNumberish;
  bidder: Address;
  endTime: BigNumberish;
  startTime: BigNumberish;
  nounId: BigNumberish;
  settled: boolean;
}
/**
 * Computes timestamp after which a Noun could vote
 * @param nounId TokenId of Noun
 * @returns Unix timestamp after which Noun could vote
 */
export const useNounCanVoteTimestamp = (nounId: number): bigint => {
  const { pastAuctions } = useAppSelector(state => state.pastAuctions);

  // Calculate next noun ID for determining voting eligibility
  const nextNounIdForQuery = getNextValidNounId(nounId);

  // Find the auction that corresponds to the next valid noun ID
  const relevantAuction = pastAuctions.find((auction: AuctionState) =>
    isAuctionForNounId(auction, nextNounIdForQuery),
  );

  // Get the start time from the auction if found
  const startTime = relevantAuction?.activeAuction?.startTime;

  // Return 0n during loading states when no auction is found
  return startTime ? BigInt(startTime) : 0n;
};

/**
 * Determines the next valid Noun ID for querying auction data
 */
function getNextValidNounId(nounId: number): number {
  const nextNounId = nounId + 1;

  if (!Number.isInteger(nextNounId)) {
    return 1;
  }

  // Check if the next noun is a Nounder noun (which needs to be skipped)
  if (isNounderNoun(BigInt(nextNounId))) {
    return nextNounId + 1;
  }

  return nextNounId;
}

/**
 * Checks if an auction corresponds to a specific Noun ID
 */
function isAuctionForNounId(auction: AuctionState, nounId: number): boolean {
  const auctionNounId = auction.activeAuction?.nounId;
  return auctionNounId ? BigInt(auctionNounId) === BigInt(nounId) : false;
}
