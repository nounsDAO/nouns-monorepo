import { BigNumber } from 'ethers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import classes from './AuctionActivityDateHeadline.module.css';

dayjs.extend(utc);

const AuctionActivityDateHeadline: React.FC<{ startTime: BigNumber }> = props => {
  const { startTime } = props;
  const auctionStartTimeUTC = dayjs(startTime.toNumber() * 1000)
    .utc()
    .format('MMMM D, YYYY');
  return (
    <div className={classes.wrapper}>
      <h4>{`${auctionStartTimeUTC}`}</h4>
    </div>
  );
};

export default AuctionActivityDateHeadline;
