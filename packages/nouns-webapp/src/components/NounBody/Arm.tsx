import { Col } from 'react-bootstrap';
import classes from './Arm.module.css';

const Arm = () => {
  return (
    <Col lg={2} className={classes.arm}>
      <h1>Stats:</h1>
      <ul>
        <li>100</li>
        <li>100</li>
        <li>100</li>
      </ul>
    </Col>
  );
};
export default Arm;
