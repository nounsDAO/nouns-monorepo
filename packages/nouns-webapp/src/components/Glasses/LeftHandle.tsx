import classes from './LeftHandle.module.css';
import { Col } from 'react-bootstrap';

const LeftHandle = () => {
  return (
    <>
      <Col lg={1}>
        <div className={classes['left-bottom-handle']} />
      </Col>
      <Col lg={2}>
        <div className={classes['left-handle']}>
          <div className={classes['noun-id-container']}>
            <h1>#121</h1>
          </div>
        </div>
      </Col>
    </>
  );
};

export default LeftHandle;
