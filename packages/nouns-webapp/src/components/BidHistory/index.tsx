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
import { buildEtherscanTxLink } from '../../utils/etherscan';
import TruncatedAmount from '../TruncatedAmount';
import BigNumber from 'bignumber.js';
import { IBid } from '../../wrappers/subgraph';

const bidItem = (bid: IBid, index: number, classes: any) => {
  const bidAmount = <TruncatedAmount amount={new BigNumber(bid.amount)} />;
  const date = `${moment(bid.blockTimestamp * 1000).format('MMM DD')} at ${moment(
    bid.blockTimestamp * 1000,
  ).format('hh:mm a')}`;

  const txLink = buildEtherscanTxLink(bid.id);

  return (
    <li key={index} className={classes.bidRow}>
      <div className={classes.bidItem}>
        <div className={classes.leftSectionWrapper}>
          <div className={classes.bidder}>
            <div>
              <ShortAddress address={bid.bidder.id} />
            </div>
          </div>
          <div className={classes.bidDate}>{date}</div>
        </div>
        <div className={classes.rightSectionWrapper}>
          <div className={classes.bidAmount}>{bidAmount}</div>
          <div className={classes.linkSymbol}>
            <a href={txLink} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};

const BidHistory: React.FC<{ auctionId: string; max: number; classes?: any }> = props => {
  const { auctionId, max, classes = _classes } = props;
  const { loading, error, data } = useQuery(bidsByAuctionQuery(auctionId), {
    pollInterval: 5000,
  });

  const bids = data && R.sort(compareBids, data.bids).reverse().slice(0, max);

  const bidContent =
    bids &&
    bids.map((bid: IBid, i: number) => {
      return bidItem(bid, i, classes);
    });

  return (
    <>
      {loading && !error && (
        <div className={classes.altWrapper}>
          <Spinner animation="border" />
        </div>
      )}
      {!loading && error && (
        <div className={classes.altWrapper}>
          <div>Error loading bid history</div>
        </div>
      )}
      {!loading && !error && <ul className={classes.bidCollection}>{bidContent}</ul>}
    </>
  );
};

export default BidHistory;
