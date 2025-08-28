import React from 'react';

import nounPointerImg from '@/assets/noun-pointer.png';
import TruncatedAmount from '@/components/truncated-amount';

interface MinBidProps {
  minBid: bigint;
  onClick: () => void;
}

const MinBid: React.FC<MinBidProps> = ({ minBid, onClick }) => {
  const imgSrc =
    typeof nounPointerImg === 'string' ? nounPointerImg : (nounPointerImg as { src: string }).src;
  return (
    <div className="mt-4 flex" onClick={onClick}>
      <img src={imgSrc} alt="Pointer noun" />
      <h3 className="font-londrina text-brand-black ml-4 cursor-pointer text-xl font-normal">
        You must bid at least {!!minBid && <TruncatedAmount amount={minBid} />}
      </h3>
    </div>
  );
};
export default MinBid;
