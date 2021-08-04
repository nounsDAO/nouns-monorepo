import { Auction } from '../../wrappers/nounsAuction';
import { useState } from 'react';
import BigNumber from 'bignumber.js';
import { Row, Col } from 'react-bootstrap';
import classes from './AuctionActivity.module.css';
import Bid from '../Bid';
import AuctionTimer from '../AuctionTimer';
import CurrentBid from '../CurrentBid';
import BidHistory from '../BidHistory';
import { Modal } from 'react-bootstrap';
import AuctionNavigation from '../AuctionNavigation';
import AuctionActivityWrapper from '../AuctionActivityWrapper';
import AuctionActivityNounTitle from '../AuctionActivityNounTitle';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
import BidHistoryBtn from '../BidHistoryBtn';

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

  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false);
  const showBidModalHandler = () => {
    setShowBidHistoryModal(true);
  };
  const dismissBidModalHanlder = () => {
    setShowBidHistoryModal(false);
  };

  const bidHistoryTitle = `Noun ${auction && auction.nounId.toString()} bid history`;

  if (!auction) return null;

  return (
    <>
      {showBidHistoryModal && (
        <Modal show={showBidHistoryModal} onHide={dismissBidModalHanlder} size="lg">
          <Modal.Header closeButton className={classes.modalHeader}>
            <Modal.Title className={classes.modalTitle}>
              <h1>{bidHistoryTitle}</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BidHistory auctionId={auction.nounId.toString()} />
          </Modal.Body>
        </Modal>
      )}

      <AuctionActivityWrapper>
        <Row className={classes.activityRow}>
          <Col lg={12}>
            <AuctionActivityDateHeadline startTime={auction.startTime} />
          </Col>
          <Col lg={12} className={classes.colAlignCenter}>
            <AuctionActivityNounTitle nounId={auction.nounId} />
            <AuctionNavigation
              isFirstAuction={isFirstAuction}
              isLastAuction={isLastAuction}
              onNextAuctionClick={onNextAuctionClick}
              onPrevAuctionClick={onPrevAuctionClick}
            />
          </Col>
        </Row>
        <Row className={classes.activityRow}>
          <Col lg={6}>
            <CurrentBid
              currentBid={new BigNumber(auction.amount.toString())}
              auctionEnded={auctionEnded}
            />
          </Col>
          <Col lg={6}>
            <AuctionTimer
              auction={auction}
              auctionEnded={auctionEnded}
              setAuctionEnded={setAuctionStateHandler}
            />
          </Col>
        </Row>

        {isLastAuction && (
          <Row className={classes.activityRow}>
            <Col lg={12}>
              <Bid auction={auction} auctionEnded={auctionEnded} />
            </Col>
          </Row>
        )}

        <Row className={classes.activityRow}>
          <Col lg={12}>
            <BidHistoryBtn onClick={showBidModalHandler} />
          </Col>
        </Row>

      </AuctionActivityWrapper>
    </>
  );
};

export default AuctionActivity;
