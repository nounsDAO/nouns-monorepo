import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Auction } from '../../wrappers/nounsAuction';
import classes from './AuctionTimer.module.css';
import { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import clsx from 'clsx';

dayjs.extend(duration);

const AuctionTimer: React.FC<{
  auction: Auction;
  auctionEnded: boolean;
}> = props => {
  const { auction, auctionEnded } = props;

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
  const flooredHours = Math.floor(timerDuration.hours());
  const flooredMinutes = Math.floor(timerDuration.minutes());
  const flooredSeconds = Math.floor(timerDuration.seconds());
  const isCool = useAppSelector(state => state.application.isCoolBackground);

  // Dynamically sets the document title based on `timerToggler` and `auctionTime` remaining
  let docTitle = `${flooredHours}h ${flooredMinutes}m`;
  if (timerToggle) {
    // Update every second when time remaining is less than 5 minutes
    if (auctionTimer < 300) docTitle = `${docTitle} ${flooredSeconds}s`;
  } else {
    docTitle = endTime.format('h:mm:ss a');
  }
  docTitle = `(${docTitle})`;
  useDocumentTitle(auctionTimer ? docTitle : null);

  if (!auction) return null;

  return (
    <Row
      className={clsx(classes.wrapper, classes.section)}
      onClick={() => setTimerToggle(!timerToggle)}
    >
      <Col xs={timerToggle ? 4 : 6} lg={12} className={classes.leftCol}>
        <h4
          style={{
            color: isCool ? 'var(--brand-cool-light-text)' : 'var(--brand-warm-light-text)',
          }}
        >
          {timerToggle
            ? window.innerWidth < 992
              ? auctionContentShort
              : auctionContentLong
            : `Ends on ${endTime.format('MMM Do')} at`}
        </h4>
      </Col>
      <Col xs="auto" lg={12}>
        {timerToggle ? (
          <h2
            className={clsx(classes.timerWrapper, classes.timeLeft)}
            style={{
              color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
            }}
          >
            <div className={classes.timerSection}>
              <span>
                {flooredHours}
                <span className={classes.small}>h</span>
              </span>
            </div>
            <div className={classes.timerSection}>
              <span>
                {flooredMinutes}
                <span className={classes.small}>m</span>
              </span>
            </div>
            <div className={classes.timerSectionFinal}>
              <span>
                {flooredSeconds}
                <span className={classes.small}>s</span>
              </span>
            </div>
          </h2>
        ) : (
          <h2
            className={classes.timerWrapper}
            style={{
              color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
            }}
          >
            <div className={clsx(classes.timerSection, classes.clockSection)}>
              <span>{endTime.format('h:mm:ss a')}</span>
            </div>
          </h2>
        )}
      </Col>
    </Row>
  );
};

export default AuctionTimer;
