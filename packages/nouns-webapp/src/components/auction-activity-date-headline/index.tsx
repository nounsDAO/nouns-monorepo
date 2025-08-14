import React from 'react';

import { i18n } from '@lingui/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { useAppSelector } from '@/hooks';

import classes from './AuctionActivityDateHeadline.module.css';

dayjs.extend(utc);

type AuctionActivityDateHeadlineProps = { startTime: bigint };
const AuctionActivityDateHeadline: React.FC<AuctionActivityDateHeadlineProps> = props => {
  const { startTime } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const auctionStartTimeUTC = dayjs(Number(startTime) * 1000)
    .utc()
    .format('MMMM DD, YYYY');
  return (
    <div className={classes.wrapper}>
      <h4
        className={classes.date}
        style={{ color: isCool ? 'var(--brand-cool-light-text)' : 'var(--brand-warm-light-text)' }}
      >
        {i18n.date(auctionStartTimeUTC, { month: 'long', year: 'numeric', day: '2-digit' })}
      </h4>
    </div>
  );
};

export default AuctionActivityDateHeadline;
