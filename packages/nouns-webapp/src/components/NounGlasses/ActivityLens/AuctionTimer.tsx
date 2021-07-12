import moment from 'moment';
import { Auction } from '../../../wrappers/nounsAuction';
import classes from './AuctionTimer.module.css';
import { useState, useEffect, useRef } from 'react';
import { BigNumber } from '@ethersproject/bignumber';

const AuctionTimer: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;

  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(0);
  const auctionTimerRef = useRef(auctionTimer); // to access within setTimeout
  auctionTimerRef.current = auctionTimer;

  const timerDuration = moment.duration(auctionTimerRef.current, 's');

  // timer logic
  useEffect(() => {
    const timeLeft = (auction && BigNumber.from(auction.endTime).toNumber()) - moment().unix();
    setAuctionTimer(auction && timeLeft);

    if (auction && auctionTimer <= 0) {
      setAuctionTimer(0);
      setAuctionEnded(true);
    } else {
      setAuctionEnded(false);
      const timer = setTimeout(() => {
        setAuctionTimer(auctionTimerRef.current - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [auction, auctionTimer]);

  const auctionContent = auctionEnded ? 'Auction ended!' : 'Auction ends in';

  return (
    <>
      <h2 className={classes.title}>{auctionContent}</h2>
      <div className={classes.timerWrapper}>
        <div className={classes.timerSection}>
          <span className={classes.time}>{Math.floor(timerDuration.hours())}</span>
          <span className={classes.timeSubtitle}>Hours</span>
        </div>
        <div className={classes.timerSection}>
          <span className={classes.time}>{Math.floor(timerDuration.minutes())}</span>
          <span className={classes.timeSubtitle}>Mins</span>
        </div>
        <div className={classes.timerSection}>
          <span className={classes.time}>{Math.floor(timerDuration.seconds())}</span>
          <span className={classes.timeSubtitle}>Secs</span>
        </div>
      </div>
    </>
  );
};

export default AuctionTimer;
