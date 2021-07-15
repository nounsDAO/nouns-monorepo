import { Col } from 'react-bootstrap';
import { useAuction } from '../../wrappers/nounsAuction';
import config from '../../config';
import StandaloneNoun from '../StandaloneNoun';
import AuctionActivity from './AuctionActivity';
import Section from '../Section';
import Noun from '../Shared/Noun';

const CurrentAuction = () => {
  const auction = useAuction(config.auctionProxyAddress);

  return (
    <Section bgColor="#c5ecf8" fullWidth={false}>
      <Col lg={{ span: 5, offset: 1 }}>
        {auction ? <StandaloneNoun nounId={auction.nounId} /> : <Noun imgPath="" alt="" />}
      </Col>
      <Col lg={{ span: 4, offset: 1 }}>
        <AuctionActivity auction={auction && auction} />
      </Col>
    </Section>
  );
};

export default CurrentAuction;
