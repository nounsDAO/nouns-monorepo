import {
  N00unsTokenFactory,
  N00unsAuctionHouseFactory,
  N00unsDescriptorFactory,
  N00unsSeederFactory,
  N00unsDaoLogicV2Factory,
} from '@n00uns/contracts';

export interface ContractAddresses {
  n00unsToken: string;
  n00unsSeeder: string;
  n00unsDescriptor: string;
  nftDescriptor: string;
  n00unsAuctionHouse: string;
  n00unsAuctionHouseProxy: string;
  n00unsAuctionHouseProxyAdmin: string;
  n00unsDaoExecutor: string;
  n00unsDAOProxy: string;
  n00unsDAOLogicV1: string;
  n00unsDAOLogicV2?: string;
}

export interface Contracts {
  n00unsTokenContract: ReturnType<typeof N00unsTokenFactory.connect>;
  n00unsAuctionHouseContract: ReturnType<typeof N00unsAuctionHouseFactory.connect>;
  n00unsDescriptorContract: ReturnType<typeof N00unsDescriptorFactory.connect>;
  n00unsSeederContract: ReturnType<typeof N00unsSeederFactory.connect>;
  n00unsDaoContract: ReturnType<typeof N00unsDaoLogicV2Factory.connect>;
}

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Kovan = 42,
  Local = 31337,
}
