import { Col } from 'react-bootstrap';
import { StandaloneNounWithSeed } from '../StandaloneNoun';
// import AuctionActivity from '../AuctionActivity';
import { Row, Container } from 'react-bootstrap';
import { setStateBackgroundColor } from '../../state/slices/application';
import { LoadingNoun } from '../Noun';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import classes from './Auction.module.css';
import { INounSeed } from '../../wrappers/nounToken';
// import NounderNounContent from '../NounderNounContent';
// import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
// import { isNounderNoun } from '../../utils/nounderNoun';
// import {
//   setNextOnDisplayAuctionNounId,
//   setPrevOnDisplayAuctionNounId,
// } from '../../state/slices/onDisplayAuction';
import { beige, grey } from '../../utils/nounBgColors';
import homeBg from '../../assets/Homebg.jpg';
import Image from 'react-bootstrap/Image';
import heroImage from '../../assets/bluntsLogo.png';
import { Trans } from '@lingui/macro';

interface AuctionProps {
  auction?: IAuction;
}

const Auction: React.FC<AuctionProps> = props => {
  const { auction: currentAuction } = props;

  // const history = useHistory();
  const dispatch = useAppDispatch();
  let stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  // const lastNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);

  const loadedNounHandler = (seed: INounSeed) => {
    dispatch(setStateBackgroundColor(seed.background === 0 ? grey : beige));
  };

  // const prevAuctionHandler = () => {
  //   dispatch(setPrevOnDisplayAuctionNounId());
  //   currentAuction && history.push(`/noun/${currentAuction.nounId.toNumber() - 1}`);
  // };
  // const nextAuctionHandler = () => {
  //   dispatch(setNextOnDisplayAuctionNounId());
  //   currentAuction && history.push(`/noun/${currentAuction.nounId.toNumber() + 1}`);
  // };

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
    <div>
      <LoadingNoun />
    </div>
  );

  // const currentAuctionActivityContent = currentAuction && lastNounId && (
  //   <AuctionActivity
  //     auction={currentAuction}
  //     isFirstAuction={currentAuction.nounId.eq(0)}
  //     isLastAuction={currentAuction.nounId.eq(lastNounId)}
  //     onPrevAuctionClick={prevAuctionHandler}
  //     onNextAuctionClick={nextAuctionHandler}
  //     displayGraphDepComps={true}
  //   />
  // );
  // const nounderNounContent = currentAuction && lastNounId && (
  //   <NounderNounContent
  //     mintTimestamp={currentAuction.startTime}
  //     nounId={currentAuction.nounId}
  //     isFirstAuction={currentAuction.nounId.eq(0)}
  //     isLastAuction={currentAuction.nounId.eq(lastNounId)}
  //     onPrevAuctionClick={prevAuctionHandler}
  //     onNextAuctionClick={nextAuctionHandler}
  //   />
  // );

  return (
    <div
      style={{
        backgroundImage: `url(${homeBg})`,
        minHeight: '800px',
        backgroundSize: 'cover', // Ensure the image covers the entire element
        backgroundPosition: 'center', // Center the image within the element
        width: '97%', // Set width to fill the parent container
      }}
      className={classes.wrapper}
    >
      <div className={classes.topHero}>
        <div className={classes.logo}>
          <Image src={heroImage} alt="Bg Hero" />
        </div>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.blunts.wtf/waitlist"
          style={{ textDecoration: 'none' }}
        >
          <div className={classes.soon}>
            <h1>
              <Trans>Join the waitlist</Trans>
            </h1>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Auction;
