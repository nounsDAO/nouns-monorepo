import { Contract } from 'ethers';

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  Sepolia = 11155111,
}

export type ContractNamesDAOV3 =
  | 'NFTDescriptorV2'
  | 'NounsDescriptorV3'
  | 'SVGRenderer'
  | 'NounsArt'
  | 'Inflator'
  | 'NounsSeeder'
  | 'NounsToken'
  | 'NounsAuctionHouse'
  | 'NounsAuctionHouseV2'
  | 'NounsAuctionHouseProxyAdmin'
  | 'NounsAuctionHouseProxy'
  | 'NounsDAOLogicV4'
  | 'NounsDAOProxyV3'
  | 'NounsDAOAdmin'
  | 'NounsDAODynamicQuorum'
  | 'NounsDAOProposals'
  | 'NounsDAOVotes'
  | 'NounsDAOFork'
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
