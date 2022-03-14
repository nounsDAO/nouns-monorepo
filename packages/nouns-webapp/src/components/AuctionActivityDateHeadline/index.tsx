import { BigNumber } from 'ethers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import classes from './AuctionActivityDateHeadline.module.css';
import { useAppSelector } from '../../hooks';
import { black, primary } from '../../utils/nounBgColors';

dayjs.extend(utc);

const AuctionActivityDateHeadline: React.FC<{
  startTime: BigNumber;
  isEthereum?: boolean;
}> = props => {
  const { startTime, isEthereum = false } = props;
  const auctionStartTimeUTC = dayjs(startTime.toNumber() * 1000)
    .utc()
    .format('MMMM DD, YYYY');
  return (
    <div className={classes.wrapper}>
      <h4
        className={classes.date}
        style={{ color: isEthereum ? primary : black }}
      >{`${auctionStartTimeUTC}`}</h4>
    </div>
  );
};

export default AuctionActivityDateHeadline;
