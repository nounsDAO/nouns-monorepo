import { BigNumber } from '@ethersproject/bignumber';
import { Row, Col } from 'react-bootstrap';
import Noun from '../Shared/Noun';
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

const PastNoun: React.FC<{ imgPath: string }> = props => {
  return (
    <Col lg={3} className={classes.col}>
      <div className={classes.pastNoun}>
        <Noun imgPath={props.imgPath} />
        <span className={classes.rightSubtitle}>#140</span>
      </div>
    </Col>
  );
};
