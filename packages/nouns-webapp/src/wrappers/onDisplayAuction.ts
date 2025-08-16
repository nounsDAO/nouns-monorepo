import { isNullish } from 'remeda';

import { useAppSelector } from '@/hooks';
import { compareBids } from '@/utils/compare-bids';
import { generateEmptyNounderAuction, isNounderNoun } from '@/utils/nounder-noun';
import { Address, Bid, BidEvent } from '@/utils/types';

import { Auction } from './nounsAuction';

const deserializeAuction = (reduxSafeAuction: Auction): Auction => {
  return {
    amount: isNullish(reduxSafeAuction.amount) ? undefined : BigInt(reduxSafeAuction.amount),
    bidder: isNullish(reduxSafeAuction.bidder) ? undefined : (reduxSafeAuction.bidder as Address),
    startTime: BigInt(reduxSafeAuction.startTime),
    endTime: BigInt(reduxSafeAuction.endTime),
    nounId: BigInt(reduxSafeAuction.nounId),
    settled: false,
  };
};

const deserializeBid = (reduxSafeBid: BidEvent): Bid => {
  return {
    nounId: BigInt(reduxSafeBid.nounId),
    sender: reduxSafeBid.sender,
    value: BigInt(reduxSafeBid.value),
    extended: reduxSafeBid.extended,
    transactionHash: reduxSafeBid.transactionHash,
    transactionIndex: reduxSafeBid.transactionIndex,
    timestamp: BigInt(reduxSafeBid.timestamp),
  };
};
const deserializeBids = (reduxSafeBids: BidEvent[]): Bid[] => {
  return reduxSafeBids.map(bid => deserializeBid(bid)).sort((a: Bid, b: Bid) => compareBids(a, b));
};

const useOnDisplayAuction = (): Auction | undefined => {
  const lastAuctionNounId = useAppSelector(state => state.auction.activeAuction?.nounId);
  const onDisplayAuctionNounId = useAppSelector(
    state => state.onDisplayAuction.onDisplayAuctionNounId,
  );
  const currentAuction = useAppSelector(state => state.auction.activeAuction);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  if (
    onDisplayAuctionNounId === undefined ||
    isNullish(lastAuctionNounId) ||
    isNullish(currentAuction) ||
    isNullish(pastAuctions)
  ) {
    return undefined;
  }

  // current auction
  if (BigInt(onDisplayAuctionNounId) === lastAuctionNounId) {
    return deserializeAuction(currentAuction);
  }

  // nounder auction
  if (isNounderNoun(BigInt(onDisplayAuctionNounId))) {
    const emptyNounderAuction = generateEmptyNounderAuction(
      BigInt(onDisplayAuctionNounId),
      pastAuctions,
    );

    return deserializeAuction(emptyNounderAuction);
  }

  // past auction
  const pastAuction = pastAuctions.find(auction => {
    if (!auction.activeAuction) return false;
    const nounId = BigInt(auction.activeAuction.nounId);
    return Number(nounId) === onDisplayAuctionNounId;
  });
  const reduxSafeAuction = pastAuction?.activeAuction;

  return reduxSafeAuction ? deserializeAuction(reduxSafeAuction) : undefined;
};

export const useAuctionBids = (auctionNounId: bigint): Bid[] | undefined => {
  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const lastAuctionBids = useAppSelector(state => state.auction.bids);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  // auction requested is active auction
  if (lastAuctionNounId === Number(auctionNounId)) {
    return deserializeBids(lastAuctionBids);
  } else {
    // find bids for past auction requested
    const bidEvents: BidEvent[] | undefined = pastAuctions?.find(auction => {
      const nounId = auction.activeAuction ? BigInt(auction.activeAuction.nounId) : undefined;
      return !isNullish(nounId) && nounId === auctionNounId;
    })?.bids;

    return bidEvents ? deserializeBids(bidEvents) : undefined;
  }
};

export default useOnDisplayAuction;
