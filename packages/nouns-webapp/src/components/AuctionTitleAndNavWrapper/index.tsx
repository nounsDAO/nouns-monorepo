import React from 'react';

import { Col } from 'react-bootstrap';

import classes from './AuctionTitleAndNavWrapper.module.css';

interface AuctionTitleAndNavWrapperProps {
  children: React.ReactNode;
}

const AuctionTitleAndNavWrapper: React.FC<AuctionTitleAndNavWrapperProps> = props => {
  return (
    <Col lg={12} className={classes.auctionTitleAndNavContainer}>
      {props.children}
    </Col>
  );
};
export default AuctionTitleAndNavWrapper;
