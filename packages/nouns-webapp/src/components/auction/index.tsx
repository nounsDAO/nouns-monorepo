import React from 'react';

import AuctionActivity from '@/components/auction-activity';
import { LoadingNoun } from '@/components/legacy-noun';
import NounderNounContent from '@/components/nounder-noun-content';
import { StandaloneNounWithSeed } from '@/components/standalone-noun';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setStateBackgroundColor } from '@/state/slices/application';
import { RootState } from '@/store';
import { nounPath } from '@/utils/history';
import { beige, grey } from '@/utils/noun-bg-colors';
import { isNounderNoun } from '@/utils/nounder-noun';
import { INounSeed } from '@/wrappers/noun-token';
import { Auction as IAuction } from '@/wrappers/nouns-auction';
import { useNavigate } from 'react-router';

// Inlined former CSS module styles with Tailwind

interface AuctionProps {
  auction?: IAuction;
}

const Auction: React.FC<AuctionProps> = props => {
  const { auction: currentAuction } = props;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const stateBgColor = useAppSelector((state: RootState) => state.application.stateBackgroundColor);
  const lastNounId = useAppSelector((state: RootState) => state.onDisplayAuction.lastAuctionNounId);

  const loadedNounHandler = (seed: INounSeed) => {
    dispatch(setStateBackgroundColor(seed.background === 0 ? grey : beige));
  };

  const prevAuctionHandler = () => {
    if (currentAuction) {
      navigate(nounPath(Number(currentAuction.nounId) - 1));
    }
  };
  const nextAuctionHandler = () => {
    if (currentAuction) {
      navigate(nounPath(Number(currentAuction.nounId) + 1));
    }
  };

  const nounContent = currentAuction && (
    <div className={
      [
        // .nounWrapper base
        'w-full self-end',
        // <= 992px formerly lg-max
        'lg-max:ml-[15%] lg-max:mr-[15%] lg-max:w-[70%]',
        // <= 568px overrides
        'max-[568px]:ml-[10%] max-[568px]:mr-[10%] max-[568px]:mt-8 max-[568px]:w-[80%]',
      ].join(' ')
    }>
      <StandaloneNounWithSeed
        nounId={BigInt(currentAuction.nounId)}
        onLoadSeed={loadedNounHandler}
        shouldLinkToProfile={false}
      />
    </div>
  );

  const loadingNoun = (
    <div
      className={
        [
          'w-full self-end',
          'lg-max:ml-[15%] lg-max:mr-[15%] lg-max:w-[70%]',
          'max-[568px]:ml-[10%] max-[568px]:mr-[10%] max-[568px]:mt-8 max-[568px]:w-[80%]',
        ].join(' ')
      }
    >
      <LoadingNoun />
    </div>
  );

  const currentAuctionActivityContent = currentAuction && lastNounId != null && (
    <AuctionActivity
      auction={currentAuction}
      isFirstAuction={currentAuction.nounId === 0n}
      isLastAuction={currentAuction.nounId === BigInt(lastNounId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
      displayGraphDepComps={true}
    />
  );
  const nounderNounContent = currentAuction && lastNounId != null && (
    <NounderNounContent
      mintTimestamp={BigInt(currentAuction.startTime)}
      nounId={BigInt(currentAuction.nounId)}
      isFirstAuction={currentAuction.nounId === 0n}
      isLastAuction={currentAuction.nounId === BigInt(lastNounId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
    />
  );

  return (
    <div style={{ backgroundColor: stateBgColor }}>
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={["flex", 'max-[568px]:p-0'].join(' ')}>
            {currentAuction ? nounContent : loadingNoun}
          </div>
          <div
            className={
              [
                // .auctionActivityCol base
                'min-h-[558px] self-end pb-0 pr-20',
                // <= 992px formerly lg-max
                'lg-max:w-full lg-max:bg-white lg-max:pl-[5%] lg-max:pr-[5%] lg-max:pt-[5%]',
                // <= 568px overrides
                'max-[568px]:ml-0 max-[568px]:mr-0 max-[568px]:w-full max-[568px]:pl-0 max-[568px]:pr-0 max-[568px]:pt-8',
              ].join(' ')
            }
          >
            {currentAuction &&
              (isNounderNoun(BigInt(currentAuction.nounId))
                ? nounderNounContent
                : currentAuctionActivityContent)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;
