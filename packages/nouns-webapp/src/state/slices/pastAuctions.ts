import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuctionState } from './auction';
import { BigNumber } from '@ethersproject/bignumber';
import { emptyNounderAuction } from '../../utils/nounderNoun';

interface PastAuctionsState {
  pastAuctions: AuctionState[];
}

const initialState: PastAuctionsState = {
  pastAuctions: [],
};

const reduxSafePastAuctions = (data: any): AuctionState[] => {
  const auctions = data.data.auctions as any[];
  if (auctions.length < 0) return [];
  const pastAuctions: AuctionState[] = auctions.map(auction => {
    return {
      activeAuction: {
        amount: BigNumber.from(auction.amount).toJSON(),
        bidder: auction.bidder ? auction.bidder.id : '',
        startTime: BigNumber.from(auction.startTime).toJSON(),
        endTime: BigNumber.from(auction.endTime).toJSON(),
        nounId: BigNumber.from(auction.id).toJSON(),
        settled: false,
      },
      bids: auction.bids.map((bid: any) => {
        return {
          nounId: BigNumber.from(auction.id).toJSON(),
          sender: bid.bidder.id,
          value: BigNumber.from(bid.amount).toJSON(),
          extended: false,
          transactionHash: bid.id,
          timestamp: BigNumber.from(bid.blockTimestamp).toJSON(),
        };
      }),
    };
  });
  return addEmptyNounderAuctions(pastAuctions);
};

/**
 * Adds empty `Auction` objects to `pastAuctions` with Nounder
 * noun IDs to fill empty fetches from The Graph for Nounder auctions.
 */
const addEmptyNounderAuctions = (auctions: AuctionState[]) => {
  const latestAuctionNounId = auctions.reduce((prev, current) => {
    return BigNumber.from(prev.activeAuction?.nounId).gt(
      BigNumber.from(current.activeAuction?.nounId),
    )
      ? prev
      : current;
  }).activeAuction?.nounId;

  const numNounAuctionsToAdd = BigNumber.from(latestAuctionNounId).div(10).toNumber();

  for (var i = 0; i <= numNounAuctionsToAdd; i++) {
    auctions.push({
      activeAuction: emptyNounderAuction(i * 10),
      bids: [],
    });
  }

  return auctions;
};

const pastAuctionsSlice = createSlice({
  name: 'pastAuctions',
  initialState: initialState,
  reducers: {
    addPastAuctions: (state, action: PayloadAction<any>) => {
      state.pastAuctions = reduxSafePastAuctions(action.payload);
    },
  },
});

export const { addPastAuctions } = pastAuctionsSlice.actions;

export default pastAuctionsSlice.reducer;
