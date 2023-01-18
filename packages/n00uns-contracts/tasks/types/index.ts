import { Contract } from 'ethers';

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
}

// prettier-ignore
export type DescriptorV1ContractNames = 'NFTDescriptor' | 'N00unsDescriptor';
// prettier-ignore
export type DescriptorV2ContractNames = 'NFTDescriptorV2' | 'N00unsDescriptorV2' | 'SVGRenderer' | 'N00unsArt' | 'Inflator';
// prettier-ignore
export type ContractName = DescriptorV2ContractNames | 'N00unsSeeder' | 'N00unsToken' | 'N00unsAuctionHouse' | 'N00unsAuctionHouseProxyAdmin' | 'N00unsAuctionHouseProxy' | 'N00unsDAOExecutor' | 'N00unsDAOLogicV1' | 'N00unsDAOProxy';
// prettier-ignore
export type ContractNameDescriptorV1 = DescriptorV1ContractNames | 'N00unsSeeder' | 'N00unsToken' | 'N00unsAuctionHouse' | 'N00unsAuctionHouseProxyAdmin' | 'N00unsAuctionHouseProxy' | 'N00unsDAOExecutor' | 'N00unsDAOLogicV1' | 'N00unsDAOProxy';
// prettier-ignore
export type ContractNamesDAOV2 = Exclude<ContractName, 'N00unsDAOLogicV1' | 'N00unsDAOProxy'> | 'N00unsDAOLogicV2' | 'N00unsDAOProxyV2';

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
