import { Col } from 'react-bootstrap';
import StandaloneNoun from '../StandaloneNoun';
import AuctionActivity from '../AuctionActivity';
import Section from '../../layout/Section';
import Noun from '../Noun';
import { Auction as IAuction } from '../../wrappers/nounsAuction';
import classes from './Auction.module.css';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { auctionQuery } from '../../wrappers/subgraph';
import { BigNumber } from 'ethers';
import NounderNounContent from '../NounderNounContent';

const isNounderNoun = (nounId: BigNumber) => {
  return nounId.mod(10).eq(0);
};

const createAuctionObj = (data: any): IAuction => {
  const auction: IAuction = {
    amount: data.auction.amount,
    bidder: '',
    endTime: data.auction.endTime,
    startTime: data.auction.startTime,
    length: data.auction.endTime - data.auction.startTime,
    nounId: data.auction.id,
    settled: data.auction.settled,
  };
  return auction;
};

const Auction: React.FC<{ auction: IAuction }> = props => {
  const { auction: currentAuction } = props;

  const [onDisplayNounId, setOnDisplayNounId] = useState(currentAuction && currentAuction.nounId);
  const [isLastAuction, setIsLastAuction] = useState(true);
  const [isFirstAuction, setIsFirstAuction] = useState(false);

  const { loading: loadingCurrent, data: dataCurrent } = useQuery(
    auctionQuery(onDisplayNounId && onDisplayNounId.toNumber()),
  );
  const { data: dataNext } = useQuery(
    auctionQuery(onDisplayNounId && onDisplayNounId.add(1).toNumber()),
  );
  // Query prev auction to cache and allow for a smoother browsing ux
  useQuery(auctionQuery(onDisplayNounId && onDisplayNounId.sub(1).toNumber()));

  /**
   * Auction derived from `onDisplayNounId` query
   */
  const auction: IAuction = dataCurrent && dataCurrent.auction && createAuctionObj(dataCurrent);
  /**
   * Auction derived from `onDisplayNounId.add(1)` query
   */
  const nextAuction: IAuction = dataNext && dataNext.auction && createAuctionObj(dataNext);

  useEffect(() => {
    if (!onDisplayNounId) {
      setOnDisplayNounId(currentAuction && currentAuction.nounId);
    }
  }, [onDisplayNounId, currentAuction]);

  const prevAuctionHandler = () => {
    setOnDisplayNounId(prev => {
      const updatedNounId = prev.sub(1);
      if (updatedNounId.eq(0)) {
        setIsFirstAuction(true);
        return updatedNounId;
      } else {
        setIsLastAuction(false);
        return updatedNounId;
      }
    });
  };

  const nextAuctionHandler = () => {
    setOnDisplayNounId(prev => {
      const updatedNounId = prev.add(1);
      if (updatedNounId.eq(currentAuction && currentAuction.nounId)) {
        setIsLastAuction(true);
        return updatedNounId;
      } else {
        setIsFirstAuction(false);
        return updatedNounId;
      }
    });
  };

  const nounContent = (
    <div className={classes.nounWrapper}>
      <StandaloneNoun nounId={onDisplayNounId} boxShadow={true} />
    </div>
  );

  const loadingNoun = (
    <div className={classes.nounWrapper}>
      <Noun imgPath="" alt="" />
    </div>
  );

  const auctionActivityContent = onDisplayNounId && currentAuction && auction && (
    <AuctionActivity
      auction={!loadingCurrent && isLastAuction ? currentAuction : auction}
      isFirstAuction={isFirstAuction}
      isLastAuction={isLastAuction}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
    />
  );

  const nounderNounContent = (
    <NounderNounContent
      nounId={onDisplayNounId}
      isFirstAuction={isFirstAuction}
      isLastAuction={isLastAuction}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
    />
  );

  return (
    <Section bgColor="transparent" fullWidth={false}>
      <Col lg={{ span: 6 }}>{!loadingCurrent && onDisplayNounId ? nounContent : loadingNoun}</Col>
      <Col lg={{ span: 6 }} className={classes.auctionActivityCol}>
        {onDisplayNounId && isNounderNoun(onDisplayNounId)
          ? nounderNounContent
          : auctionActivityContent}
      </Col>
    </Section>
  );
};

export default Auction;
