import { BigNumber } from 'ethers';
import moment from 'moment';

const AuctionActivityDateHeadline: React.FC<{ startTime: BigNumber }> = props => {
  const { startTime } = props;
  const auctionStartTimeUTC = moment(Number(startTime.toString()) * 1000)
    .utc()
    .format('MMM DD YYYY');
  return <h4>{`${auctionStartTimeUTC}`}</h4>;
};

export default AuctionActivityDateHeadline;
