import { Contract } from 'ethers';

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  Sepolia = 11155111,
}

// prettier-ignore
export type DescriptorV1ContractNames = 'NFTDescriptor' | 'NounsDescriptor';
// prettier-ignore
export type DescriptorV2ContractNames = 'NFTDescriptorV2' | 'NounsDescriptorV2' | 'SVGRenderer' | 'NounsArt' | 'Inflator';
// prettier-ignore
export type ContractName = DescriptorV2ContractNames | 'NounsSeeder' | 'NounsToken' | 'NounsAuctionHouse' | 'NounsAuctionHouseProxyAdmin' | 'NounsAuctionHouseProxy' | 'NounsDAOExecutor' | 'NounsDAOLogicV1' | 'NounsDAOProxy';
// prettier-ignore
export type ContractNameDescriptorV1 = DescriptorV1ContractNames | 'NounsSeeder' | 'NounsToken' | 'NounsAuctionHouse' | 'NounsAuctionHouseProxyAdmin' | 'NounsAuctionHouseProxy' | 'NounsDAOExecutor' | 'NounsDAOLogicV1' | 'NounsDAOProxy';
// prettier-ignore
export type ContractNamesDAOV2 = Exclude<ContractName, 'NounsDAOLogicV1' | 'NounsDAOProxy'> | 'NounsDAOLogicV2' | 'NounsDAOProxyV2';

export type ContractNamesDAOV3 =
  | Exclude<ContractName, 'NounsDAOLogicV1' | 'NounsDAOProxy' | 'NounsDAOExecutor'>
  | 'NounsDAOLogicV3'
  | 'NounsDAOProxyV3'
  | 'NounsDAOV3Admin'
  | 'NounsDAOV3DynamicQuorum'
  | 'NounsDAOV3Proposals'
  | 'NounsDAOV3Votes'
  | 'NounsDAOV3Fork'
  | 'NounsDAOForkEscrow'
  | 'ForkDAODeployer'
  | 'NounsTokenFork'
  | 'NounsAuctionHouseFork'
  | 'NounsDAOLogicV1Fork'
  | 'NounsDAOExecutorV2'
  | 'NounsDAOExecutorProxy'
  | 'NounsDAOData'
  | 'NounsDAODataProxy';

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
