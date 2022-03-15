import React from 'react';
import ShortAddress from '../ShortAddress';
import _classes from './BidHistory.module.css';
import dayjs from 'dayjs';
import link from '../../assets/icons/Link.svg';
import { buildEtherscanTxLink } from '../../utils/etherscan';
import TruncatedAmount from '../TruncatedAmount';
import BigNumber from 'bignumber.js';
import { Bid } from '../../utils/types';
import { BigNumber as EthersBN } from '@ethersproject/bignumber';
import { useAuctionBids } from '../../wrappers/onDisplayAuction';
import { useAppSelector } from '../../hooks';
import { black, primary } from '../../utils/nounBgColors';

const bidItem = (bid: Bid, index: number, classes: any, isEthereum?: boolean) => {
  const bidAmount = <TruncatedAmount amount={new BigNumber(EthersBN.from(bid.value).toString())} />;
  const date = `${dayjs(bid.timestamp.toNumber() * 1000).format('MMM DD')} at ${dayjs(
    bid.timestamp.toNumber() * 1000,
  ).format('hh:mm a')}`;

  const txLink = buildEtherscanTxLink(bid.transactionHash);
  const isMobile = window.innerWidth < 992;

  return (
    <li
      key={index}
      className={isEthereum ? classes.bidRowCool : classes.bidRowWarm}
      style={{ borderBottom: `1px solid ${isEthereum ? primary : black}` }}
    >
      <div className={classes.bidItem}>
        <div className={classes.leftSectionWrapper}>
          <div className={classes.bidder}>
            <div>
              <ShortAddress
                isEthereum={isEthereum}
                address={bid.sender}
                avatar={isMobile ? false : true}
              />
            </div>
          </div>
          <div className={classes.bidDate} style={{ color: isEthereum ? primary : black }}>
            {date}
          </div>
        </div>
        <div className={classes.rightSectionWrapper}>
          <div className={classes.bidAmount} style={{ color: isEthereum ? primary : black }}>
            {bidAmount}
          </div>
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

const BidHistory: React.FC<{
  auctionId: string;
  max: number;
  classes?: any;
  isEthereum: boolean;
}> = props => {
  const { auctionId, max, classes = _classes, isEthereum } = props;
  const bids = useAuctionBids(EthersBN.from(auctionId));
  const bidContent =
    bids &&
    bids
      .map((bid: Bid, i: number) => {
        return bidItem(bid, i, classes, isEthereum);
      })
      .slice(0, max);

  return <ul className={classes.bidCollection}>{bidContent}</ul>;
};

export default BidHistory;
