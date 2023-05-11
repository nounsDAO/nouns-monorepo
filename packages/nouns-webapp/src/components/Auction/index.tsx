import React from 'react';
import { Col } from 'react-bootstrap';
import { StandaloneTokenWithSeed } from '../StandaloneToken';
import AuctionActivity from '../AuctionActivity';
import { Row, Container } from 'react-bootstrap';
// import { setStateBackgroundColor } from '../../state/slices/application';
import { LoadingPunk } from '../Punk';
import { Auction as IAuction } from '../../wrappers/nAuction';
import classes from './Auction.module.css';
import { ISeed } from '../../wrappers/nToken';
import PunkerTokenContent from '../PunkerTokenContent';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { isNounderNoun } from '../../utils/nounderNoun';
import {
  setNextOnDisplayAuctionTokenId,
  setPrevOnDisplayAuctionTokenId,
} from '../../state/slices/onDisplayAuction';
// import { beige, grey } from '../../utils/nounBgColors';

interface AuctionProps {
  auction?: IAuction;
}

const Auction: React.FC<AuctionProps> = props => {
  const { auction: currentAuction } = props;

  const history = useHistory();
  const dispatch = useAppDispatch();
  let stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const lastTokenId = useAppSelector(state => state.onDisplayAuction.lastAuctionTokenId);

  const loadedNounHandler = (seed: ISeed) => {
    // dispatch(setStateBackgroundColor(seed.background === 0 ? grey : beige));
  };

  const prevAuctionHandler = () => {
    dispatch(setPrevOnDisplayAuctionTokenId());
    currentAuction && history.push(`/punk/${currentAuction.tokenId.toNumber() - 1}`);
  };
  const nextAuctionHandler = () => {
    dispatch(setNextOnDisplayAuctionTokenId());
    currentAuction && history.push(`/punk/${currentAuction.tokenId.toNumber() + 1}`);
  };
  console.log(currentAuction);

  const nounContent = currentAuction && (
    <div className={classes.nounWrapper}>
      <StandaloneTokenWithSeed
        tokenId={currentAuction.tokenId}
        onLoadSeed={loadedNounHandler}
        shouldLinkToProfile={false}
      />
    </div>
  );

  const loadingPunk = <LoadingPunk />;

  console.log('CUR_AUCTION', currentAuction);

  const currentAuctionActivityContent = currentAuction && lastTokenId && (
    <AuctionActivity
      auction={currentAuction}
      isFirstAuction={currentAuction.tokenId.eq(0)}
      isLastAuction={currentAuction.tokenId.eq(lastTokenId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
      displayGraphDepComps={true}
    />
  );
  const nounderNounContent = currentAuction && lastTokenId && (
    <PunkerTokenContent
      mintTimestamp={currentAuction.startTime}
      tokenId={currentAuction.tokenId}
      isFirstAuction={currentAuction.tokenId.eq(0)}
      isLastAuction={currentAuction.tokenId.eq(lastTokenId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
    />
  );

  return (
    <div style={{ backgroundColor: stateBgColor }} className={classes.wrapper}>
      <Container fluid="xl">
        <Row>
          <Col lg={{ span: 6 }} className={classes.nounContentCol}>
            {currentAuction ? nounContent : loadingPunk}
          </Col>
          <Col lg={{ span: 6 }} className={classes.auctionActivityCol}>
            {currentAuction &&
              (isNounderNoun(currentAuction.tokenId)
                ? nounderNounContent
                : currentAuctionActivityContent)}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auction;
