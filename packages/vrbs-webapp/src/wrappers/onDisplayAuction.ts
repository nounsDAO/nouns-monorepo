import { BigNumber } from '@ethersproject/bignumber';
import { useAppSelector } from '../hooks';
import { generateEmptyFounderAuction, isFounderVrb } from '../utils/founderVrb';
import { Bid, BidEvent } from '../utils/types';
import { Auction } from './vrbsAuction';

const deserializeAuction = (reduxSafeAuction: Auction): Auction => {
  return {
    amount: BigNumber.from(reduxSafeAuction.amount),
    bidder: reduxSafeAuction.bidder,
    startTime: BigNumber.from(reduxSafeAuction.startTime),
    endTime: BigNumber.from(reduxSafeAuction.endTime),
    vrbId: BigNumber.from(reduxSafeAuction.vrbId),
    settled: false,
  };
};

const deserializeBid = (reduxSafeBid: BidEvent): Bid => {
  return {
    vrbId: BigNumber.from(reduxSafeBid.vrbId),
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
  const lastAuctionVrbId = useAppSelector(state => state.auction.activeAuction?.vrbId);
  const onDisplayAuctionVrbId = useAppSelector(
    state => state.onDisplayAuction.onDisplayAuctionVrbId,
  );
  const currentAuction = useAppSelector(state => state.auction.activeAuction);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  if (
    onDisplayAuctionVrbId === undefined ||
    lastAuctionVrbId === undefined ||
    currentAuction === undefined ||
    !pastAuctions
  )
    return undefined;

  // current auction
  if (BigNumber.from(onDisplayAuctionVrbId).eq(lastAuctionVrbId)) {
    return deserializeAuction(currentAuction);
  }

  // founder auction
  if (isFounderVrb(BigNumber.from(onDisplayAuctionVrbId))) {
    const emptyVrbderAuction = generateEmptyFounderAuction(
      BigNumber.from(onDisplayAuctionVrbId),
      pastAuctions,
    );

    return deserializeAuction(emptyVrbderAuction);
  }

  // past auction
  const reduxSafeAuction: Auction | undefined = pastAuctions.find(auction => {
    const vrbId = auction.activeAuction && BigNumber.from(auction.activeAuction.vrbId);
    return vrbId && vrbId.toNumber() === onDisplayAuctionVrbId;
  })?.activeAuction;

  return reduxSafeAuction ? deserializeAuction(reduxSafeAuction) : undefined;
};

export const useAuctionBids = (auctionVrbId: BigNumber): Bid[] | undefined => {
  const lastAuctionVrbId = useAppSelector(state => state.onDisplayAuction.lastAuctionVrbId);
  const lastAuctionBids = useAppSelector(state => state.auction.bids);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  // auction requested is active auction
  if (lastAuctionVrbId === auctionVrbId.toNumber()) {
    return deserializeBids(lastAuctionBids);
  } else {
    // find bids for past auction requested
    const bidEvents: BidEvent[] | undefined = pastAuctions.find(auction => {
      const vrbId = auction.activeAuction && BigNumber.from(auction.activeAuction.vrbId);
      return vrbId && vrbId.eq(auctionVrbId);
    })?.bids;

    return bidEvents && deserializeBids(bidEvents);
  }
};

export default useOnDisplayAuction;
