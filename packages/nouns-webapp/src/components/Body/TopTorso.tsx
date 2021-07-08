import { Row, Col } from 'react-bootstrap';
import nounImg from '../../assets/noun.png';
import Noun from '../Shared/Noun';
import classes from './TopTorso.module.css';

const TopTorso = () => {
  // state management here
  const nounImgs = [nounImg, nounImg, nounImg, nounImg];

  return (
    <Col lg={12} className={classes.topTorso}>
      <Row noGutters={true}>
        {nounImgs.map(img => (
          <PastNoun imgPath={img} key={Math.random()} />
        ))}
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
