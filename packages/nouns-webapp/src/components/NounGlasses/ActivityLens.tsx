import Lens from './Lens';
import classes from './ActivityLens.module.css';
import React from 'react';
import { useRef } from 'react';

const ActivityLens: React.FC<{ onPlaceBid: (bidAmount: number) => void }> = props => {
  const placeBidInputRef = useRef<HTMLInputElement>(null);

  const placeBidHandler = () => {
    const bid = Number(placeBidInputRef.current!.value);
    if (bid > 0) {
      props.onPlaceBid(bid);
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
        ref={placeBidInputRef}
        type="number"
        placeholder="ETH"
        min="0"
      ></input>
    </Lens>
  );
};

export default ActivityLens;
