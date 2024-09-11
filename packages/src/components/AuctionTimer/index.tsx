import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Auction } from '../../wrappers/nounsAuction';
import classes from './AuctionTimer.module.css';
import { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import clsx from 'clsx';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

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
  const endTimeUnix = Math.floor(Date.now() / 1000) + auctionTimerRef.current;

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

  const auctionContentLong = auctionEnded ? (
    <Trans>Auction ended</Trans>
  ) : (
    <Trans>Auction ends in</Trans>
  );
  const auctionContentShort = auctionEnded ? (
    <Trans>Auction ended</Trans>
  ) : (
    <Trans>Time left</Trans>
  );

  const flooredMinutes = Math.floor(timerDuration.minutes());
  const flooredSeconds = Math.floor(timerDuration.seconds());
  const isCool = useAppSelector(state => state.application.isCoolBackground);

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
          {timerToggle ? (
            window.innerWidth < 992 ? (
              auctionContentShort
            ) : (
              auctionContentLong
            )
          ) : (
            <>
              <Trans>Ends on</Trans> {i18n.date(new Date(endTimeUnix * 1000), { month: 'short' })}{' '}
              {i18n.date(new Date(endTimeUnix * 1000), { day: 'numeric' })} <Trans>at</Trans>
            </>
          )}
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
                {`${Math.floor(timerDuration.hours())}`}
                <span className={classes.small}>
                  <Trans>h</Trans>
                </span>
              </span>
            </div>
            <div className={classes.timerSection}>
              <span>
                {`${flooredMinutes}`}
                <span className={classes.small}>
                  <Trans>m</Trans>
                </span>
              </span>
            </div>
            <div className={classes.timerSectionFinal}>
              <span>
                {`${flooredSeconds}`}
                <span className={classes.small}>
                  <Trans>s</Trans>
                </span>
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
              <span>{i18n.date(new Date(endTimeUnix * 1000), { timeStyle: 'medium' })}</span>
            </div>
          </h2>
        )}
      </Col>
    </Row>
  );
};

export default AuctionTimer;
