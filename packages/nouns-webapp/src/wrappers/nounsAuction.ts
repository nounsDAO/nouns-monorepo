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
export const useNounCanVoteTimestamp = (nounId: number) => {
  const nextNounId = Number(nounId) + 1;

  const isValidNounId = Number.isInteger(nextNounId);
  const nextNounIdForQuery =
    isValidNounId && isNounderNoun(BigInt(nextNounId)) ? nextNounId + 1 : nextNounId;

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  const maybeNounCanVoteTimestamp = pastAuctions.find((auction: AuctionState) => {
    const maybeNounId = auction.activeAuction?.nounId;
    console.log('maybeNounId:', maybeNounId);
    return maybeNounId ? BigInt(maybeNounId) === BigInt(nextNounIdForQuery) : false;
  })?.activeAuction?.startTime;

  if (!maybeNounCanVoteTimestamp) {
    // This state only occurs during loading flashes
    return 0n;
  }

  return BigInt(maybeNounCanVoteTimestamp);
};
