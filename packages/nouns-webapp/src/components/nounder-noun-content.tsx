import React, { useCallback, useEffect } from 'react';

import { Trans } from '@lingui/react/macro';

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
      <div className="mb-2">
        <div className={cn('mb-0', 'grid grid-cols-1 gap-4')}>
          <AuctionTitleAndNavWrapper>
            <AuctionNavigation
              isFirstAuction={isFirstAuction}
              isLastAuction={isLastAuction}
              onNextAuctionClick={onNextAuctionClick}
              onPrevAuctionClick={onPrevAuctionClick}
            />
            <AuctionActivityDateHeadline startTime={mintTimestamp} />
          </AuctionTitleAndNavWrapper>
          <div className="w-full">
            <AuctionActivityNounTitle nounId={nounId} />
          </div>
        </div>
        <div className={cn('mb-0', 'grid grid-cols-1 gap-4 lg:grid-cols-12')}>
          <div
            className={cn('lg-max:border-r-0 lg-max:pl-0 ml-1.5 mt-1.5 border-r', 'lg:col-span-4')}
          >
            <CurrentBid currentBid={BID_N_A} auctionEnded={true} />
          </div>
          <div
            className={cn(
              'lg-max:border-r-0 lg-max:ml-1.5 lg-max:mt-1.5 lg-max:pl-0 ml-1.5 mt-1.5 border-r pl-0',
              'lg:col-span-5',
            )}
          >
            <div>
              <Winner winner={'0x'} isNounders={true} />
            </div>
          </div>
        </div>
      </div>
      <div className={cn('mb-0', 'grid grid-cols-1')}>
        <div className="w-full">
          <ul className={cn('mt-4 grid list-none gap-y-2 p-0 text-left')}>
            <li
              className={cn(
                // Base row styles
                'font-pt transition-all duration-200 ease-in-out hover:brightness-105',
                'text-[15.5px] font-medium leading-[21px]',
                // Padding and border color vary by theme
                isCool
                  ? 'border-b border-[var(--brand-cool-border)] p-3'
                  : 'border-b border-[var(--brand-warm-border)] px-3 pb-2 pt-1',
              )}
            >
              <Trans>All Noun auction proceeds are sent to the</Trans>{' '}
              <Link
                to="/vote"
                className="text-brand-dark-green visited:text-brand-dark-green active:text-brand-dark-green hover:text-brand-dark-red underline"
              >
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
        </div>
      </div>
    </AuctionActivityWrapper>
  );
};
export default NounderNounContent;
