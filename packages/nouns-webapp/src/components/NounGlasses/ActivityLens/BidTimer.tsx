import moment from 'moment';
import { Auction } from '../../../wrappers/nounsAuction';
import { useBlockMeta } from '@usedapp/core';
import classes from './BidTimer.module.css';
import { useState, useEffect } from 'react';

const BidTimer: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;
  const { timestamp } = useBlockMeta();

  const [timeLeft, setTimeLeft] = useState(0);
  const [auctionEnded, setAuctionEnded] = useState(false);

  const timerDuration = moment.duration(timeLeft, 's');

  useEffect(() => {
    const endMoment = moment(auction && Number(auction.endTime.toString()) * 1000);
    const blockTimestampMoment = moment(timestamp && timestamp.getTime());
    const timeLeftMoment = moment(endMoment.diff(blockTimestampMoment));

    // inital timeset on valid auction && timestamp
    setTimeLeft(prevState => {
      if (prevState === 0 && auction && timestamp) {
        return timeLeftMoment.unix();
      } else {
        return prevState;
      }
    });
  }, [auction, timestamp]);

  // timer logic
  useEffect(() => {
    if (timeLeft < 0) {
      auctionEndedHandler();
      return;
    } else {
      const timerId = setInterval(() => {
        setTimeLeft(prevState => prevState - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  });

  const auctionEndedHandler = () => {
    setTimeLeft(0);
    setAuctionEnded(true);
  };

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

export default BidTimer;
