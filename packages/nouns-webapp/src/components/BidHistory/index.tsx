import React from 'react';
import { useQuery } from '@apollo/client';
import { bidsByAuctionQuery } from '../../wrappers/subgraph';
import ShortAddress from '../ShortAddress';
import classes from './BidHistory.module.css';
import { formatEther } from '@ethersproject/units';
import { compareBids } from '../../utils/compareBids';
import * as R from 'ramda';

const historyLength = 6;

export const BidHistory: React.FC<{ auctionId: string }> = props => {
  const { auctionId } = props;
  const { loading, error, data, refetch } = useQuery(bidsByAuctionQuery(auctionId));
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const periodicFetch = () => {
    setTimeout(() => {
      refetch();
      periodicFetch();
    }, 5000);
  };
  periodicFetch();

  return (
    <div>
      {loading && <div>Loading</div>}
      {error && <div>Error {error}</div>}
      {!loading && !error && (
        <ul className={classes.bidCollection}>
          {R.sort(compareBids, data.bids)
            // TODO refactor this out
            .reverse()
            .slice(0, historyLength)
            .reverse()
            .map((bid: any, i: number) => (
              <li key={i} className={classes.bidRow}>
                <div>
                  <ShortAddress>{bid.bidder.id}</ShortAddress>
                </div>
                <div>Ξ{formatEther(bid.amount)}</div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
