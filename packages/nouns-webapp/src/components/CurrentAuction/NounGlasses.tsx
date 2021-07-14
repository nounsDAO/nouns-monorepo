import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { useAuction } from '../../wrappers/nounsAuction';
import config from '../../config';
import StandaloneNoun from '../StandaloneNoun';

import ActivityLens from './ActivityLens';
const NounGlasses = () => {
  const auction = useAuction(config.auctionProxyAddress);

  return (
    <Row noGutters={true}>
      <Col lg={{ span: 4, offset: 2 }}>
        {auction && <StandaloneNoun nounId={auction && auction.nounId} />}
      </Col>
      <ActivityLens auction={auction && auction} />
    </Row>
  );
};

export default NounGlasses;
