import { Row, Col } from 'react-bootstrap';
import StandaloneNoun from '../StandaloneNoun';
import AuctionActivity from '../AuctionActivity';
import Section from '../../layout/Section';
import Noun from '../Noun';
import { Auction } from '../../wrappers/nounsAuction';

const CurrentAuction: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;

  return (
    <Section bgColor="transparent" fullWidth={false}>
      <Col lg={{ span: 6 }}>
        {auction ? (
          <>
            <div style={{ margin: '3rem', boxShadow: 'rgb(0 0 0 / 28%) -12px 12px 0px' }}>
              <StandaloneNoun nounId={auction.nounId} />
            </div>
          </>
        ) : (
          <Noun imgPath="" alt="" />
        )}
      </Col>
      <Col lg={{ span: 6 }}>
        <AuctionActivity auction={auction && auction} />
      </Col>
    </Section>
  );
};

export default CurrentAuction;
