import Lens from './Lens';
import classes from './ActivityLens.module.css';
import { useState } from 'react';

const ActivityLens: React.FC<{ onPlaceBid: (bidAmount: number) => void }> = props => {
  const [bid, setBid] = useState(0);

  const placeBidHandler = () => {
    props.onPlaceBid(bid);
  };

  const bidInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const bidNumber = Number(event.target.value);
    if (bidNumber > 0) {
      setBid(bidNumber);
    }
  };

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
      <button className={classes.bidBtn} onClick={placeBidHandler}>
        BID
      </button>
      <input
        className={classes.bidInput}
        onChange={bidInputHandler}
        type="number"
        placeholder="ETH"
        min="0"
      ></input>
    </Lens>
  );
};

export default ActivityLens;
