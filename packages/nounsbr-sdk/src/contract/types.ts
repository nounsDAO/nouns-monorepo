import {
  NounsBRTokenFactory,
  NounsBRAuctionHouseFactory,
  NounsBRDescriptorFactory,
  NounsBRSeederFactory,
  NounsBRDaoLogicV1Factory,
} from '@nounsbr/contracts';

export interface ContractAddresses {
  nounsbrToken: string;
  nounsbrSeeder: string;
  nounsbrDescriptor: string;
  nftDescriptor: string;
  nounsbrAuctionHouse: string;
  nounsbrAuctionHouseProxy: string;
  nounsbrAuctionHouseProxyAdmin: string;
  nounsbrDaoExecutor: string;
  nounsbrDAOProxy: string;
  nounsbrDAOLogicV1: string;
}

export interface Contracts {
  nounsbrTokenContract: ReturnType<typeof NounsBRTokenFactory.connect>;
  nounsbrAuctionHouseContract: ReturnType<typeof NounsBRAuctionHouseFactory.connect>;
  nounsbrDescriptorContract: ReturnType<typeof NounsBRDescriptorFactory.connect>;
  nounsbrSeederContract: ReturnType<typeof NounsBRSeederFactory.connect>;
  nounsbrDaoContract: ReturnType<typeof NounsBRDaoLogicV1Factory.connect>;
}

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  Local = 31337,
}
