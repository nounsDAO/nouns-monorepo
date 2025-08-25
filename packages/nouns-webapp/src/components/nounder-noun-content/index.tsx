import React, { useCallback, useEffect } from 'react';

import { Trans } from '@lingui/react/macro';
import { Col, Row } from 'react-bootstrap';

import AuctionActivityDateHeadline from '@/components/auction-activity-date-headline';
import AuctionActivityNounTitle from '@/components/auction-activity-noun-title';
import AuctionActivityWrapper from '@/components/auction-activity-wrapper';
import AuctionNavigation from '@/components/auction-navigation';
import AuctionTitleAndNavWrapper from '@/components/auction-title-and-nav-wrapper';
import CurrentBid, { BID_N_A } from '@/components/current-bid';
import Winner from '@/components/winner';
import { useAppSelector } from '@/hooks';
import { cn } from '@/lib/utils';
import { Link } from 'react-router';

import nounContentClasses from './nounder-noun-content.module.css';

import auctionActivityClasses from '@/components/auction-activity/auction-activity.module.css';
import auctionBidClasses from '@/components/auction-activity/bid-history.module.css';

interface NounderNounContentProps {
  mintTimestamp: bigint;
  nounId: bigint;
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
}

const NounderNounContent: React.FC<NounderNounContentProps> = props => {
  const {
    mintTimestamp,
    nounId,
    isFirstAuction,
    isLastAuction,
    onPrevAuctionClick,
    onNextAuctionClick,
  } = props;

  const isCool = useAppSelector(state => state.application.isCoolBackground);

  // Page through Nouns via a keyboard
  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: { key: string }) => {
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
            <AuctionActivityNounTitle nounId={nounId} />
          </Col>
        </Row>
        <Row className={auctionActivityClasses.activityRow}>
          <Col lg={4} className={auctionActivityClasses.currentBidCol}>
            <CurrentBid currentBid={BID_N_A} auctionEnded={true} />
          </Col>
          <Col
            lg={5}
            className={cn(
              auctionActivityClasses.currentBidCol,
              nounContentClasses.currentBidCol,
              auctionActivityClasses.auctionTimerCol,
            )}
          >
            <div className={auctionActivityClasses.section}>
              <Winner winner={'0x'} isNounders={true} />
            </div>
          </Col>
        </Row>
      </div>
      <Row className={auctionActivityClasses.activityRow}>
        <Col lg={12}>
          <ul className={auctionBidClasses.bidCollection}>
            <li
              className={cn(
                isCool ? auctionBidClasses.bidRowCool : auctionBidClasses.bidRowWarm,
                nounContentClasses.bidRow,
              )}
            >
              <Trans>All Noun auction proceeds are sent to the</Trans>{' '}
              <Link to="/vote" className={nounContentClasses.link}>
                <Trans>Nouns DAO</Trans>
              </Link>
              .{' '}
              <Trans>
                For this reason, we, the project&#39;s founders (‘Nounders’) have chosen to
                compensate compensate ourselves with Nouns. Every 10th Noun for the first 5 years of
                the project will be sent to our multisig (5/10), where it will be vested and
                distributed Nounders.
              </Trans>
            </li>
          </ul>
          <div
            className={cn(
              'flex cursor-pointer justify-center rounded-[10px] transition-all duration-200 ease-in-out',
              isCool ? 'text-brand-cool-light-text' : 'text-brand-warm-light-text',
            )}
          >
            <Link
              to="/nounders"
              className={cn(
                'font-pt ml-2 text-[16px] font-bold no-underline transition-all duration-200 ease-in-out hover:brightness-110',
                isCool
                  ? 'text-brand-color-blue hover:text-brand-color-blue'
                  : 'text-brand-color-red hover:text-brand-color-red',
              )}
            >
              <Trans>Learn more</Trans> →
            </Link>
          </div>
        </Col>
      </Row>
    </AuctionActivityWrapper>
  );
};
export default NounderNounContent;
