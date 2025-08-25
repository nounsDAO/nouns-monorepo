import React from 'react';

import { Col, Container, Row } from 'react-bootstrap';

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
    <div className="w-full self-end md:mx-[10%] md:mt-8 md:w-4/5 lg:mx-[15%] lg:w-[70%]">
      <StandaloneNounWithSeed
        nounId={BigInt(currentAuction.nounId)}
        onLoadSeed={loadedNounHandler}
        shouldLinkToProfile={false}
      />
    </div>
  );

  const loadingNoun = (
    <div className="w-full self-end md:mx-[10%] md:mt-8 md:w-4/5 lg:mx-[15%] lg:w-[70%]">
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
      <Container fluid="xl">
        <Row>
          <Col lg={{ span: 6 }} className="flex md:p-0">
            {currentAuction ? nounContent : loadingNoun}
          </Col>
          <Col
            lg={{ span: 6 }}
            className="min-h-[558px] self-end pb-0 pr-20 md:mx-0 md:w-full md:px-0 md:pt-8 lg:w-full lg:bg-white lg:px-[5%] lg:pt-[5%]"
          >
            {currentAuction &&
              (isNounderNoun(BigInt(currentAuction.nounId))
                ? nounderNounContent
                : currentAuctionActivityContent)}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auction;
