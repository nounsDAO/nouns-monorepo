import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Auction } from '../../wrappers/nounsAuction';
import classes from './AuctionTimer.module.css';
import { useState, useEffect, useRef } from 'react';

dayjs.extend(duration);

const AuctionTimer: React.FC<{
  auction: Auction;
  auctionEnded: boolean;
  isMobileView: boolean;
}> = props => {
  const { auction, auctionEnded, isMobileView } = props;

  const [auctionTimer, setAuctionTimer] = useState(0);
  const [timerToggle, setTimerToggle] = useState(true);
  const auctionTimerRef = useRef(auctionTimer); // to access within setTimeout
  auctionTimerRef.current = auctionTimer;

  const timerDuration = dayjs.duration(auctionTimerRef.current, 's');
  const endTime = dayjs().add(auctionTimerRef.current, "s").local()

  // timer logic
  useEffect(() => {
    const timeLeft = (auction && Number(auction.endTime)) - dayjs().unix();

    setAuctionTimer(auction && timeLeft);

    if (auction && timeLeft <= 0) {
      setAuctionTimer(0);
    } else {
      const timer = setTimeout(() => {
        setAuctionTimer(auctionTimerRef.current - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [auction, auctionTimer]);

  const auctionContent = auctionEnded ? 'Auction ended' : (timerToggle ? 'Auction Ends in' : `Ends on ${endTime.format('MMM Do')} at`);

  const flooredMinutes = Math.floor(timerDuration.minutes());
  const flooredSeconds = Math.floor(timerDuration.seconds());

  if (!auction) return null;

  return (
    <div onClick={() => setTimerToggle(!timerToggle)} className={classes.auctionTimerSection}>
          { !isMobileView ?  <h4 className={classes.title}>{auctionContent}</h4> : <></>}
      {timerToggle ? (
          <h2 className={classes.timerWrapper}>
            <div className={classes.timerSection}>
              <span>
                {`${Math.floor(timerDuration.hours())}`}
                <span className={classes.small}>h</span>
              </span>
            </div>
            <div className={classes.timerSection}>
              <span>
                {`${flooredMinutes}`}
                <span className={classes.small}>m</span>
              </span>
            </div>
            {/* Remove margin right on mobile to make it look nice */}
            <div className={ !isMobileView ? classes.timerSection : ''}>
              <span>
                {`${flooredSeconds}`}
                <span className={classes.small}>s</span>
              </span>
            </div>
          </h2>
      ) : (
          <h2 className={classes.timerWrapper}>
            <div className={classes.clockSection}>
              <span>
              {endTime.format('h:mm:ss a')}
              </span>
            </div>
          </h2>
      )}
    </div>
  );
};

export default AuctionTimer;
