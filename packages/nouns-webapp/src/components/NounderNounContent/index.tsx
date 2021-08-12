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
            This Noun was not auctioned. Every 10th Noun for the first 5 years of the project is sent to the "Nounders DAO", the project founders' multi-signature wallet.
            <br/><br/>
            All proceeds from Noun auctions are sent to the Nouns DAO treasury.
          </p>
        </Col>
      </Row>
    </AuctionActivityWrapper>
  );
};
export default NounderNounContent;
