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
            100% of noun auction proceeds belong to NounsDAO. For this reason, the project's
            founders (‘Nounders’) are compensated with nouns. <br />
            <br />
            Every 10th noun for the first 5 years of the project will be sent to the Nounders. This
            is noun {nounId.toNumber() / 10 + 1} of 183.
          </p>
        </Col>
      </Row>
    </AuctionActivityWrapper>
  );
};
export default NounderNounContent;
