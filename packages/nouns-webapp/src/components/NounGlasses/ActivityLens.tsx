import Lens from './Lens';
import Bid from './Bid';
import classes from './ActivityLens.module.css';
import { Auction } from '../../wrappers/nounsAuction';
import { BidHistory } from '../BidHistory';

const ActivityLens: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;
  return (
    <Lens zIndex={2}>
      <div className={classes.activityContainer}>
        <h2>Recent Activity:</h2>
        {auction && <BidHistory auctionId={auction.nounId.toString()} />}
      </div>
      <Bid auction={props.auction && props.auction} />
    </Lens>
  );
};

export default ActivityLens;
