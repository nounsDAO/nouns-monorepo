import { Row, Col } from 'react-bootstrap';
import TopTorso from './TopTorso';
import Arm from './Arm';
import Torso from './Torso';
import classes from './NounBody.module.css';

const NounBody = () => {
  return (
    <Row noGutters={true} className={classes.body}>
      <Col lg={{ span: 11, offset: 1 }}>
        <Row>
          <TopTorso />
          <Arm />
          <Torso />
        </Row>
      </Col>
    </Row>
  );
};
export default NounBody;
