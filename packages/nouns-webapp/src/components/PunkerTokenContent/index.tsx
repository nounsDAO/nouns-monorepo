import { Col, Row } from 'react-bootstrap';
import { BigNumber } from 'ethers';
import AuctionActivityWrapper from '../AuctionActivityWrapper';
import AuctionNavigation from '../AuctionNavigation';
import AuctionActivityPunkTitle from '../AuctionActivityPunkTitle';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
import AuctionTitleAndNavWrapper from '../AuctionTitleAndNavWrapper';
import { Link } from 'react-router-dom';
import tokenContentClasses from './PunkerTokenContent.module.css';
import auctionBidClasses from '../AuctionActivity/BidHistory.module.css';
import bidBtnClasses from '../BidHistoryBtn/BidHistoryBtn.module.css';
import auctionActivityClasses from '../AuctionActivity/AuctionActivity.module.css';
import CurrentBid, { BID_N_A } from '../CurrentBid';
import Winner from '../Winner';
import { Trans } from '@lingui/macro';

import { useAppSelector } from '../../hooks';
import { useCallback, useEffect } from 'react';

const PunkerTokenContent: React.FC<{
  mintTimestamp: BigNumber;
  tokenId: BigNumber;
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
}> = props => {
  const {
    mintTimestamp,
    tokenId,
    isFirstAuction,
    isLastAuction,
    onPrevAuctionClick,
    onNextAuctionClick,
  } = props;

  console.log("---", mintTimestamp)

  const isCool = useAppSelector(state => state.application.isCoolBackground);

  // Page through Punks via keyboard
  // handle what happens on key press
  const handleKeyPress = useCallback(
    event => {
      console.log(event);
      if (event.key === 'ArrowLeft') {
        onPrevAuctionClick();
      }
      if (event.key === 'ArrowRight') {
        onNextAuctionClick();
      }
    },
    [onNextAuctionClick, onPrevAuctionClick],
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <AuctionActivityWrapper>
      <div className={auctionActivityClasses.informationRow}>
        <Row className={auctionActivityClasses.activityRow}>
          <AuctionTitleAndNavWrapper>
            <AuctionNavigation
              isFirstAuction={isFirstAuction}
              isLastAuction={isLastAuction}
              onNextAuctionClick={onNextAuctionClick}
              onPrevAuctionClick={onPrevAuctionClick}
            />
            <AuctionActivityDateHeadline startTime={mintTimestamp} />
          </AuctionTitleAndNavWrapper>
          <Col lg={12}>
            <AuctionActivityPunkTitle tokenId={tokenId} />
          </Col>
        </Row>
        <Row className={auctionActivityClasses.activityRow}>
          <Col lg={4} className={auctionActivityClasses.currentBidCol}>
            <CurrentBid currentBid={BID_N_A} auctionEnded={true} />
          </Col>
          <Col
            lg={5}
            className={`${auctionActivityClasses.currentBidCol} ${tokenContentClasses.currentBidCol} ${auctionActivityClasses.auctionTimerCol}`}
          >
            <div className={auctionActivityClasses.section}>
              <Winner />
            </div>
          </Col>
        </Row>
      </div>
      <Row className={auctionActivityClasses.activityRow}>
        <Col lg={12}>
          <ul className={auctionBidClasses.bidCollection}>
            <li
              className={
                (isCool ? `${auctionBidClasses.bidRowCool}` : `${auctionBidClasses.bidRowWarm}`) +
                ` ${tokenContentClasses.bidRow}`
              }
            >
              <Trans>All Token auction proceeds are sent to the</Trans>{' '}
              <Link to="/vote" className={tokenContentClasses.link}>
                <Trans>Punkers DAO</Trans>
              </Link>
              .{' '}
              <Trans>
                For this reason, we, the project's founders (‘Punkers’) have chosen to compensate
                ourselves with Punks. Every 10th Punk for the first 5 years of the project will be
                sent to our multisig (5/10), where it will be vested and distributed to individual
                Punkers.
              </Trans>
            </li>
          </ul>
          <div
            className={
              isCool ? bidBtnClasses.bidHistoryWrapperCool : bidBtnClasses.bidHistoryWrapperWarm
            }
          >
            {/*<Link*/}
            {/*  to="/nounders"*/}
            {/*  className={isCool ? bidBtnClasses.bidHistoryCool : bidBtnClasses.bidHistoryWarm}*/}
            {/*>*/}
            {/*  <Trans>Learn more</Trans> →*/}
            {/*</Link>*/}
          </div>
        </Col>
      </Row>
    </AuctionActivityWrapper>
  );
};
export default PunkerTokenContent;
