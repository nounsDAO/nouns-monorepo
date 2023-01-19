import config from '../config';

export const resolveN00unContractAddress = (address: string) => {
  switch (address.toLowerCase()) {
    case config.addresses.n00unsDAOProxy.toLowerCase():
      return 'N00uns DAO Proxy';
    case config.addresses.n00unsAuctionHouseProxy.toLowerCase():
      return 'N00uns Auction House Proxy';
    case config.addresses.n00unsDaoExecutor.toLowerCase():
      return 'N00uns DAO Treasury';
    default:
      return undefined;
  }
};
