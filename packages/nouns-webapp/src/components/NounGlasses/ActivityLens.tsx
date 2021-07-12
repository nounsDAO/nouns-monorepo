import Lens from './Lens';
import classes from './ActivityLens.module.css';
import { Auction } from '../../wrappers/nounsAuction';
import Bid from './ActivityLens/Bid';
import BidTimer from './ActivityLens/AuctionTimer';
import CurrentBid from './ActivityLens/CurrentBid';

const ActivityLens: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;

  const nounId = auction ? `Noun #${auction.nounId}` : '';

  return (
    <Lens zIndex={2}>
      <div className={classes.activityContainer}>
        <h1>{nounId}</h1>
        <CurrentBid auction={auction} />
        <BidTimer auction={auction} />
        {/* {auction && <BidHistory auctionId={auction.nounId.toString()} />} */}
      </div>
      <Bid auction={auction} />
    </Lens>
  );
};

export default ActivityLens;
