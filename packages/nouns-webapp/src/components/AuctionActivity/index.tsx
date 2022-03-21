import { Auction } from '../../wrappers/nounsAuction';
import { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { Row, Col, Card } from 'react-bootstrap';
import classes from './AuctionActivity.module.css';
import bidHistoryClasses from './BidHistory.module.css';
import Bid from '../Bid';
import AuctionTimer from '../AuctionTimer';
import CurrentBid from '../CurrentBid';
import Winner from '../Winner';
import BidHistory from '../BidHistory';
import { Modal } from 'react-bootstrap';
import AuctionNavigation from '../AuctionNavigation';
import AuctionActivityWrapper from '../AuctionActivityWrapper';
import AuctionTitleAndNavWrapper from '../AuctionTitleAndNavWrapper';
import AuctionActivityNounTitle from '../AuctionActivityNounTitle';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
import BidHistoryBtn from '../BidHistoryBtn';
import StandaloneNoun from '../StandaloneNoun';
import config from '../../config';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import NounInfoCard from '../NounInfoCard';
import { useAppSelector } from '../../hooks';
import { black, primary } from '../../utils/nounBgColors';
import AuctionDescription from '../AuctionDescription';
import BlueClose from '../../assets/blue-close.png';
import BlackClose from '../../assets/black-close.png';

const openEtherscanBidHistory = () => {
  const url = buildEtherscanAddressLink(config.addresses.nounsAuctionHouseProxy);
  window.open(url);
};

interface AuctionActivityProps {
  auction: Auction;
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
  displayGraphDepComps: boolean;
  isEthereum?: boolean;
}

const AuctionActivity: React.FC<AuctionActivityProps> = (props: AuctionActivityProps) => {
  const {
    auction,
    isFirstAuction,
    isLastAuction,
    onPrevAuctionClick,
    onNextAuctionClick,
    displayGraphDepComps,
    isEthereum = false,
  } = props;

  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);

  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false);
  const showBidModalHandler = () => {
    setShowBidHistoryModal(true);
  };
  const dismissBidModalHanlder = () => {
    setShowBidHistoryModal(false);
  };

  // const bidHistoryTitle = <h1>Bid History</h1>;

  // timer logic - check auction status every 30 seconds, until five minutes remain, then check status every second
  useEffect(() => {
    if (!auction) return;

    const timeLeft = Number(auction.endTime) - Math.floor(Date.now() / 1000);

    if (auction && timeLeft <= 0) {
      setAuctionEnded(true);
    } else {
      setAuctionEnded(false);
      const timer = setTimeout(
        () => {
          setAuctionTimer(!auctionTimer);
        },
        timeLeft > 300 ? 30000 : 1000,
      );

      return () => {
        clearTimeout(timer);
      };
    }
  }, [auctionTimer, auction]);

  if (!auction) return null;

  return (
    <>
      {showBidHistoryModal && (
        <Modal
          show={showBidHistoryModal}
          onHide={dismissBidModalHanlder}
          dialogClassName="modal-90w"
          centered
        >
          <Card style={{ background: isEthereum ? black : primary }}>
            <Modal.Header className={classes.modalHeader}>
              <Modal.Title
                className={classes.modalTitleWrapper}
                style={{ color: isEthereum ? primary : black }}
              >
                Bid History
              </Modal.Title>
              <button type="button" onClick={dismissBidModalHanlder} className={classes.modalClose}>
                <img src={isEthereum ? BlueClose : BlackClose} />
              </button>
            </Modal.Header>
            <Modal.Body className={classes.modalBodyWrapper}>
              <BidHistory
                isEthereum={isEthereum}
                auctionId={auction.nounId.toString()}
                max={9999}
              />
            </Modal.Body>
          </Card>
        </Modal>
      )}

      <AuctionActivityWrapper>
        <div className={classes.informationRow}>
          <Row className={classes.activityRow}>
            <Col lg={12}>
              <AuctionActivityNounTitle
                isEthereum={isEthereum}
                name={auction.name}
                nounId={auction.nounId}
              />
            </Col>
            <AuctionTitleAndNavWrapper>
              {displayGraphDepComps && (
                <AuctionNavigation
                  isEthereum={isEthereum}
                  isFirstAuction={isFirstAuction}
                  isLastAuction={isLastAuction}
                  onNextAuctionClick={onNextAuctionClick}
                  onPrevAuctionClick={onPrevAuctionClick}
                />
              )}
              <AuctionActivityDateHeadline isEthereum={isEthereum} startTime={auction.startTime} />
            </AuctionTitleAndNavWrapper>
          </Row>
          <div
            className={classes.activityRow}
            style={{ borderBottom: `1px solid ${isEthereum ? primary : black}` }}
          >
            <div className={classes.currentBidCol}>
              <CurrentBid
                isEthereum={isEthereum}
                currentBid={new BigNumber(auction.amount.toString())}
                auctionEnded={auctionEnded}
              />
            </div>
            <div className={classes.auctionTimerCol}>
              {auctionEnded ? (
                <Winner winner={auction.bidder} isEthereum={isEthereum} />
              ) : (
                <AuctionTimer
                  auction={auction}
                  isEthereum={isEthereum}
                  auctionEnded={auctionEnded}
                />
              )}
            </div>
          </div>
          <Row className={classes.activityRow}>
            <AuctionDescription isEthereum={isEthereum} description={auction.description ?? ''} />
          </Row>
        </div>
        {isLastAuction && !auctionEnded && (
          <>
            <Row className={classes.activityRow}>
              <Col lg={12}>
                <Bid auction={auction} isEthereum={isEthereum} auctionEnded={auctionEnded} />
              </Col>
            </Row>
          </>
        )}
        <Row className={classes.activityRow}>
          <Col lg={12}>
            {!isLastAuction ? (
              <NounInfoCard
                nounId={auction.nounId.toNumber()}
                isEthereum={isEthereum}
                bidHistoryOnClickHandler={showBidModalHandler}
              />
            ) : (
              displayGraphDepComps && (
                <BidHistory
                  isEthereum={isEthereum}
                  auctionId={auction.nounId.toString()}
                  max={3}
                  classes={bidHistoryClasses}
                />
              )
            )}
            {/* If no bids, show nothing. If bids avail:graph is stable? show bid history modal,
            else show etherscan contract link */}
            {isLastAuction &&
              !auction.amount.eq(0) &&
              (displayGraphDepComps ? (
                <BidHistoryBtn onClick={showBidModalHandler} />
              ) : (
                <BidHistoryBtn onClick={openEtherscanBidHistory} />
              ))}
          </Col>
        </Row>
      </AuctionActivityWrapper>
    </>
  );
};

export default AuctionActivity;
