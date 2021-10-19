import { BigNumber } from 'ethers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const AuctionActivityDateHeadline: React.FC<{ startTime: BigNumber }> = props => {
  const { startTime } = props;
  const auctionStartTimeUTC = dayjs(startTime.toNumber() * 1000)
    .utc()
    .format('MMM DD YYYY');
  return <h4>{`${auctionStartTimeUTC}`}</h4>;
};

export default AuctionActivityDateHeadline;
