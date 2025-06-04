import React from 'react';

interface AuctionActivityWrapperProps {
  children: React.ReactNode;
}

const AuctionActivityWrapper: React.FC<AuctionActivityWrapperProps> = ({ children }) => {
  return <div className="max-lg:mx-4">{children}</div>;
};
export default AuctionActivityWrapper;
