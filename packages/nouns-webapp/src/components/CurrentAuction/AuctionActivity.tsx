import { Auction } from '../../wrappers/nounsAuction';
import { useState } from 'react';
import classes from './AuctionActivity.module.css';
import Bid from './AuctionActivity/Bid';
import BidTimer from './AuctionActivity/AuctionTimer';
import CurrentBid from './AuctionActivity/CurrentBid';

const ActivityLens: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;

  const [auctionEnded, setAuctionEnded] = useState(false);
  const setAuctionStateHandler = (ended: boolean) => {
    setAuctionEnded(ended);
  };

  const nounIdContent = auction ? `Noun #${auction.nounId}` : '';

  return (
    <>
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
    </>
  );
};

export default ActivityLens;
