import { Auction } from '../../wrappers/nounsAuction';
import { useState } from 'react';
import { BigNumber } from '@usedapp/core/node_modules/ethers';
import classes from './AuctionActivity.module.css';
import Bid from './AuctionActivity/Bid';
import BidTimer from './AuctionActivity/AuctionTimer';
import CurrentBid from './AuctionActivity/CurrentBid';
import moment from 'moment';

const ActivityLens: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;

  const [auctionEnded, setAuctionEnded] = useState(false);
  const setAuctionStateHandler = (ended: boolean) => {
    setAuctionEnded(ended);
  };

  const nounIdContent = auction && `Noun #${auction.nounId}`;
  const auctionStartTimeUTC =
    auction &&
    moment(BigNumber.from(auction.startTime).toNumber() * 1000)
      .utc()
      .format('MMM DD YYYY');

  return (
    <>
      <div className={classes.activityContainer}>
        <h2>{auction && `${auctionStartTimeUTC} (GMT)`}</h2>
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
