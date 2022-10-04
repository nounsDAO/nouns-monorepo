import config from '../config';

export const resolveNounContractAddress = (address: string) => {
  switch (address.toLowerCase()) {
    case config.addresses.nounsDAOProxy.toLowerCase():
      return 'Public Nouns DAO Proxy';
    case config.addresses.nounsAuctionHouseProxy.toLowerCase():
      return 'Public Nouns Auction House Proxy';
    case config.addresses.nounsDaoExecutor.toLowerCase():
      return 'Public Nouns DAO Treasury';
    case config.addresses.ogNounsExecutor?.toLowerCase():
      return 'Nouns DAO Treasury';
    default:
      return undefined;
  }
};
