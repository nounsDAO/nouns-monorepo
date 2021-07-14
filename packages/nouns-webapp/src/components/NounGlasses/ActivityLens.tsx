import Lens from './Lens';
import classes from './ActivityLens.module.css';
import { Auction } from '../../wrappers/nounsAuction';
import Bid from './ActivityLens/Bid';
import BidTimer from './ActivityLens/AuctionTimer';
import CurrentBid from './ActivityLens/CurrentBid';
import { useState } from 'react';

const ActivityLens: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;

  const [auctionEnded, setAuctionEnded] = useState(false);
  const setAuctionStateHandler = (ended: boolean) => {
    setAuctionEnded(ended);
  };

  const nounIdContent = auction ? `Noun #${auction.nounId}` : '';

  return (
    <Lens zIndex={2}>
      <div className={classes.activityContainer}>
        <h1 className={classes.nounTitle}>{nounIdContent}</h1>
        <CurrentBid auction={auction} auctionEnded={auctionEnded} />
        <BidTimer
          auction={auction}
          auctionEnded={auctionEnded}
          setAuctionEnded={setAuctionStateHandler}
        />
        {/* {auction && <BidHistory auctionId={auction.nounId.toString()} />} */}
      </div>
      <Bid auction={auction} auctionEnded={auctionEnded} />
    </Lens>
  );
};

export default ActivityLens;
