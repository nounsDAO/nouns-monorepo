import { BigNumber } from '@ethersproject/bignumber';
import { useAppSelector } from '../hooks';
import { generateEmptyNounderBRBRAuction, isNounderBRBRNounBR } from '../utils/nounderbrNounBR';
import { Bid, BidEvent } from '../utils/types';
import { Auction } from './nounsbrAuction';

const deserializeAuction = (reduxSafeAuction: Auction): Auction => {
  return {
    amount: BigNumber.from(reduxSafeAuction.amount),
    bidder: reduxSafeAuction.bidder,
    startTime: BigNumber.from(reduxSafeAuction.startTime),
    endTime: BigNumber.from(reduxSafeAuction.endTime),
    nounbrId: BigNumber.from(reduxSafeAuction.nounbrId),
    settled: false,
  };
};

const deserializeBid = (reduxSafeBid: BidEvent): Bid => {
  return {
    nounbrId: BigNumber.from(reduxSafeBid.nounbrId),
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
  const lastAuctionNounBRId = useAppSelector(state => state.auction.activeAuction?.nounbrId);
  const onDisplayAuctionNounBRId = useAppSelector(
    state => state.onDisplayAuction.onDisplayAuctionNounBRId,
  );
  const currentAuction = useAppSelector(state => state.auction.activeAuction);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  if (
    onDisplayAuctionNounBRId === undefined ||
    lastAuctionNounBRId === undefined ||
    currentAuction === undefined ||
    !pastAuctions
  )
    return undefined;

  // current auction
  if (BigNumber.from(onDisplayAuctionNounBRId).eq(lastAuctionNounBRId)) {
    return deserializeAuction(currentAuction);
  }

  // nounderbr auction
  if (isNounderBRBRNounBR(BigNumber.from(onDisplayAuctionNounBRId))) {
    const emptyNounderBRBRAuction = generateEmptyNounderBRBRAuction(
      BigNumber.from(onDisplayAuctionNounBRId),
      pastAuctions,
    );

    return deserializeAuction(emptyNounderBRBRAuction);
  }

  // past auction
  const reduxSafeAuction: Auction | undefined = pastAuctions.find(auction => {
    const nounbrId = auction.activeAuction && BigNumber.from(auction.activeAuction.nounbrId);
    return nounbrId && nounbrId.toNumber() === onDisplayAuctionNounBRId;
  })?.activeAuction;

  return reduxSafeAuction ? deserializeAuction(reduxSafeAuction) : undefined;
};

export const useAuctionBids = (auctionNounBRId: BigNumber): Bid[] | undefined => {
  const lastAuctionNounBRId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounBRId);
  const lastAuctionBids = useAppSelector(state => state.auction.bids);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  // auction requested is active auction
  if (lastAuctionNounBRId === auctionNounBRId.toNumber()) {
    return deserializeBids(lastAuctionBids);
  } else {
    // find bids for past auction requested
    const bidEvents: BidEvent[] | undefined = pastAuctions.find(auction => {
      const nounbrId = auction.activeAuction && BigNumber.from(auction.activeAuction.nounbrId);
      return nounbrId && nounbrId.eq(auctionNounBRId);
    })?.bids;

    return bidEvents && deserializeBids(bidEvents);
  }
};

export default useOnDisplayAuction;
