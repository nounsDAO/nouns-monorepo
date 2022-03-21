import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Auction } from '../../wrappers/nounsAuction';
import classes from './AuctionTimer.module.css';
import { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import clsx from 'clsx';
import { black, primary } from '../../utils/nounBgColors';

dayjs.extend(duration);

const AuctionTimer: React.FC<{
  auction: Auction;
  auctionEnded: boolean;
  isEthereum?: boolean;
}> = props => {
  const { auction, auctionEnded, isEthereum = false } = props;

  const [auctionTimer, setAuctionTimer] = useState(0);
  const [timerToggle, setTimerToggle] = useState(true);

  const auctionTimerRef = useRef(auctionTimer); // to access within setTimeout
  auctionTimerRef.current = auctionTimer;

  const timerDuration = dayjs.duration(auctionTimerRef.current, 's');
  const endTime = dayjs().add(auctionTimerRef.current, 's').local();

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

  const auctionContentLong = auctionEnded ? 'Auction ended' : 'Auction ends in';
  const auctionContentShort = auctionEnded ? 'Auction ended' : 'Time left';

  const flooredMinutes = Math.floor(timerDuration.minutes());
  const flooredSeconds = Math.floor(timerDuration.seconds());

  if (!auction) return null;

  return (
    <div
      className={clsx(classes.wrapper, classes.section)}
      onClick={() => setTimerToggle(!timerToggle)}
    >
      <div className={classes.leftCol}>
        <h4
          style={{
            color: isEthereum ? primary : black,
          }}
        >
          {timerToggle
            ? window.innerWidth < 992
              ? auctionContentShort
              : auctionContentLong
            : `Ends on ${endTime.format('MMM Do')} at`}
        </h4>
      </div>
      <div>
        {timerToggle ? (
          <h2
            className={clsx(classes.timerWrapper, classes.timeLeft)}
            style={{
              color: isEthereum ? primary : black,
            }}
          >
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
            <div className={classes.timerSectionFinal}>
              <span>
                {`${flooredSeconds}`}
                <span className={classes.small}>s</span>
              </span>
            </div>
          </h2>
        ) : (
          <h2
            className={classes.timerWrapper}
            style={{
              color: isEthereum ? primary : black,
            }}
          >
            <div className={clsx(classes.timerSection, classes.clockSection)}>
              <span>{endTime.format('h:mm:ss a')}</span>
            </div>
          </h2>
        )}
      </div>
    </div>
  );
};

export default AuctionTimer;
