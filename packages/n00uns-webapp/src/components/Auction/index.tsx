import { Col } from 'react-bootstrap';
import { StandaloneN00unWithSeed } from '../StandaloneN00un';
import AuctionActivity from '../AuctionActivity';
import { Row, Container } from 'react-bootstrap';
import { setStateBackgroundColor } from '../../state/slices/application';
import { LoadingN00un } from '../N00un';
import { Auction as IAuction } from '../../wrappers/n00unsAuction';
import classes from './Auction.module.css';
import { IN00unSeed } from '../../wrappers/n00unToken';
import N00underN00unContent from '../N00underN00unContent';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { isN00underN00un } from '../../utils/n00underN00un';
import {
  setNextOnDisplayAuctionN00unId,
  setPrevOnDisplayAuctionN00unId,
} from '../../state/slices/onDisplayAuction';
import { beige, grey } from '../../utils/n00unBgColors';
import pixel_border from '../../assets/pixel_border.svg';

interface AuctionProps {
  auction?: IAuction;
}

const Auction: React.FC<AuctionProps> = props => {
  const { auction: currentAuction } = props;

  const history = useHistory();
  const dispatch = useAppDispatch();
  let stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const lastN00unId = useAppSelector(state => state.onDisplayAuction.lastAuctionN00unId);

  const loadedN00unHandler = (seed: IN00unSeed) => {
    dispatch(setStateBackgroundColor(seed.background === 0 ? grey : beige));
  };

  const prevAuctionHandler = () => {
    dispatch(setPrevOnDisplayAuctionN00unId());
    currentAuction && history.push(`/n00un/${currentAuction.n00unId.toNumber() - 1}`);
  };
  const nextAuctionHandler = () => {
    dispatch(setNextOnDisplayAuctionN00unId());
    currentAuction && history.push(`/n00un/${currentAuction.n00unId.toNumber() + 1}`);
  };

  const n00unContent = currentAuction && (
    <div className={classes.n00unWrapper}>
      <StandaloneN00unWithSeed
        n00unId={currentAuction.n00unId}
        onLoadSeed={loadedN00unHandler}
        shouldLinkToProfile={false}
      />
    </div>
  );

  const loadingN00un = (
    <div className={classes.n00unWrapper}>
      <LoadingN00un />
    </div>
  );

  const currentAuctionActivityContent = currentAuction && lastN00unId && (
    <AuctionActivity
      auction={currentAuction}
      isFirstAuction={currentAuction.n00unId.eq(0)}
      isLastAuction={currentAuction.n00unId.eq(lastN00unId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
      displayGraphDepComps={true}
    />
  );
  const n00underN00unContent = currentAuction && lastN00unId && (
    <N00underN00unContent
      mintTimestamp={currentAuction.startTime}
      n00unId={currentAuction.n00unId}
      isFirstAuction={currentAuction.n00unId.eq(0)}
      isLastAuction={currentAuction.n00unId.eq(lastN00unId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
    />
  );

  return (
    <div style={{ backgroundColor: stateBgColor }} className={classes.wrapper}>
      <Container fluid="xl">
        <Row>
          <Col lg={{ span: 6 }} className={classes.n00unContentCol}>
            {currentAuction ? n00unContent : loadingN00un}
          </Col>
          <Col lg={{ span: 6 }} className={classes.auctionActivityCol}>
            {currentAuction &&
              (isN00underN00un(currentAuction.n00unId)
                ? n00underN00unContent
                : currentAuctionActivityContent)}
          </Col>
        </Row>
      </Container>
      <img src={pixel_border} className={classes.auctionBorder}alt="border" />
    </div>
  );
};

export default Auction;
