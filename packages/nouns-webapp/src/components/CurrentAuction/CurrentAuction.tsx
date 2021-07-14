import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { useAuction } from '../../wrappers/nounsAuction';
import config from '../../config';
import StandaloneNoun from '../StandaloneNoun';
import AuctionActivity from './AuctionActivity';
import { Container } from 'react-bootstrap';
import classes from './CurrentAuction.module.css';

const CurrentAuction = () => {
  const auction = useAuction(config.auctionProxyAddress);

  return (
    <div className={classes.container}>
      <Container fluid="lg">
        <Row noGutters={true}>
          <Col lg={{ span: 5, offset: 1 }}>
            {auction && <StandaloneNoun nounId={auction && auction.nounId} />}
          </Col>
          <Col lg={{ span: 4, offset: 1 }}>
            <AuctionActivity auction={auction && auction} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CurrentAuction;
