import React, { useEffect, useState } from 'react';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
import { Col, Row } from 'react-bootstrap';

import AuctionActivityDateHeadline from '@/components/AuctionActivityDateHeadline';
import AuctionActivityNounTitle from '@/components/AuctionActivityNounTitle';
import AuctionActivityWrapper from '@/components/AuctionActivityWrapper';
import AuctionNavigation from '@/components/AuctionNavigation';
import AuctionTimer from '@/components/AuctionTimer';
import AuctionTitleAndNavWrapper from '@/components/AuctionTitleAndNavWrapper';
import Bid from '@/components/Bid';
import BidHistory from '@/components/BidHistory';
import BidHistoryBtn from '@/components/BidHistoryBtn';
import BidHistoryModal from '@/components/BidHistoryModal';
import CurrentBid from '@/components/CurrentBid';
import Holder from '@/components/Holder';
import NounInfoCard from '@/components/NounInfoCard';
import Winner from '@/components/Winner';
import { nounsAuctionHouseAddress } from '@/contracts';
import { useAppSelector } from '@/hooks';
import { RootState } from '@/store';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { defaultChain } from '@/wagmi';
import { Auction } from '@/wrappers/nounsAuction';

import classes from './AuctionActivity.module.css';
import bidHistoryClasses from './BidHistory.module.css';

const openEtherscanBidHistory = () => {
  const chainId = defaultChain.id;
  const url = buildEtherscanAddressLink(nounsAuctionHouseAddress[chainId]);
  window.open(url);
};

interface AuctionActivityProps {
  auction: Auction;
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
  displayGraphDepComps: boolean;
}

const AuctionActivity: React.FC<AuctionActivityProps> = (props: AuctionActivityProps) => {
  const {
    auction,
    isFirstAuction,
    isLastAuction,
    onPrevAuctionClick,
    onNextAuctionClick,
    displayGraphDepComps,
  } = props;

  const isCool = useAppSelector((state: RootState) => state.application.isCoolBackground);

  const [auctionEnded, setAuctionEnded] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(false);

  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false);
  const showBidModalHandler = () => {
    setShowBidHistoryModal(true);
  };
  const dismissBidModalHandler = () => {
    setShowBidHistoryModal(false);
  };

  const renderAuctionWinner = () => {
    if (isLastAuction && auction.bidder) {
      return <Winner winner={auction.bidder} />;
    }
    return <Holder nounId={BigInt(auction.nounId)} />;
  };

  // timer logic - check auction status every 30 seconds, until five minutes remain, then check status every second
  useEffect(() => {
    const timeLeft = Number(auction.endTime) - Math.floor(Date.now() / 1000);

    if (timeLeft <= 0) {
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

  return (
    <>
      {showBidHistoryModal && (
        <BidHistoryModal onDismiss={dismissBidModalHandler} auction={auction} />
      )}

      <AuctionActivityWrapper>
        <div className={classes.informationRow}>
          <Row className={classes.activityRow}>
            <AuctionTitleAndNavWrapper>
              {displayGraphDepComps && (
                <AuctionNavigation
                  isFirstAuction={isFirstAuction}
                  isLastAuction={isLastAuction}
                  onNextAuctionClick={onNextAuctionClick}
                  onPrevAuctionClick={onPrevAuctionClick}
                />
              )}
              <AuctionActivityDateHeadline startTime={BigInt(auction.startTime)} />
            </AuctionTitleAndNavWrapper>
            <Col lg={12}>
              <AuctionActivityNounTitle isCool={isCool} nounId={BigInt(auction.nounId)} />
            </Col>
          </Row>
          <Row className={classes.activityRow}>
            <Col lg={4} className={classes.currentBidCol}>
              <CurrentBid
                currentBid={BigInt(auction.amount?.toString() ?? '0')}
                auctionEnded={auctionEnded}
              />
            </Col>
            <Col lg={6} className={classes.auctionTimerCol}>
              {auctionEnded ? (
                renderAuctionWinner()
              ) : (
                <AuctionTimer auction={auction} auctionEnded={auctionEnded} />
              )}
            </Col>
          </Row>
        </div>
        {auctionEnded && (
          <Row className={classes.activityRow}>
            <Col lg={12} className={classes.nextNounLink}>
              <FontAwesomeIcon icon={faInfoCircle} />
              <a href={'https://www.nouns.game/crystal-ball'} target={'_blank'} rel="noreferrer">
                <Trans>Help mint the next Noun</Trans>
              </a>
            </Col>
          </Row>
        )}
        {isLastAuction && (
          <>
            <Row className={classes.activityRow}>
              <Col lg={12}>
                <Bid auction={auction} auctionEnded={auctionEnded} />
              </Col>
            </Row>
          </>
        )}
        <Row className={classes.activityRow}>
          <Col lg={12}>
            {!isLastAuction ? (
              <NounInfoCard
                nounId={BigInt(auction.nounId)}
                bidHistoryOnClickHandler={showBidModalHandler}
              />
            ) : (
              displayGraphDepComps && (
                <BidHistory
                  auctionId={auction.nounId.toString()}
                  max={3}
                  classes={bidHistoryClasses}
                />
              )
            )}
            {/* If no bids, show nothing. If bids avail:graph is stable? Show bid history modal,
            else show etherscan contract link */}
            {isLastAuction &&
              auction.amount !== 0n &&
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
