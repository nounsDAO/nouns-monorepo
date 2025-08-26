import React, { useEffect, useRef, useState } from 'react';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { useAppSelector } from '@/hooks';
import { cn } from '@/lib/utils';

dayjs.extend(duration);

interface ForkingPeriodTimerProps {
  endTime: number;
  isPeriodEnded: boolean;
}

const ForkingPeriodTimer: React.FC<ForkingPeriodTimerProps> = props => {
  const [auctionTimer, setAuctionTimer] = useState(0);
  const [timerToggle, setTimerToggle] = useState(true);
  const auctionTimerRef = useRef(auctionTimer); // to access within setTimeout
  auctionTimerRef.current = auctionTimer;
  const timerDuration = dayjs.duration(auctionTimerRef.current, 's');
  const endTimeUnix = Math.floor(Date.now() / 1000) + auctionTimerRef.current;

  // timer logic
  useEffect(() => {
    const timeLeft = props.endTime - dayjs().unix();

    setAuctionTimer(timeLeft);

    if (!props.isPeriodEnded && timeLeft <= 0) {
      setAuctionTimer(0);
    } else {
      const timer = setTimeout(() => {
        setAuctionTimer(auctionTimerRef.current - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [props.isPeriodEnded, auctionTimer, props.endTime]);

  const flooredMinutes = Math.floor(timerDuration.minutes());
  const flooredSeconds = Math.floor(timerDuration.seconds());
  const flooredHours = Math.floor(timerDuration.hours());
  const flooredDays = Math.floor(timerDuration.days());
  const isCool = useAppSelector(state => state.application.isCoolBackground);

  if (props.isPeriodEnded) return null;

  return (
    <div className="text-center" onClick={() => setTimerToggle(!timerToggle)}>
      {timerToggle ? (
        <>
          <h2
            className={cn('flex items-center justify-center', 'lg-max:pr-2')}
            style={{
              color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
            }}
          >
            <div className="leading-tight-3 mr-2 text-center">
              {flooredDays > 0 && (
                <span>
                  {`${Math.floor(timerDuration.days())}`}
                  <span>
                    {' '}
                    <Trans>days</Trans>
                  </span>
                </span>
              )}
            </div>
            <div className="leading-tight-3 mr-2 text-center">
              <span>
                {`${Math.floor(timerDuration.hours())}`}
                <span>
                  {' '}
                  <Trans>hours</Trans>
                </span>
              </span>
            </div>
            <div className="leading-tight-3 mr-2 text-center">
              <span>
                {`${flooredMinutes}`}
                <span>
                  {' '}
                  <Trans>minutes</Trans>
                </span>
              </span>
            </div>
            {flooredDays === 0 && flooredHours < 1 && (
              <div className="leading-tight-3 mr-0 text-center">
                <span>
                  {`${flooredSeconds}`}
                  <span>
                    {' '}
                    <Trans>seconds</Trans>
                  </span>
                </span>
              </div>
            )}
          </h2>
          <p>time left to return Nouns and join this fork</p>
        </>
      ) : (
        <>
          <h2
            className="flex items-center justify-center"
            style={{
              color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
            }}
          >
            <div className={cn('leading-tight-3 mr-2 text-center')}>
              <span>{i18n.date(new Date(endTimeUnix * 1000))}</span>{' '}
              <span>{i18n.date(new Date(endTimeUnix * 1000), { timeStyle: 'medium' })}</span>
            </div>
          </h2>
          <p>forking period ends</p>
        </>
      )}
    </div>
  );
};

export default ForkingPeriodTimer;
