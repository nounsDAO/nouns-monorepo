import { Col, Row } from 'react-bootstrap';
import { BigNumber } from 'ethers';
import AuctionActivityWrapper from '../AuctionActivityWrapper';
import AuctionNavigation from '../AuctionNavigation';
import AuctionActivityNounTitle from '../AuctionActivityNounTitle';
import classes from './NounderNounContent.module.css';

const NounderNounContent: React.FC<{
  nounId: BigNumber;
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
}> = props => {
  const { nounId, isFirstAuction, isLastAuction, onPrevAuctionClick, onNextAuctionClick } = props;

  return (
    <AuctionActivityWrapper>
      <Row>
        <Col lg={12}>
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
            Because 100% of noun auction proceeds are sent to Nouns DAO, Nounders have chosen to
            compensate themselves with nouns. Every 10th noun for the first 5 years of the project
            (noun ids #0, #10, #20, #30 and so on) will be automatically sent to the Nounder's
            multisig to be vested and shared among the founding members of the project.
          </p>
        </Col>
      </Row>
    </AuctionActivityWrapper>
  );
};
export default NounderNounContent;
