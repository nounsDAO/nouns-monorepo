import config from '../config';

export const resolveNounBRContractAddress = (address: string) => {
  switch (address.toLowerCase()) {
    case config.addresses.nounsbrDAOProxy.toLowerCase():
      return 'NounsBR DAO Proxy';
    case config.addresses.nounsbrAuctionHouseProxy.toLowerCase():
      return 'NounsBR Auction House Proxy';
    case config.addresses.nounsbrDaoExecutor.toLowerCase():
      return 'NounsBR DAO Treasury';
    default:
      return undefined;
  }
};
