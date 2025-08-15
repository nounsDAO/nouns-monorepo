import React, { useEffect, useRef, useState } from 'react';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import cx from 'clsx';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { useAppSelector } from '@/hooks';
import { Auction } from '@/wrappers/nounsAuction';

import classes from './auction-timer.module.css';

dayjs.extend(duration);

interface AuctionTimerProps {
  auction: Auction;
  auctionEnded: boolean;
}

const AuctionTimer: React.FC<AuctionTimerProps> = ({ auction, auctionEnded }) => {
  const [auctionTimer, setAuctionTimer] = useState(0);
  const [timerToggle, setTimerToggle] = useState(true);

  const auctionTimerRef = useRef(auctionTimer); // to access within setTimeout
  auctionTimerRef.current = auctionTimer;

  const timerDuration = dayjs.duration(auctionTimerRef.current, 's');
  const endTimeUnix = Math.floor(Date.now() / 1000) + auctionTimerRef.current;

  // timer logic
  useEffect(() => {
    if (auction == null) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setAuctionTimer(0);
      return;
    }

    const timeLeft = Number(auction.endTime) - dayjs().unix();

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setAuctionTimer(timeLeft);

    if (timeLeft <= 0) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
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

  if (auction == null) return null;

  return (
    <div
      className={cx(classes.wrapper, classes.section)}
      onClick={() => setTimerToggle(!timerToggle)}
    >
      <div className={classes.leftCol}>
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
      </div>
      <div>
        {timerToggle ? (
          <h2
            className={cx(classes.timerWrapper, classes.timeLeft)}
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
            <div className={cx(classes.timerSection, classes.clockSection)}>
              <span>{i18n.date(new Date(endTimeUnix * 1000), { timeStyle: 'medium' })}</span>
            </div>
          </h2>
        )}
      </div>
    </div>
  );
};

export default AuctionTimer;
