import { Auction } from '../../wrappers/nounsAuction';
import { useState } from 'react';
import { useAuctionMinBidIncPercentage } from '../../wrappers/nounsAuction';
import { BigNumber, utils } from '@usedapp/core/node_modules/ethers';
import { Row, Col } from 'react-bootstrap';
import classes from './AuctionActivity.module.css';
import Bid from './AuctionActivity/Bid';
import BidTimer from './AuctionActivity/AuctionTimer';
import CurrentBid from './AuctionActivity/CurrentBid';
import moment from 'moment';
import nounPointerImg from '../../assets/noun-pointer.png';

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

  const minBidInc = useAuctionMinBidIncPercentage();
  const minBid =
    minBidInc &&
    auction &&
    (BigNumber.from(minBidInc).toNumber() / 100 + 1) * Number(utils.formatEther(auction.amount));

  return (
    <>
      <div className={classes.activityContainer}>
        <h2>{auction && `${auctionStartTimeUTC} (GMT)`}</h2>
        <h1 className={classes.nounTitle}>{nounIdContent}</h1>
        <Row>
          <Col lg={6}>
            <CurrentBid auction={auction} auctionEnded={auctionEnded} />
          </Col>
          <Col lg={6}>
            <BidTimer
              auction={auction}
              auctionEnded={auctionEnded}
              setAuctionEnded={setAuctionStateHandler}
            />
          </Col>
          <Col lg={12}>
            <Bid auction={auction} auctionEnded={auctionEnded} />
          </Col>
          <Col lg={12}>
            <div className={classes.minBidWrapper}>
              <img src={nounPointerImg} alt="Pointer noun" />
              <h3 className={classes.minBid}>You must bid at least {minBid} ETH</h3>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ActivityLens;
