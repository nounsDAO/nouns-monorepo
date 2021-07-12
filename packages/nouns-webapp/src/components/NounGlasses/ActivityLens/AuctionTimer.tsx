import moment from 'moment';
import { Auction } from '../../../wrappers/nounsAuction';
import { useBlockMeta } from '@usedapp/core';
import classes from './AuctionTimer.module.css';
import { useState, useEffect } from 'react';

const AuctionTimer: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;
  const { timestamp } = useBlockMeta();

  const [timeLeft, setTimeLeft] = useState(0);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const timerDuration = moment.duration(timeLeft, 's');

  useEffect(() => {
    if (auctionEnded) {
      return;
    }

    const endMoment = moment(auction && Number(auction.endTime.toString()) * 1000);
    const blockTimestampMoment = moment(timestamp && timestamp.getTime());
    const timeLeftMoment = moment(endMoment.diff(blockTimestampMoment));

    setTimeLeft(prevState => {
      if (prevState === 0 && auction && timestamp) {
        // inital set on valid auction and timestamp data
        return timeLeftMoment.unix();
      } else {
        // on timestamp/auction changes
        return prevState;
      }
    });
  }, [auction, timestamp, auctionEnded]);

  // timer logic
  useEffect(() => {
    if (auctionEnded) {
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prevState => {
        if (prevState === 1) {
          setAuctionEnded(true);
          return 0;
        } else {
          return prevState - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timerId);
  });

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
