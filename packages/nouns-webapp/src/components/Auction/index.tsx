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

const Auction: React.FC<{ auction: IAuction }> = props => {
  const { auction: currentAuction } = props;

  const [onDisplayNounId, setOnDisplayNounId] = useState(currentAuction && currentAuction.nounId);
  const [isLastAuction, setIsLastAuction] = useState(true);
  const [isFirstAuction, setIsFirstAuction] = useState(false);

  const { data } = useQuery(auctionQuery(onDisplayNounId && onDisplayNounId.toNumber()));
  const pastAuction: IAuction = data &&
    data.auction && {
      amount: data.auction.amount,
      bidder: '',
      endTime: data.auction.endTime,
      startTime: data.auction.startTime,
      length: 100,
      nounId: data.auction.id,
      settled: data.auction.settled,
    };

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
      {currentAuction && !isFirstAuction && (
        <button onClick={prevAuctionHandler} className={classes.leftArrow} />
      )}
      {!isLastAuction && <button onClick={nextAuctionHandler} className={classes.rightArrow} />}
      <StandaloneNoun nounId={onDisplayNounId} boxShadow={true} />
    </div>
  );

  const loadingNoun = (
    <div className={classes.nounWrapper}>
      <Noun imgPath="" alt="" />
    </div>
  );

  const auctionActivityContent = onDisplayNounId && currentAuction && pastAuction && (
    <AuctionActivity
      auction={isLastAuction ? currentAuction : pastAuction}
      isPastAuction={!isLastAuction}
    />
  );

  return (
    <Section bgColor="transparent" fullWidth={false}>
      <Col lg={{ span: 6 }}>{onDisplayNounId ? nounContent : loadingNoun}</Col>
      <Col lg={{ span: 6 }}>{auctionActivityContent}</Col>
    </Section>
  );
};

export default Auction;
