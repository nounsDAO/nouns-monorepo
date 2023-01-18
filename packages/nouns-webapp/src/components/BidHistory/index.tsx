import React from 'react';
import ShortAddress from '../ShortAddress';
import dayjs from 'dayjs';
import link from '../../assets/icons/Link.svg';
import { buildEtherscanTxLink } from '../../utils/etherscan';
import TruncatedAmount from '../TruncatedAmount';
import BigNumber from 'bignumber.js';
import { Bid } from '../../utils/types';
import { BigNumber as EthersBN } from '@ethersproject/bignumber';
import { useAuctionBids } from '../../wrappers/onDisplayAuction';
import { useAppSelector } from '../../hooks';

const bidItem = (bid: Bid, index: number, classes: any, isCool?: boolean) => {
  const bidAmount = <TruncatedAmount amount={new BigNumber(EthersBN.from(bid.value).toString())} />;
  const date = `${dayjs(bid.timestamp.toNumber() * 1000).format('MMM DD')} at ${dayjs(
    bid.timestamp.toNumber() * 1000,
  ).format('hh:mm a')}`;

  const txLink = buildEtherscanTxLink(bid.transactionHash);
  const isMobile = window.innerWidth < 992;

  return (
    <li key={index} className={isCool ? classes.bidRowCool : classes.bidRowWarm}>
      <div className={classes.bidItem}>
        <div className={classes.leftSectionWrapper}>
          <div className={classes.bidder}>
            <div>
              <ShortAddress address={bid.sender} avatar={isMobile ? false : true} />
            </div>
          </div>
          <div className={classes.bidDate}>{date}</div>
        </div>
        <div className={classes.rightSectionWrapper}>
          <div className={classes.bidAmount}>{bidAmount}</div>
          <div className={classes.linkSymbol}>
            <a href={txLink} target="_blank" rel="noreferrer">
              <img src={link} width={24} alt="link symbol" />
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};

const BidHistory: React.FC<{ auctionId: string; max: number; classes?: any }> = props => {
  const { auctionId, max, classes } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const bids = useAuctionBids(EthersBN.from(auctionId));
  const bidContent =
    bids &&
    bids
      .sort((bid1: Bid, bid2: Bid) => -1 * (bid1.timestamp.toNumber() - bid2.timestamp.toNumber()))
      .map((bid: Bid, i: number) => {
        return bidItem(bid, i, classes, isCool);
      })
      .slice(0, max);

  return <ul className={classes.bidCollection}>{bidContent}</ul>;
};

export default BidHistory;
