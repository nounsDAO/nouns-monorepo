import { Col } from 'react-bootstrap';
import StandaloneNoun from '../StandaloneNoun';
import AuctionActivity from '../AuctionActivity';
import Section from '../../layout/Section';
import Noun from '../Noun';
import { Auction as CurrentAuction } from '../../wrappers/nounsAuction';
import classes from './Auction.module.css';

const Auction: React.FC<{ auction: CurrentAuction }> = props => {
  const { auction } = props;

  return (
    <Section bgColor="transparent" fullWidth={false}>
      <Col lg={{ span: 6 }}>
        {auction ? (
          <div className={classes.nounWrapper}>
            <StandaloneNoun nounId={auction.nounId} boxShadow={true} />
          </div>
        ) : (
          <div className={classes.nounWrapper}>
            <Noun imgPath="" alt="" />
          </div>
        )}
      </Col>
      <Col lg={{ span: 6 }}>
        <AuctionActivity auction={auction && auction} />
      </Col>
    </Section>
  );
};

export default Auction;
