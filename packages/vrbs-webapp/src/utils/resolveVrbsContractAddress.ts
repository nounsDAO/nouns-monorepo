import config from '../config';

export const resolveVrbContractAddress = (address: string) => {
  switch (address.toLowerCase()) {
    case config.addresses.vrbsDAOProxy.toLowerCase():
      return 'Vrbs DAO Proxy';
    case config.addresses.vrbsAuctionHouseProxy.toLowerCase():
      return 'Vrbs Auction House Proxy';
    case config.addresses.vrbsDaoExecutor.toLowerCase():
      return 'Vrbs DAO Treasury';
    default:
      return undefined;
  }
};
