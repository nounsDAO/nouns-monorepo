import React, { useEffect, useRef, useState } from 'react';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { useAppSelector } from '@/hooks';
import { Auction } from '@/wrappers/nouns-auction';

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
      className="lg-max:mx-0 lg-max:w-auto lg-max:pl-0 lg-max:justify-between mt-0.3 flex w-max cursor-pointer flex-wrap pl-10 pr-0"
      onClick={() => setTimerToggle(!timerToggle)}
    >
      <div className="lg-max:mt-0 lg-max:pl-2 mt-px">
        <h4
          className="font-pt lg-max:mb-0 lg-max:mt-1.5 text-lg font-bold"
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
            className="font-pt lg-max:text-23 lg-max:pr-2 text-32 mb-0 mt-px flex font-bold"
            style={{
              color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
            }}
          >
            <div className="mr-2">
              <span className="font-pt lg-max:text-23 text-32 font-bold">
                {`${Math.floor(timerDuration.hours())}`}
                <span className="font-pt lg-max:text-23 text-32 font-bold">
                  <Trans>h</Trans>
                </span>
              </span>
            </div>
            <div className="mr-2">
              <span className="font-pt lg-max:text-23 text-32 font-bold">
                {`${flooredMinutes}`}
                <span className="font-pt lg-max:text-23 text-32 font-bold">
                  <Trans>m</Trans>
                </span>
              </span>
            </div>
            <div className="mr-0">
              <span className="font-pt lg-max:text-23 text-32 font-bold">
                {`${flooredSeconds}`}
                <span className="font-pt lg-max:text-23 text-32 font-bold">
                  <Trans>s</Trans>
                </span>
              </span>
            </div>
          </h2>
        ) : (
          <h2
            className="font-pt lg-max:text-23 text-32 mb-0 mt-px flex font-bold"
            style={{
              color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
            }}
          >
            <div className="mr-2">
              <span className="font-pt lg-max:text-23 text-32 font-bold">
                {i18n.date(new Date(endTimeUnix * 1000), { timeStyle: 'medium' })}
              </span>
            </div>
          </h2>
        )}
      </div>
    </div>
  );
};

export default AuctionTimer;
