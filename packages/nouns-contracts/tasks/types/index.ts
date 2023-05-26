import { Contract } from 'ethers';

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Kovan = 42,
  Goerli = 5,
  Sepolia = 11155111
}

// prettier-ignore
export type DescriptorV1ContractNames = 'NFTDescriptor' | 'NDescriptor';
// prettier-ignore
export type DescriptorV2ContractNames = 'NFTDescriptorV2' | 'NDescriptorV2' | 'SVGRenderer' | 'NArt' | 'Inflator';
// prettier-ignore
export type ContractName = DescriptorV2ContractNames | 'NSeeder' | 'NToken' | 'NAuctionHouse' | 'NAuctionHouseProxyAdmin' | 'NAuctionHouseProxy' | 'NDAOExecutor' | 'NDAOLogicV1' | 'NDAOProxy';
// prettier-ignore
export type ContractNameDescriptorV1 = DescriptorV1ContractNames | 'NSeeder' | 'NToken' | 'NAuctionHouse' | 'NAuctionHouseProxyAdmin' | 'NAuctionHouseProxy' | 'NDAOExecutor' | 'NDAOLogicV1' | 'NDAOProxy';

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
