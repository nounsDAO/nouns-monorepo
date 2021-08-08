import React from 'react';
import { useQuery } from '@apollo/client';
import { bidsByAuctionQuery } from '../../wrappers/subgraph';
import ShortAddress from '../ShortAddress';
import _classes from './BidHistory.module.css';
import { compareBids } from '../../utils/compareBids';
import * as R from 'ramda';
import { Spinner } from 'react-bootstrap';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { buildEtherscanTxLink, Network } from '../../utils/buildEtherscanLink';
import TruncatedAmount from '../TruncatedAmount';
import BigNumber from 'bignumber.js';
import { useAppSelector } from '../../hooks';

const BidHistory: React.FC<{ auctionId: string; max: number; classes?: any }> = props => {
  const { auctionId, max, classes = _classes } = props;
  const { loading, error, data, refetch } = useQuery(bidsByAuctionQuery(auctionId));

  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const bidContent =
    data &&
    R.sort(compareBids, data.bids)
      .reverse()
      .slice(0, max)
      .map((bid: any, i: number) => {
        const bidAmount = <TruncatedAmount amount={new BigNumber(bid.amount)} />;
        const date = `${moment(bid.blockTimestamp * 1000).format('MMM DD')} at ${moment(
          bid.blockTimestamp * 1000,
        ).format('hh:mm a')}`;

        const txLink = buildEtherscanTxLink(bid.id, Network.rinkeby);

        return (
          <li key={i} className={classes.bidRow}>
            <div className={classes.bidItem}>
              <div className={classes.leftSectionWrapper}>
                <div className={classes.bidder}>
                  <div>
                    {bid.bidder.id?.toLowerCase() === activeAccount?.toLowerCase() ? `You` : <ShortAddress>{bid.bidder.id}</ShortAddress>}
                  </div>
                </div>
                <div className={classes.bidDate}>{date}</div>
              </div>
              <div className={classes.rightSectionWrapper}>
                <div className={classes.bidAmount}>{bidAmount}</div>
                <div className={classes.linkSymbol}>
                  <a href={txLink.toString()} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                </div>
              </div>
            </div>
          </li>
        );
      });

  const periodicFetch = () => {
    setTimeout(() => {
      refetch();
      periodicFetch();
    }, 5000);
  };
  periodicFetch();

  return (
    <>
      {loading && !error && (
        <div className={classes.altWrapper}>
          <Spinner animation="border" />
        </div>
      )}
      {!loading && error && (
        <div className={classes.altWrapper}>
          <div>Error {error}</div>
        </div>
      )}
      {!loading && !error && <ul className={classes.bidCollection}>{bidContent}</ul>}
    </>
  );
};

export default BidHistory;
