import React from 'react';

import { cn } from '@/lib/utils';

import classes from './auction-title-and-nav-wrapper.module.css';

interface AuctionTitleAndNavWrapperProps {
  children: React.ReactNode;
}

const AuctionTitleAndNavWrapper: React.FC<AuctionTitleAndNavWrapperProps> = props => {
  return <div className={cn(`w-full`, classes.auctionTitleAndNavContainer)}>{props.children}</div>;
};
export default AuctionTitleAndNavWrapper;
