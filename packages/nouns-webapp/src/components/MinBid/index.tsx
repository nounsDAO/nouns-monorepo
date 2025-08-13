import React from 'react';

import nounPointerImg from '@/assets/noun-pointer.png';
import TruncatedAmount from '@/components/TruncatedAmount';

import classes from './MinBid.module.css';

interface MinBidProps {
  minBid: bigint;
  onClick: () => void;
}

const MinBid: React.FC<MinBidProps> = ({ minBid, onClick }) => {
  const imgSrc = typeof nounPointerImg === 'string' ? nounPointerImg : (nounPointerImg as any).src;
  return (
    <div className={classes.minBidWrapper} onClick={onClick}>
      <img src={imgSrc} alt="Pointer noun" />
      <h3 className={classes.minBid}>
        You must bid at least {!!minBid && <TruncatedAmount amount={minBid} />}
      </h3>
    </div>
  );
};
export default MinBid;
