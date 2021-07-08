import Lens from './Lens';
import classes from './ActivityLens.module.css';

const ActivityLens = () => {
  return (
    <Lens zIndex={2}>
      <div className={classes.activityContainer}>
        <h2>Recent Activity:</h2>
        <ul>
          <li>0.01 0xabc 1h</li>
          <li>0.01 0xabc 1h</li>
          <li>0.01 0xabc 1h</li>
          <li>0.01 0xabc 1h</li>
        </ul>
      </div>
      <button className={classes.bidBtn}>BID</button>
      <input className={classes.bidInput} type="number" placeholder="ETH" min="0"></input>
    </Lens>
  );
};

export default ActivityLens;
