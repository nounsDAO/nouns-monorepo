import { BigNumber } from '@ethersproject/bignumber';
import { useAppSelector } from '../hooks';
import { generateEmptyNounderAuction, isNounderNoun } from '../utils/nounderNoun';
import { Bid, BidEvent } from '../utils/types';
import { Auction } from './nAuction';

const deserializeAuction = (reduxSafeAuction: Auction): Auction => {
  return {
    amount: BigNumber.from(reduxSafeAuction.amount),
    bidder: reduxSafeAuction.bidder,
    startTime: BigNumber.from(reduxSafeAuction.startTime),
    endTime: BigNumber.from(reduxSafeAuction.endTime),
    tokenId: BigNumber.from(reduxSafeAuction.tokenId),
    settled: false,
  };
};

const deserializeBid = (reduxSafeBid: BidEvent): Bid => {
  return {
    tokenId: BigNumber.from(reduxSafeBid.tokenId),
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
  const lastAuctionTokenId = useAppSelector(state => state.auction.activeAuction?.tokenId);
  const onDisplayAuctionTokenId = useAppSelector(
    state => state.onDisplayAuction.onDisplayAuctionTokenId,
  );
  const currentAuction = useAppSelector(state => state.auction.activeAuction);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  console.log(currentAuction, pastAuctions)
  if (
    onDisplayAuctionTokenId === undefined ||
    lastAuctionTokenId === undefined ||
    currentAuction === undefined ||
    !pastAuctions
  )
    return undefined;

  // current auction
  if (BigNumber.from(onDisplayAuctionTokenId).eq(lastAuctionTokenId)) {
    return deserializeAuction(currentAuction);
  }

  // nounder auction
  if (isNounderNoun(BigNumber.from(onDisplayAuctionTokenId))) {
    const emptyNounderAuction = generateEmptyNounderAuction(
      BigNumber.from(onDisplayAuctionTokenId),
      pastAuctions,
    );

    return deserializeAuction(emptyNounderAuction);
  }

  // past auction
  const reduxSafeAuction: Auction | undefined = pastAuctions.find(auction => {
    const tokenId = auction.activeAuction && BigNumber.from(auction.activeAuction.tokenId);
    return tokenId && tokenId.toNumber() === onDisplayAuctionTokenId;
  })?.activeAuction;

  return reduxSafeAuction ? deserializeAuction(reduxSafeAuction) : undefined;
};

export const useAuctionBids = (auctionTokenId: BigNumber): Bid[] | undefined => {
  const lastAuctionTokenId = useAppSelector(state => state.onDisplayAuction.lastAuctionTokenId);
  const lastAuctionBids = useAppSelector(state => state.auction.bids);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  // auction requested is active auction
  if (lastAuctionTokenId === auctionTokenId.toNumber()) {
    return deserializeBids(lastAuctionBids);
  } else {
    // find bids for past auction requested
    const bidEvents: BidEvent[] | undefined = pastAuctions.find(auction => {
      const tokenId = auction.activeAuction && BigNumber.from(auction.activeAuction.tokenId);
      return tokenId && tokenId.eq(auctionTokenId);
    })?.bids;

    return bidEvents && deserializeBids(bidEvents);
  }
};

export default useOnDisplayAuction;
