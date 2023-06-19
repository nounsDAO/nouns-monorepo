import {
  VrbsTokenFactory,
  AuctionHouseFactory,
  DescriptorFactory,
  SeederFactory,
  DaoLogicV2Factory,
} from '@vrbs/contracts';

export interface ContractAddresses {
  vrbsToken: string;
  vrbsSeeder: string;
  vrbsDescriptor: string;
  nftDescriptor: string;
  vrbsAuctionHouse: string;
  vrbsAuctionHouseProxy: string;
  vrbsAuctionHouseProxyAdmin: string;
  vrbsDaoExecutor: string;
  vrbsDAOProxy: string;
  vrbsDAOLogicV1: string;
  vrbsDAOLogicV2?: string;
}

export interface Contracts {
  vrbsTokenContract: ReturnType<typeof VrbsTokenFactory.connect>;
  vrbsAuctionHouseContract: ReturnType<typeof AuctionHouseFactory.connect>;
  vrbsDescriptorContract: ReturnType<typeof DescriptorFactory.connect>;
  vrbsSeederContract: ReturnType<typeof SeederFactory.connect>;
  vrbsDaoContract: ReturnType<typeof DaoLogicV2Factory.connect>;
}

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Kovan = 42,
  Local = 31337,
}
