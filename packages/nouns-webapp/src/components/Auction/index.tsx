import { Col } from 'react-bootstrap';
import { StandaloneNounWithSeed } from '../StandaloneNoun';
import AuctionActivity from '../AuctionActivity';
import { Row, Container } from 'react-bootstrap';
import { setStateBackgroundColor } from '../../state/slices/application';
import { LoadingNoun } from '../Noun';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import classes from './Auction.module.css';
import { INounSeed } from '../../wrappers/nounToken';
import NounderNounContent from '../NounderNounContent';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { isNounderNoun } from '../../utils/nounderNoun';
import {
  setNextOnDisplayAuctionNounId,
  setPrevOnDisplayAuctionNounId,
} from '../../state/slices/onDisplayAuction';
import { beige, grey } from '../../utils/nounBgColors';

interface AuctionProps {
  auction?: IAuction;
}

const Auction: React.FC<AuctionProps> = props => {
  const { auction: currentAuction } = props;

  const history = useHistory();
  const dispatch = useAppDispatch();
  const lastNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);

  const loadedNounHandler = (seed: INounSeed) => {
    dispatch(setStateBackgroundColor(seed.background === 0 ? grey : beige));
  };

  const prevAuctionHandler = () => {
    dispatch(setPrevOnDisplayAuctionNounId());
    currentAuction && history.push(`/noun/${currentAuction.nounId.toNumber() - 1}`);
  };
  const nextAuctionHandler = () => {
    dispatch(setNextOnDisplayAuctionNounId());
    currentAuction && history.push(`/noun/${currentAuction.nounId.toNumber() + 1}`);
  };

  const nounContent = currentAuction && (
    <div className={classes.nounWrapper}>
      <StandaloneNounWithSeed
        nounId={currentAuction.nounId}
        onLoadSeed={loadedNounHandler}
        shouldLinkToProfile={false}
      />
    </div>
  );

  const loadingNoun = (
    <div className={classes.nounWrapper}>
      <LoadingNoun />
    </div>
  );

  const currentAuctionActivityContent = currentAuction && lastNounId && (
    <AuctionActivity
      auction={currentAuction}
      isFirstAuction={currentAuction.nounId.eq(0)}
      isLastAuction={currentAuction.nounId.eq(lastNounId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
      displayGraphDepComps={true}
    />
  );
  const nounderNounContent = currentAuction && lastNounId && (
    <NounderNounContent
      mintTimestamp={currentAuction.startTime}
      nounId={currentAuction.nounId}
      isFirstAuction={currentAuction.nounId.eq(0)}
      isLastAuction={currentAuction.nounId.eq(lastNounId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
    />
  );

  return (
    <div
      style={{
        backgroundColor: '#adebff',
        position: 'relative',
        zIndex: 1
      }}
      className={classes.wrapper}
    >
      <style>
        {`
          @keyframes float {
            0% { transform: translateX(0); }
            100% { transform: translateX(100vw); }
          }
        `}
      </style>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        {[...Array(15)].map((_, index) => {
          const pixelSize = 16;
          const cloudShapes = [
            [[0, 1, 1, 0],
            [1, 1, 1, 1],
            [0, 1, 1, 0]],
            [[0, 1, 1, 1, 0],
            [1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0]],
            [[0, 0, 1, 1, 0],
            [0, 1, 1, 1, 1],
            [1, 1, 1, 1, 0]],
            [[0, 1, 1, 0, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1],
            [0, 0, 1, 1, 0]],
            [[0, 0, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 0, 0]]
          ];
          const cloudShape = cloudShapes[index % cloudShapes.length];
          const cloudWidth = cloudShape[0].length;
          const cloudHeight = cloudShape.length;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                width: `${cloudWidth * pixelSize}px`,
                height: `${cloudHeight * pixelSize}px`,
                top: `${15 + (index * 15)}%`,
                left: `-${cloudWidth * pixelSize}px`,
                animation: `float ${60 + Math.random() * 40}s linear infinite`,
                animationDelay: `${-Math.random() * 60}s`,
              }}
            >
              {cloudShape.flatMap((row, y) =>
                row.map((pixel, x) =>
                  pixel ? (
                    <div
                      key={`${x}-${y}`}
                      style={{
                        position: 'absolute',
                        width: `${pixelSize}px`,
                        height: `${pixelSize}px`,
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        left: `${x * pixelSize}px`,
                        top: `${y * pixelSize}px`,
                      }}
                    />
                  ) : null
                )
              )}
            </div>
          );
        })}
      </div>
      <Container fluid="xl" style={{ position: 'relative', zIndex: 2 }}>
        <Row>
          <Col lg={{ span: 6 }} className={classes.nounContentCol}>
            {currentAuction ? nounContent : loadingNoun}
          </Col>
          <Col lg={{ span: 6 }} className={classes.auctionActivityCol}>
            {currentAuction &&
              (isNounderNoun(currentAuction.nounId)
                ? nounderNounContent
                : currentAuctionActivityContent)}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auction;
