import { Contract } from 'ethers';

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  Mumbai = 80001,
  Polygon = 137,
  BscTestNet = 97
}

// prettier-ignore
export type DescriptorV1ContractNames = 'NFTDescriptor' | 'Descriptor';
// prettier-ignore
export type DescriptorV2ContractNames = 'NFTDescriptorV2' | 'VrbsTokenV2' | 'DescriptorV2' | 'SVGRenderer' | 'Art' | 'Inflator';

export type DescriptorV3ContractNames =  'VrbsTokenV2';
// prettier-ignore
export type ContractName = DescriptorV2ContractNames | 'Seeder2' | 'VrbsToken' | 'VrbsTokenV2' | 'AuctionHouse' | 'AuctionHouseProxyAdmin' | 'AuctionHouseProxy' | 'DAOExecutor' | 'DAOLogicV1' | 'DAOProxy';
// prettier-ignore
export type ContractNameDescriptorV1 = DescriptorV1ContractNames | 'Seeder' | 'VrbsToken' | 'AuctionHouse' | 'AuctionHouseProxyAdmin' | 'AuctionHouseProxy' | 'DAOExecutor' | 'DAOLogicV1' | 'DAOProxy';
// prettier-ignore
export type ContractNamesDAOV2 = Exclude<ContractName, 'DAOLogicV1' | 'DAOProxy'> | 'DAOLogicV2' | 'DAOProxyV2';

export type ContractNameV2 = DescriptorV3ContractNames | 'VrbsTokenV2' | 'AuctionHouse' | 'AuctionHouseProxyAdmin' | 'AuctionHouseProxy' | 'DAOExecutor' | 'DAOLogicV1' | 'DAOProxy';

export type ContractNamesDAOV3 = Exclude<ContractNameV2, 'DAOLogicV1' | 'DAOProxy'> | 'DAOLogicV2' | 'DAOProxyV2';


export interface ContractDeployment {
  args?: (string | number | (() => string))[];
  libraries?: () => Record<string, string>;
  waitForConfirmation?: boolean;
  validateDeployment?: () => void;
}

export interface DeployedContract {
  name: string;
  address: string;
  instance: Contract;
  constructorArguments: (string | number)[];
  libraries: Record<string, string>;
}

export interface ContractRow {
  Address: string;
  'Deployment Hash'?: string;
}
