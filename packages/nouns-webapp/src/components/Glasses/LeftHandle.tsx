import classes from './LeftHandle.module.css';
import { Col } from 'react-bootstrap';
import React from 'react';

const LeftHandle: React.FC<{ nounId: string }> = props => {
  return (
    <>
      <Col lg={1}>
        <div className={classes['left-bottom-handle']} />
      </Col>
      <Col lg={2}>
        <div className={classes['left-handle']}>
          <div className={classes['noun-id-container']}>
            <h1>{`#${props.nounId}`}</h1>
          </div>
        </div>
      </Col>
    </>
  );
};

export default LeftHandle;
