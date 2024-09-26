import { BigNumber } from 'ethers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import classes from './AuctionActivityDateHeadline.module.css';
import { i18n } from '@lingui/core';

dayjs.extend(utc);

const AuctionActivityDateHeadline: React.FC<{ startTime: BigNumber }> = props => {
  const { startTime } = props;
  const auctionStartTimeUTC = dayjs(startTime.toNumber() * 1000)
    .utc()
    .format('MMMM DD, YYYY');
  return (
    <div className={classes.wrapper}>
      <h4
        className={classes.date}
        style={{ color: 'var(--brand-cool-dark-text)' }}
      >
        {i18n.date(auctionStartTimeUTC, { month: 'long', year: 'numeric', day: '2-digit' })}
      </h4>
    </div>
  );
};

export default AuctionActivityDateHeadline;
