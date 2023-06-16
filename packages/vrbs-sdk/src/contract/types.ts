import {
  N00unsTokenFactory,
  N00unsAuctionHouseFactory,
  N00unsDescriptorFactory,
  N00unsSeederFactory,
  N00unsDaoLogicV2Factory,
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
  vrbsTokenContract: ReturnType<typeof N00unsTokenFactory.connect>;
  vrbsAuctionHouseContract: ReturnType<typeof N00unsAuctionHouseFactory.connect>;
  vrbsDescriptorContract: ReturnType<typeof N00unsDescriptorFactory.connect>;
  vrbsSeederContract: ReturnType<typeof N00unsSeederFactory.connect>;
  vrbsDaoContract: ReturnType<typeof N00unsDaoLogicV2Factory.connect>;
}

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Kovan = 42,
  Local = 31337,
}
