import Lens from './Lens';
import Bid from './Bid';
import classes from './ActivityLens.module.css';
import { Auction } from '../../wrappers/nounsAuction';

const ActivityLens: React.FC<{ auction: Auction }> = props => {
  return (
    <Lens zIndex={2}>
      <div className={classes.activityContainer}>
        <h2>Recent Activity:</h2>
        <ul>
          <li key={Math.random()}>0.01 0xabc 1h</li>
          <li key={Math.random()}>0.01 0xabc 1h</li>
          <li key={Math.random()}>0.01 0xabc 1h</li>
          <li key={Math.random()}>0.01 0xabc 1h</li>
        </ul>
      </div>
      <Bid auction={props.auction && props.auction} />
    </Lens>
  );
};

export default ActivityLens;
