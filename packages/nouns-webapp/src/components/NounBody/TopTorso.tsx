import { BigNumber } from '@ethersproject/bignumber';
import { Row, Col } from 'react-bootstrap';
import classes from './TopTorso.module.css';
import HistoryCollection from '../HistoryCollection';
import { useAuction } from '../../wrappers/nounsAuction';
import config from '../../config';

const TopTorso = () => {
  const auction = useAuction(config.auctionProxyAddress);

  return (
    <Col lg={12} className={classes.topTorso}>
      <Row noGutters={true}>
        {auction && (
          <HistoryCollection
            latestNounId={BigNumber.from(auction.nounId).sub(1)}
            historyCount={8}
            rtl={true}
          />
        )}
      </Row>
    </Col>
  );
};
export default TopTorso;
