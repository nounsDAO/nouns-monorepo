import { Auction } from '../../wrappers/nounsAuction';
import { useState } from 'react';
import { useAuctionMinBidIncPercentage } from '../../wrappers/nounsAuction';
import BigNumber from 'bignumber.js';
import { Row, Col } from 'react-bootstrap';
import classes from './AuctionActivity.module.css';
import Bid from '../Bid';
import AuctionTimer from '../AuctionTimer';
import CurrentBid from '../CurrentBid';
import MinBid from '../MinBid';
import moment from 'moment';
import BidHistory from '../BidHistory';
import { Modal } from 'react-bootstrap';
import AuctionNavigation from '../AuctionNavigation';
import AuctionActivityWrapper from '../AuctionActivityWrapper';

const computeMinimumNextBid = (
  currentBid: BigNumber,
  minBidIncPercentage: BigNumber | undefined,
): BigNumber => {
  if (!minBidIncPercentage) {
    return new BigNumber(0);
  }
  return currentBid
    .times(minBidIncPercentage.div(100).plus(1))
    .decimalPlaces(2, BigNumber.ROUND_CEIL);
};

const AuctionActivity: React.FC<{
  auction: Auction;
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
}> = props => {
  const { auction, isFirstAuction, isLastAuction, onPrevAuctionClick, onNextAuctionClick } = props;

  const [auctionEnded, setAuctionEnded] = useState(false);
  const setAuctionStateHandler = (ended: boolean) => {
    setAuctionEnded(ended);
  };

  const nounIdContent = auction && `Noun ${auction.nounId}`;
  const auctionStartTimeUTC =
    auction &&
    moment(Number(auction.startTime.toString()) * 1000)
      .utc()
      .format('MMM DD YYYY');

  const minBidIncPercentage = useAuctionMinBidIncPercentage();
  const minBid = computeMinimumNextBid(
    auction && new BigNumber(auction.amount.toString()),
    minBidIncPercentage,
  );

  const [displayMinBid, setDisplayMinBid] = useState(false);
  const minBidTappedHandler = () => {
    setDisplayMinBid(true);
  };
  const bidInputChangeHandler = () => {
    setDisplayMinBid(false);
  };

  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false);
  const showBidModalHandler = () => {
    setShowBidHistoryModal(true);
  };
  const dismissBidModalHanlder = () => {
    setShowBidHistoryModal(false);
  };

  const bidHistoryTitle = `Noun ${auction && auction.nounId.toString()} bid history`;

  return (
    <>
      {showBidHistoryModal && auction && (
        <Modal show={showBidHistoryModal} onHide={dismissBidModalHanlder} size="lg">
          <Modal.Header closeButton className={classes.modalHeader}>
            <Modal.Title className={classes.modalTitle}>
              <h1>{bidHistoryTitle}</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BidHistory auctionId={auction && auction.nounId.toString()} />
          </Modal.Body>
        </Modal>
      )}

      <AuctionActivityWrapper>
        <Row>
          <Col lg={12}>
            <h2>{auction && `${auctionStartTimeUTC} (GMT)`}</h2>
          </Col>
          <Col lg={12}>
            <h1 className={classes.nounTitle}>{nounIdContent}</h1>
            <AuctionNavigation
              isFirstAuction={isFirstAuction}
              isLastAuction={isLastAuction}
              onNextAuctionClick={onNextAuctionClick}
              onPrevAuctionClick={onPrevAuctionClick}
            />
          </Col>
          <Col lg={6}>
            {auction && (
              <CurrentBid
                currentBid={new BigNumber(auction.amount.toString())}
                auctionEnded={auctionEnded}
              />
            )}
          </Col>
          <Col lg={6}>
            <AuctionTimer
              auction={auction}
              auctionEnded={auctionEnded}
              setAuctionEnded={setAuctionStateHandler}
            />
          </Col>
          {auction && !auctionEnded && (
            <Col lg={12}>
              <MinBid minBid={minBid} onClick={minBidTappedHandler} />
            </Col>
          )}
          {isLastAuction && (
            <Col lg={12}>
              <Bid
                auction={auction}
                auctionEnded={auctionEnded}
                minBid={minBid}
                useMinBid={displayMinBid}
                onInputChange={bidInputChangeHandler}
              />
            </Col>
          )}
          {auction && (
            <Col lg={12}>
              <button className={classes.bidHistoryBtn} onClick={showBidModalHandler}>
                Bid history
              </button>
            </Col>
          )}
        </Row>
      </AuctionActivityWrapper>
    </>
  );
};

export default AuctionActivity;
