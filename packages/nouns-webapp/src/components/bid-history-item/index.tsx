import React from 'react';

import dayjs from 'dayjs';

import LinkIcon from '@/assets/icons/Link.svg?react';
import ShortAddress from '@/components/short-address';
import TruncatedAmount from '@/components/truncated-amount';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { Bid } from '@/utils/types';

interface BidHistoryItemProps {
  bid: Bid;
  classes: Record<string, string>;
  isCool?: boolean;
}

export const BidHistoryItem: React.FC<BidHistoryItemProps> = ({ bid, classes, isCool }) => {
  const bidAmount = <TruncatedAmount amount={BigInt(bid.value.toString())} />;
  const date = `${dayjs(Number(bid.timestamp) * 1000).format('MMM DD')} at ${dayjs(
    Number(bid.timestamp) * 1000,
  ).format('hh:mm a')}`;

  const txLink = buildEtherscanTxLink(bid.transactionHash);
  const isMobile = window.innerWidth < 992;

  return (
    <li className={isCool === true ? classes.bidRowCool : classes.bidRowWarm}>
      <div className={classes.bidItem}>
        <div className={classes.leftSectionWrapper}>
          <div className={classes.bidder}>
            <div>
              <ShortAddress address={bid.sender} avatar={!isMobile} />
            </div>
          </div>
          <div className={classes.bidDate}>{date}</div>
        </div>
        <div className={classes.rightSectionWrapper}>
          <div className={classes.bidAmount}>{bidAmount}</div>
          <div className={classes.linkSymbol}>
            <a href={txLink} target="_blank" rel="noreferrer">
              <LinkIcon width={24} height={24} aria-label="link symbol" />
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};
