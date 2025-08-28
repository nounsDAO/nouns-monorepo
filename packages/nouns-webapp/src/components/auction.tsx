import React from 'react';

import { useRouter } from 'next/navigation';

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

interface AuctionProps {
  auction?: IAuction;
}

const Auction: React.FC<AuctionProps> = props => {
  const { auction: currentAuction } = props;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const stateBgColor = useAppSelector((state: RootState) => state.application.stateBackgroundColor);
  const lastNounId = useAppSelector((state: RootState) => state.onDisplayAuction.lastAuctionNounId);

  const loadedNounHandler = (seed: INounSeed) => {
    dispatch(setStateBackgroundColor(seed.background === 0 ? grey : beige));
  };

  const prevAuctionHandler = () => {
    if (currentAuction) {
      router.push(nounPath(Number(currentAuction.nounId) - 1));
    }
  };
  const nextAuctionHandler = () => {
    if (currentAuction) {
      router.push(nounPath(Number(currentAuction.nounId) + 1));
    }
  };

  const nounContent = currentAuction && (
    <div
      className={[
        'w-full self-end',
        'max-lg:ml-[15%] max-lg:mr-[15%] max-lg:w-[70%]',
        'max-sm:ml-[10%] max-sm:mr-[10%] max-sm:mt-8 max-sm:w-[80%]',
      ].join(' ')}
    >
      <StandaloneNounWithSeed
        nounId={BigInt(currentAuction.nounId)}
        onLoadSeed={loadedNounHandler}
        shouldLinkToProfile={false}
      />
    </div>
  );

  const loadingNoun = (
    <div
      className={[
        'w-full self-end',
        'max-lg:ml-[15%] max-lg:mr-[15%] max-lg:w-[70%]',
        'max-sm:ml-[10%] max-sm:mr-[10%] max-sm:mt-8 max-sm:w-[80%]',
      ].join(' ')}
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
          <div className={['flex', 'max-sm:p-0'].join(' ')}>
            {currentAuction ? nounContent : loadingNoun}
          </div>
          <div
            className={[
              // .auctionActivityCol base
              'min-h-[558px] self-end pb-0 pr-20',
              // <= 992px formerly lg-max
              'max-lg:w-full max-lg:bg-white max-lg:pl-[5%] max-lg:pr-[5%] max-lg:pt-[5%]',
              // <= 568px overrides
              'max-sm:ml-0 max-sm:mr-0 max-sm:w-full max-sm:pl-0 max-sm:pr-0 max-sm:pt-8',
            ].join(' ')}
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
