import { Col } from 'react-bootstrap';
import { StandaloneNounBRWithSeed } from '../StandaloneNounBR';
import AuctionActivity from '../AuctionActivity';
import { Row, Container } from 'react-bootstrap';
import { setStateBackgroundColor } from '../../state/slices/application';
import { LoadingNounBR } from '../NounBR';
import { Auction as IAuction } from '../../wrappers/nounsbrAuction';
import classes from './Auction.module.css';
import { INounBRSeed } from '../../wrappers/nounbrToken';
import NounderBRBRNounBRContent from '../NounderBRBRNounBRContent';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { isNounderBRBRNounBR } from '../../utils/nounderbrNounBR';
import {
  setNextOnDisplayAuctionNounBRId,
  setPrevOnDisplayAuctionNounBRId,
} from '../../state/slices/onDisplayAuction';
import { beige, grey } from '../../utils/nounbrBgColors';

interface AuctionProps {
  auction?: IAuction;
}

const Auction: React.FC<AuctionProps> = props => {
  const { auction: currentAuction } = props;

  const history = useHistory();
  const dispatch = useAppDispatch();
  let stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const lastNounBRId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounBRId);

  const loadedNounBRHandler = (seed: INounBRSeed) => {
    dispatch(setStateBackgroundColor(seed.background === 0 ? grey : beige));
  };

  const prevAuctionHandler = () => {
    dispatch(setPrevOnDisplayAuctionNounBRId());
    currentAuction && history.push(`/nounbr/${currentAuction.nounbrId.toNumber() - 1}`);
  };
  const nextAuctionHandler = () => {
    dispatch(setNextOnDisplayAuctionNounBRId());
    currentAuction && history.push(`/nounbr/${currentAuction.nounbrId.toNumber() + 1}`);
  };

  const nounbrContent = currentAuction && (
    <div className={classes.nounbrWrapper}>
      <StandaloneNounBRWithSeed
        nounbrId={currentAuction.nounbrId}
        onLoadSeed={loadedNounBRHandler}
        shouldLinkToProfile={false}
      />
    </div>
  );

  const loadingNounBR = (
    <div className={classes.nounbrWrapper}>
      <LoadingNounBR />
    </div>
  );

  const currentAuctionActivityContent = currentAuction && lastNounBRId && (
    <AuctionActivity
      auction={currentAuction}
      isFirstAuction={currentAuction.nounbrId.eq(0)}
      isLastAuction={currentAuction.nounbrId.eq(lastNounBRId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
      displayGraphDepComps={true}
    />
  );
  const nounderbrNounBRContent = currentAuction && lastNounBRId && (
    <NounderBRBRNounBRContent
      mintTimestamp={currentAuction.startTime}
      nounbrId={currentAuction.nounbrId}
      isFirstAuction={currentAuction.nounbrId.eq(0)}
      isLastAuction={currentAuction.nounbrId.eq(lastNounBRId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
    />
  );

  return (
    <div style={{ backgroundColor: stateBgColor }} className={classes.wrapper}>
      <Container fluid="xl">
        <Row>
          <Col lg={{ span: 6 }} className={classes.nounbrContentCol}>
            {currentAuction ? nounbrContent : loadingNounBR}
          </Col>
          <Col lg={{ span: 6 }} className={classes.auctionActivityCol}>
            {currentAuction &&
              (isNounderBRBRNounBR(currentAuction.nounbrId)
                ? nounderbrNounBRContent
                : currentAuctionActivityContent)}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auction;
