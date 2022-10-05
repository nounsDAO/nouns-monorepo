import config from '../config';

export const resolveNounContractAddress = (address: string) => {
  switch (address.toLowerCase()) {
    case config.addresses.nDAOProxy.toLowerCase():
      return 'Nouns DAO Proxy';
    case config.addresses.nAuctionHouseProxy.toLowerCase():
      return 'Nouns Auction House Proxy';
    case config.addresses.nDaoExecutor.toLowerCase():
      return 'Nouns DAO Treasury';
    default:
      return undefined;
  }
};
