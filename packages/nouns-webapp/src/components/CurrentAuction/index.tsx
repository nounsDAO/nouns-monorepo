import { Col } from 'react-bootstrap';
import StandaloneNoun from '../StandaloneNoun';
import AuctionActivity from '../AuctionActivity';
import Section from '../../layout/Section';
import Noun from '../Noun';
import { Auction } from '../../wrappers/nounsAuction';
import classes from './CurrentAuction.module.css';

const CurrentAuction: React.FC<{ auction: Auction }> = props => {
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

export default CurrentAuction;
