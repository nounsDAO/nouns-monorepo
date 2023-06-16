import config from '../config';

export const resolveN00unContractAddress = (address: string) => {
  switch (address.toLowerCase()) {
    case config.addresses.vrbsDAOProxy.toLowerCase():
      return 'N00uns DAO Proxy';
    case config.addresses.vrbsAuctionHouseProxy.toLowerCase():
      return 'N00uns Auction House Proxy';
    case config.addresses.vrbsDaoExecutor.toLowerCase():
      return 'N00uns DAO Treasury';
    default:
      return undefined;
  }
};
