import React from 'react';

interface AuctionTitleAndNavWrapperProps {
  children: React.ReactNode;
}

const AuctionTitleAndNavWrapper: React.FC<AuctionTitleAndNavWrapperProps> = props => {
  return <div className="flex w-full items-center">{props.children}</div>;
};
export default AuctionTitleAndNavWrapper;
