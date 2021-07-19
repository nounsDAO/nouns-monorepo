import { Col } from 'react-bootstrap';
import StandaloneNoun from '../StandaloneNoun';
import AuctionActivity from './AuctionActivity';
import Section from '../Section';
import Noun from '../Shared/Noun';
import { Auction } from '../../wrappers/nounsAuction';

const CurrentAuction: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;

  return (
    <Section bgColor="transparent" fullWidth={false}>
      <Col lg={{ span: 5, offset: 1 }}>
        {auction ? (
          <>
            <StandaloneNoun nounId={auction.nounId} />
          </>
        ) : (
          <Noun imgPath="" alt="" />
        )}
      </Col>
      <Col lg={6}>
        <AuctionActivity auction={auction && auction} />
      </Col>
    </Section>
  );
};

export default CurrentAuction;
