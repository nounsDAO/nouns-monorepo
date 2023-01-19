import { BigNumber } from '@ethersproject/bignumber';
import { useAppSelector } from '../hooks';
import { generateEmptyN00underAuction, isN00underN00un } from '../utils/n00underN00un';
import { Bid, BidEvent } from '../utils/types';
import { Auction } from './n00unsAuction';

const deserializeAuction = (reduxSafeAuction: Auction): Auction => {
  return {
    amount: BigNumber.from(reduxSafeAuction.amount),
    bidder: reduxSafeAuction.bidder,
    startTime: BigNumber.from(reduxSafeAuction.startTime),
    endTime: BigNumber.from(reduxSafeAuction.endTime),
    n00unId: BigNumber.from(reduxSafeAuction.n00unId),
    settled: false,
  };
};

const deserializeBid = (reduxSafeBid: BidEvent): Bid => {
  return {
    n00unId: BigNumber.from(reduxSafeBid.n00unId),
    sender: reduxSafeBid.sender,
    value: BigNumber.from(reduxSafeBid.value),
    extended: reduxSafeBid.extended,
    transactionHash: reduxSafeBid.transactionHash,
    timestamp: BigNumber.from(reduxSafeBid.timestamp),
  };
};
const deserializeBids = (reduxSafeBids: BidEvent[]): Bid[] => {
  return reduxSafeBids
    .map(bid => deserializeBid(bid))
    .sort((a: Bid, b: Bid) => {
      return b.timestamp.toNumber() - a.timestamp.toNumber();
    });
};

const useOnDisplayAuction = (): Auction | undefined => {
  const lastAuctionN00unId = useAppSelector(state => state.auction.activeAuction?.n00unId);
  const onDisplayAuctionN00unId = useAppSelector(
    state => state.onDisplayAuction.onDisplayAuctionN00unId,
  );
  const currentAuction = useAppSelector(state => state.auction.activeAuction);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  if (
    onDisplayAuctionN00unId === undefined ||
    lastAuctionN00unId === undefined ||
    currentAuction === undefined ||
    !pastAuctions
  )
    return undefined;

  // current auction
  if (BigNumber.from(onDisplayAuctionN00unId).eq(lastAuctionN00unId)) {
    return deserializeAuction(currentAuction);
  }

  // n00under auction
  if (isN00underN00un(BigNumber.from(onDisplayAuctionN00unId))) {
    const emptyN00underAuction = generateEmptyN00underAuction(
      BigNumber.from(onDisplayAuctionN00unId),
      pastAuctions,
    );

    return deserializeAuction(emptyN00underAuction);
  }

  // past auction
  const reduxSafeAuction: Auction | undefined = pastAuctions.find(auction => {
    const n00unId = auction.activeAuction && BigNumber.from(auction.activeAuction.n00unId);
    return n00unId && n00unId.toNumber() === onDisplayAuctionN00unId;
  })?.activeAuction;

  return reduxSafeAuction ? deserializeAuction(reduxSafeAuction) : undefined;
};

export const useAuctionBids = (auctionN00unId: BigNumber): Bid[] | undefined => {
  const lastAuctionN00unId = useAppSelector(state => state.onDisplayAuction.lastAuctionN00unId);
  const lastAuctionBids = useAppSelector(state => state.auction.bids);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  // auction requested is active auction
  if (lastAuctionN00unId === auctionN00unId.toNumber()) {
    return deserializeBids(lastAuctionBids);
  } else {
    // find bids for past auction requested
    const bidEvents: BidEvent[] | undefined = pastAuctions.find(auction => {
      const n00unId = auction.activeAuction && BigNumber.from(auction.activeAuction.n00unId);
      return n00unId && n00unId.eq(auctionN00unId);
    })?.bids;

    return bidEvents && deserializeBids(bidEvents);
  }
};

export default useOnDisplayAuction;
