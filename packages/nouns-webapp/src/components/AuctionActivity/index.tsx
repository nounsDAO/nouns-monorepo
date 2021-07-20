import { Auction } from '../../wrappers/nounsAuction';
import { useState } from 'react';
import { useAuctionMinBidIncPercentage } from '../../wrappers/nounsAuction';
import { BigNumber, utils, FixedNumber } from '@usedapp/core/node_modules/ethers';
import { Row, Col } from 'react-bootstrap';
import classes from './AuctionActivity.module.css';
import Bid from '../Bid';
import AuctionTimer from '../AuctionTimer';
import CurrentBid from '../CurrentBid';
import MinBid from '../MinBid';
import moment from 'moment';

export const useMinBid = (auction: Auction | undefined) => {
  const minBidIncPercentage = useAuctionMinBidIncPercentage();
  if (!auction || !minBidIncPercentage) {
    return 0;
  }

  const minBidInc = (minBidIncPercentage / 100 + 1).toString();
  const auctionAmount = FixedNumber.from(utils.formatEther(auction.amount));
  return FixedNumber.from(minBidInc).mulUnsafe(auctionAmount).toUnsafeFloat();
};

const AuctionActivity: React.FC<{ auction: Auction }> = props => {
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

  const minBid = useMinBid(auction);
  const [displayMinBid, setDisplayMinBid] = useState(false);
  const minBidTappedHandler = () => {
    setDisplayMinBid(true);
  };
  const bidInputChangeHandler = () => {
    setDisplayMinBid(false);
  };

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
            <AuctionTimer
              auction={auction}
              auctionEnded={auctionEnded}
              setAuctionEnded={setAuctionStateHandler}
            />
          </Col>
          <Col lg={12}>
            <Bid
              auction={auction}
              auctionEnded={auctionEnded}
              minBid={minBid}
              useMinBid={displayMinBid}
              onInputChange={bidInputChangeHandler}
            />
          </Col>
          {auction && !auctionEnded && (
            <Col lg={12}>
              <MinBid minBid={minBid} onClick={minBidTappedHandler} />
            </Col>
          )}
        </Row>
      </div>
    </>
  );
};

export default AuctionActivity;
