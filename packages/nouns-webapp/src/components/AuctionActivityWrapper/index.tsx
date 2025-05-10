import React from 'react';

import classes from './AuctionActivityWrapper.module.css';

interface AuctionActivityWrapperProps {
  children: React.ReactNode;
}

const AuctionActivityWrapper: React.FC<AuctionActivityWrapperProps> = ({ children }) => {
  return <div className={classes.wrapper}>{children}</div>;
};
export default AuctionActivityWrapper;
