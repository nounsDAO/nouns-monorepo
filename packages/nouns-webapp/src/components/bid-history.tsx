import React from 'react';

import { BidHistoryItem } from '@/components/bid-history-item';
import { useAppSelector } from '@/hooks';
import { Bid } from '@/utils/types';
import { useAuctionBids } from '@/wrappers/on-display-auction';

interface BidHistoryProps {
  auctionId: string;
  max: number;
}

const BidHistory: React.FC<BidHistoryProps> = props => {
  const { auctionId, max } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const bids = useAuctionBids(BigInt(auctionId));
  const bidContent =
    bids &&
    bids
      .toSorted((bid1: Bid, bid2: Bid) => -1 * Number(bid1.timestamp - bid2.timestamp))
      .map((bid: Bid) => {
        return <BidHistoryItem key={bid.transactionHash} bid={bid} isCool={isCool} />;
      })
      .slice(0, max);

  return <ul className="mt-4 grid list-none gap-y-2 p-0 text-left">{bidContent}</ul>;
};

export default BidHistory;
