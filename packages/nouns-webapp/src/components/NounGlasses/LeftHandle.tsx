import classes from './LeftHandle.module.css';
import { Col } from 'react-bootstrap';
import React from 'react';

const LeftHandle = () => {
  return (
    <>
      <Col lg={1}>
        <div className={classes['left-bottom-handle']} />
      </Col>
      <Col lg={2}>
        <div className={classes['left-handle']} />
      </Col>
    </>
  );
};

export default LeftHandle;
