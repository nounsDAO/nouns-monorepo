import { Row,Col } from 'react-bootstrap';
import StandaloneNoun from '../StandaloneNoun';
import AuctionActivity from '../AuctionActivity';
import Section from '../../layout/Section';
import Noun from '../Noun';
import { Auction } from '../../wrappers/nounsAuction';

const CurrentAuction: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;

  return (
    <Section bgColor="transparent" fullWidth={false}>
      <Row className='align-items-center'>
      <Col lg={{ span: 6}}>
        {auction ? (
          <>
          <div style={{padding: "2rem"}}>
            <StandaloneNoun nounId={auction.nounId} />
          </div>
          </>
        ) : (
          <Noun imgPath="" alt="" />
        )}
      </Col>
      <Col lg={{span: 6}}>
        <AuctionActivity auction={auction && auction} />
      </Col>
      </Row>
    </Section>
  );
};

export default CurrentAuction;
