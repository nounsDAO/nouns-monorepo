import { Col } from 'react-bootstrap';
import { StandaloneNounWithSeed } from '../StandaloneNoun';
import AuctionActivity from '../AuctionActivity';
import { Row, Container } from 'react-bootstrap';
import { LoadingNoun } from '../Noun';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import classes from './Auction.module.css';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { INounSeed } from '../../wrappers/nounToken';
import NounderNounContent from '../NounderNounContent';
import { useHistory } from 'react-router-dom';

const isNounderNoun = (nounId: BigNumber) => {
  return nounId.mod(10).eq(0) || nounId.eq(0);
};

interface AuctionProps {
  auction: IAuction;
  bgColorHandler: (useGrey: boolean) => void;
}

const Auction: React.FC<AuctionProps> = props => {
  const { auction: currentAuction, bgColorHandler } = props;
  const history = useHistory();

  const [onDisplayNounId, setOnDisplayNounId] = useState(currentAuction && currentAuction.nounId);
  const [lastAuctionId, setLastAuctionId] = useState(currentAuction && currentAuction.nounId);
  const [isLastAuction, setIsLastAuction] = useState(true);
  const [isFirstAuction, setIsFirstAuction] = useState(false);

  const loadedNounHandler = (seed: INounSeed) => {
    bgColorHandler(seed.background === 0);
  };

  useEffect(() => {
    if (!onDisplayNounId || (currentAuction && currentAuction.nounId.gt(lastAuctionId))) {
      setOnDisplayNounId(currentAuction && currentAuction.nounId);
      setLastAuctionId(currentAuction && currentAuction.nounId);
    }
  }, [onDisplayNounId, currentAuction, lastAuctionId]);

  const auctionHandlerFactory = (nounIdMutator: (prev: BigNumber) => BigNumber) => () => {
    setOnDisplayNounId(prev => {
      const updatedNounId = nounIdMutator(prev);
      setIsFirstAuction(updatedNounId.eq(0) ? true : false);
      setIsLastAuction(updatedNounId.eq(currentAuction && currentAuction.nounId) ? true : false);
      history.push(`/noun/${updatedNounId}`);
      return updatedNounId;
    });
  };

  const prevAuctionHandler = auctionHandlerFactory((prev: BigNumber) => prev.sub(1));
  const nextAuctionHandler = auctionHandlerFactory((prev: BigNumber) => prev.add(1));

  const nounContent = (
    <div className={classes.nounWrapper}>
      <StandaloneNounWithSeed nounId={onDisplayNounId} onLoadSeed={loadedNounHandler} />
    </div>
  );

  const loadingNoun = (
    <div className={classes.nounWrapper}>
      <LoadingNoun />
    </div>
  );

  const currentAuctionActivityContent = (
    <AuctionActivity
      auction={currentAuction}
      isFirstAuction={isFirstAuction}
      isLastAuction={isLastAuction}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
      displayGraphDepComps={true}
    />
  );

  const nounderNounContent = (
    <NounderNounContent
      mintTimestamp={BigNumber.from(0)}
      nounId={onDisplayNounId}
      isFirstAuction={isFirstAuction}
      isLastAuction={isLastAuction}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
    />
  );

  return (
    <Container fluid="lg">
      <Row>
        <Col lg={{ span: 6 }} className={classes.nounContentCol}>
          {onDisplayNounId ? nounContent : loadingNoun}
        </Col>
        <Col lg={{ span: 6 }} className={classes.auctionActivityCol}>
          {onDisplayNounId && isNounderNoun(onDisplayNounId)
            ? nounderNounContent
            : currentAuctionActivityContent}
        </Col>
      </Row>
    </Container>
  );
};

export default Auction;
