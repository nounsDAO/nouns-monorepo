import { Col } from 'react-bootstrap';
import classes from './AuctionTitleAndNavWrapper.module.css';
import React from 'react';

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
