import classes from './CenterHandle.module.css';
import { Col } from 'react-bootstrap';

const CenterHandle = () => {
  return (
    <Col lg={1}>
      <div className={classes['center-handle']} />
    </Col>
  );
};
export default CenterHandle;
