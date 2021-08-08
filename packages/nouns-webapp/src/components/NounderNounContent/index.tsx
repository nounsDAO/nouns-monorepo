import { Col, Row } from 'react-bootstrap';
import { BigNumber } from 'ethers';
import AuctionActivityWrapper from '../AuctionActivityWrapper';
import AuctionNavigation from '../AuctionNavigation';
import AuctionActivityNounTitle from '../AuctionActivityNounTitle';
import AuctionActivityDateHeadline from '../AuctionActivityDateHeadline';
import classes from './NounderNounContent.module.css';

const NounderNounContent: React.FC<{
  mintTimestamp: BigNumber;
  nounId: BigNumber;
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
}> = props => {
  const {
    mintTimestamp,
    nounId,
    isFirstAuction,
    isLastAuction,
    onPrevAuctionClick,
    onNextAuctionClick,
  } = props;

  return (
    <AuctionActivityWrapper>
      <Row>
        <Col lg={12}>
          <AuctionActivityDateHeadline startTime={mintTimestamp} />
        </Col>
        <Col lg={12} className={classes.colAlignCenter}>
          <AuctionActivityNounTitle nounId={nounId} />
          <AuctionNavigation
            isFirstAuction={isFirstAuction}
            isLastAuction={isLastAuction}
            onNextAuctionClick={onNextAuctionClick}
            onPrevAuctionClick={onPrevAuctionClick}
          />
        </Col>
        <Col lg={12}>
          <p className={classes.content}>
            This Noun was not auctioned. Every 10th Noun for 5 years is sent to the "Nounders DAO", the project founders' multi-signature wallet.
            {/*<br/><br/>*/}
            {/*This is {nounId.toNumber() / 10 + 1} of 183 Nouns to be sent.*/}
            <br/><br/>
            All proceeds from Noun auctions are sent to the Nouns DAO treasury.<br />

          </p>
        </Col>
      </Row>
    </AuctionActivityWrapper>
  );
};
export default NounderNounContent;
