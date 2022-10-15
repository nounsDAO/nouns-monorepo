import config from '../config';

export const resolveNounContractAddress = (address: string) => {
  switch (address.toLowerCase()) {
    case config.addresses.nounsDAOProxy.toLowerCase():
      return 'NounsBR DAO Proxy';
    case config.addresses.nounsAuctionHouseProxy.toLowerCase():
      return 'NounsBR Auction House Proxy';
    case config.addresses.nounsDaoExecutor.toLowerCase():
      return 'NounsBR DAO Treasury';
    default:
      return undefined;
  }
};
