import React from 'react';
import classes from './AuctionNavigation.module.css';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
import { BigNumber } from '@ethersproject/bignumber';

const AuctionNavigation: React.FC<{
  isFirstAuction: boolean;
  isLastAuction: boolean;
  startTime: BigNumber;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
}> = props => {
  const { isFirstAuction, isLastAuction, startTime, onPrevAuctionClick, onNextAuctionClick } =
    props;
  return (
    <div className={classes.navArrowsContainer}>
      <button
        onClick={() => onPrevAuctionClick()}
        className={classes.leftArrow}
        disabled={isFirstAuction}
      >
        ←
      </button>
      <button
        onClick={() => onNextAuctionClick()}
        className={classes.rightArrow}
        disabled={isLastAuction}
      >
        →
      </button>
      <div className={`${classes.hideOnDesktop} ${classes.mobileDateHeadline}`}>
        <AuctionActivityDateHeadline startTime={startTime} />
      </div>
    </div>
  );
};
export default AuctionNavigation;
