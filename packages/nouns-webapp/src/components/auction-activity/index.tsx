import React, { useEffect, useState } from 'react';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
// eslint-disable-next-line no-restricted-imports
import { Col, Row } from 'react-bootstrap';

import AuctionActivityDateHeadline from '@/components/auction-activity-date-headline';
import AuctionActivityNounTitle from '@/components/auction-activity-noun-title';
import AuctionActivityWrapper from '@/components/auction-activity-wrapper';
import AuctionNavigation from '@/components/auction-navigation';
import AuctionTimer from '@/components/auction-timer';
import AuctionTitleAndNavWrapper from '@/components/auction-title-and-nav-wrapper';
import Bid from '@/components/bid';
import BidHistory from '@/components/bid-history';
import BidHistoryBtn from '@/components/bid-history-btn';
import BidHistoryModal from '@/components/bid-history-modal';
import CurrentBid from '@/components/current-bid';
import Holder from '@/components/holder';
import NounInfoCard from '@/components/noun-info-card';
import Winner from '@/components/winner';
import { nounsAuctionHouseAddress } from '@/contracts';
import { useAppSelector } from '@/hooks';
import { RootState } from '@/store';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { defaultChain } from '@/wagmi';
import { Auction } from '@/wrappers/nounsAuction';

import classes from './auction-activity.module.css';
import bidHistoryClasses from './bid-history.module.css';

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

  const [auctionTimer, setAuctionTimer] = useState(false);
  const auctionEnded =
    auction != null ? Number(auction.endTime) - Math.floor(Date.now() / 1000) <= 0 : false;

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
    if (!auction) return;
    const timeLeft = Number(auction.endTime) - Math.floor(Date.now() / 1000);

    if (timeLeft > 0) {
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
